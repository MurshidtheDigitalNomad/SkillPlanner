const pool = require('../db')

// Helper to create next-id generators bound to a transaction client
async function createNextIdGenerator(client, tableName, idColumn, prefix, padWidth = 3, prefixLength = 2) {
    const query = `SELECT MAX(CAST(SUBSTRING(${idColumn} FROM ${prefixLength + 1}) AS INTEGER)) AS max FROM ${tableName}`;
    const res = await client.query(query);
    let current = parseInt(res.rows[0]?.max || 0, 10);
    return () => {
        current += 1;
        return `${prefix}${String(current).padStart(padWidth, '0')}`;
    };
}

const generateNewRoadmapID = async () => {
    // Get all existing roadmap IDs to find the next available one
    const query = `SELECT roadmap_id FROM roadmaps ORDER BY roadmap_id`;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
        return 'RM001';
    }

    // Find the next available ID by checking for gaps
    const existingIds = result.rows.map(row => parseInt(row.roadmap_id.replace('RM', ''), 10));
    let nextId = 1;
    
    for (const id of existingIds) {
        if (id === nextId) {
            nextId++;
        } else {
            break;
        }
    }

    return `RM${String(nextId).padStart(3, '0')}`;
};

/**
 * using these values in several functions listed below
 * @param {string} userId
 * @param {{name: string}} roadmap
 * @param {Array<{name: string, position: number, deadline: string, notes?: string, tasks: Array<{name: string}>}>} milestones
 * @returns {Promise<{roadmapId: string, milestones: Array<{milestoneId: string, tasks: Array<{taskId: string}>}>}>}
 */

const addUserRoadmaps = async (userId, roadmap, milestones) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Generate roadmap id using the same transaction client to avoid race conditions
        const nextRoadmapId = await createNextIdGenerator(client, 'roadmaps', 'roadmap_id', 'RM', 3, 2);
        const roadmapId = nextRoadmapId();

        await client.query(
            `INSERT INTO roadmaps (roadmap_id, created_by, name) VALUES ($1, $2, $3)`,
            [roadmapId, userId, roadmap.name]
        );

        // Create generators for milestones and tasks bound to this transaction
        const nextMilestoneId = await createNextIdGenerator(client, 'milestone_goals', 'milestone_id', 'MS', 3, 2);
        const nextTaskId = await createNextIdGenerator(client, 'tasks', 'task_id', 'T', 3, 1);

        const insertedMilestones = [];

        for (const milestone of milestones) {
            const milestoneId = nextMilestoneId();

            await client.query(
                `INSERT INTO milestone_goals (milestone_id, roadmap_id, name, position, deadline, notes, status) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    milestoneId,
                    roadmapId,
                    milestone.name,
                    milestone.position,
                    milestone.deadline,
                    milestone.notes || null,
                    'pending'
                ]
            );

            const insertedTasks = [];
            const tasksArray = milestone.tasks || [];
            for (let taskIndex = 0; taskIndex < tasksArray.length; taskIndex++) {
                const task = tasksArray[taskIndex];
                const taskId = nextTaskId();
                await client.query(
                    `INSERT INTO tasks (task_id, milestone_id, description, task_no, status) VALUES ($1, $2, $3, $4, $5)`,
                    [taskId, milestoneId, task.name, taskIndex + 1, 'pending']
                );
                insertedTasks.push({ taskId });
            }

            insertedMilestones.push({ milestoneId, tasks: insertedTasks });
        }

        await client.query('COMMIT');
        return { roadmapId, milestones: insertedMilestones };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

/**
 * Fetch all roadmaps for a user including milestones and tasks.
 * Returns nested structure: [{ roadmap_id, name, milestones: [{ milestone_id, ... , tasks: [...] }] }]
 */
const getUserRoadmapsWithDetails = async (userId) => {
    // Fetch roadmaps
    const roadmapsResponse = await pool.query(
        `SELECT roadmap_id, name FROM roadmaps WHERE created_by = $1 ORDER BY created_at DESC NULLS LAST, name ASC`,
        [userId]
    );
    const roadmaps = roadmapsResponse.rows;
    if (roadmaps.length === 0) return [];

    const roadmapIds = roadmaps.map(r => r.roadmap_id);

    // Fetch milestones for these roadmaps
    const milestonesRes = await pool.query(
        `SELECT milestone_id, roadmap_id, name, position, deadline, notes, status
         FROM milestone_goals
         WHERE roadmap_id = ANY($1::varchar[]) 
         ORDER BY roadmap_id, position ASC`,
        [roadmapIds]
    );
    const milestones = milestonesRes.rows;
    const milestoneIds = milestones.map(m => m.milestone_id);

    // Fetch tasks for these milestones
    let tasks = [];
    if (milestoneIds.length > 0) {
        const tasksRes = await pool.query(
            `SELECT task_id, milestone_id, description, task_no, status
             FROM tasks
             WHERE milestone_id = ANY($1::varchar[])
             ORDER BY milestone_id, task_no ASC`,
            [milestoneIds]
        );
        tasks = tasksRes.rows;
    }

    // Index tasks by milestone
    const tasksByMilestone = new Map();
    for (const t of tasks) {
        if (!tasksByMilestone.has(t.milestone_id)) tasksByMilestone.set(t.milestone_id, []);
        tasksByMilestone.get(t.milestone_id).push(t);
    }

    // Index milestones by roadmap and attach tasks
    const milestonesByRoadmap = new Map();
    for (const m of milestones) {
        if (!milestonesByRoadmap.has(m.roadmap_id)) milestonesByRoadmap.set(m.roadmap_id, []);
        milestonesByRoadmap.get(m.roadmap_id).push({
            ...m,
            tasks: tasksByMilestone.get(m.milestone_id) || []
        });
    }

    // Attach milestones to roadmaps
    const result = roadmaps.map(r => ({
        ...r,
        milestones: milestonesByRoadmap.get(r.roadmap_id) || []
    }));

    return result;
};
 
const getRoadmapProgress = async (roadmapId) => {
    try {
        // Get roadmap name
        const roadmapRes = await pool.query(
            `SELECT name FROM roadmaps WHERE roadmap_id = $1`,
            [roadmapId]
        );
        const roadmapName = roadmapRes.rows[0]?.name || 'Unknown Roadmap';
        
        // Get milestones count - handle case where status column might not exist
        let milestonesCount;
        try {
            milestonesCount = await pool.query(
                `SELECT COUNT(*) as total_milestones,
                        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_milestones
                 FROM milestone_goals WHERE roadmap_id = $1`,
                [roadmapId]
            );
        } catch (err) {
            // If status column doesn't exist, assume all milestones are pending
            milestonesCount = await pool.query(
                `SELECT COUNT(*) as total_milestones FROM milestone_goals WHERE roadmap_id = $1`,
                [roadmapId]
            );
            milestonesCount.rows[0].completed_milestones = 0;
        }
        
        // Get tasks count
        const tasksCount = await pool.query(
            `SELECT COUNT(*) as total_tasks,
                    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks
             FROM tasks t
             JOIN milestone_goals m ON t.milestone_id = m.milestone_id
             WHERE m.roadmap_id = $1`,
            [roadmapId]
        );
        
        const milestones = milestonesCount.rows[0];
        const tasks = tasksCount.rows[0];
        
        return {
            roadmap_id: roadmapId,
            roadmap_name: roadmapName,
            milestones: {
                total: parseInt(milestones.total_milestones),
                completed: parseInt(milestones.completed_milestones || 0),
                percentage: milestones.total_milestones > 0 
                    ? Math.round((milestones.completed_milestones / milestones.total_milestones) * 100)
                    : 0
            },
            tasks: {
                total: parseInt(tasks.total_tasks),
                completed: parseInt(tasks.completed_tasks),
                percentage: tasks.total_tasks > 0 
                    ? Math.round((tasks.completed_tasks / tasks.total_tasks) * 100)
                    : 0
            }
        };
    } catch (err) {
        throw err;
    }
};

//user progress
const getUserOverallProgress = async (userId) => {
    try {
        const roadmaps = await getUserRoadmapsWithDetails(userId);
        const progressData = await Promise.all(
            roadmaps.map(roadmap => getRoadmapProgress(roadmap.roadmap_id))
        );
        
        return {
            user_id: userId,
            roadmaps: progressData,
            overall: {
                total_roadmaps: roadmaps.length,
                total_milestones: progressData.reduce((sum, r) => sum + r.milestones.total, 0),
                completed_milestones: progressData.reduce((sum, r) => sum + r.milestones.completed, 0),
                total_tasks: progressData.reduce((sum, r) => sum + r.tasks.total, 0),
                completed_tasks: progressData.reduce((sum, r) => sum + r.tasks.completed, 0)
            }
        };
    } catch (err) {
        throw err;
    }
};

/**
 * Delete a roadmap and its dependent milestones and tasks in a single transaction
 * Ensures only the owner's roadmap is removed
 * @param {string} userId
 * @param {string} roadmapId
 */
const deleteUserRoadmapCascade = async (userId, roadmapId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Verify ownership
        const rm = await client.query(
            `SELECT roadmap_id FROM roadmaps WHERE roadmap_id = $1 AND created_by = $2`,
            [roadmapId, userId]
        );
        if (rm.rowCount === 0) {
            throw new Error('Not found or not authorized to delete this roadmap');
        }

        // Collect milestone ids
        const msRes = await client.query(
            `SELECT milestone_id FROM milestone_goals WHERE roadmap_id = $1`,
            [roadmapId]
        );
        const milestoneIds = msRes.rows.map(r => r.milestone_id);

        // Delete tasks for these milestones
        if (milestoneIds.length > 0) {
            await client.query(
                `DELETE FROM tasks WHERE milestone_id = ANY($1::varchar[])`,
                [milestoneIds]
            );
        }

        // Delete milestones
        await client.query(
            `DELETE FROM milestone_goals WHERE roadmap_id = $1`,
            [roadmapId]
        );

        // Delete roadmap
        await client.query(
            `DELETE FROM roadmaps WHERE roadmap_id = $1 AND created_by = $2`,
            [roadmapId, userId]
        );

        await client.query('COMMIT');
        return { roadmapId };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const fetchAllGlobalRoadmaps = async () => {
    const query = `
        SELECT gr.global_RM_id as global_rm_id, gr.name, gr.description,
            gm.global_MS_id as global_ms_id, gm.name as milestone_name,
            gt.global_task_id as global_task_id, gt.description as task_description, gt.task_no
        FROM global_roadmaps gr
        LEFT JOIN global_milestones gm ON gr.global_RM_id = gm.global_RM_id
        LEFT JOIN global_tasks gt ON gm.global_MS_id = gt.global_MS_id
        ORDER BY gr.name, gt.task_no;
    `;

    const result = await pool.query(query);
    
    // Transform the flat results into a nested structure
    const roadmaps = new Map();
    
    result.rows.forEach(row => {
        if (!roadmaps.has(row.global_rm_id)) {
            roadmaps.set(row.global_rm_id, {
                global_rm_id: row.global_rm_id,
                name: row.name,
                description: row.description,
                milestones: new Map()
            });
        }
        
        // Use global_MS_id for milestones
        if (row.global_ms_id && !roadmaps.get(row.global_rm_id).milestones.has(row.global_ms_id)) {
            roadmaps.get(row.global_rm_id).milestones.set(row.global_ms_id, {
                milestone_id: row.global_ms_id,
                name: row.milestone_name,
                // Add other fields if needed
                tasks: []
            });
        }
        
        // Use global_task_id for tasks
        if (row.global_task_id) {
            roadmaps.get(row.global_rm_id).milestones.get(row.global_ms_id).tasks.push({
                task_id: row.global_task_id,
                description: row.task_description,
                task_no: row.task_no
            });
        }
    });

    // Convert Maps to arrays for the final response
    return Array.from(roadmaps.values()).map(roadmap => ({
        ...roadmap,
        milestones: Array.from(roadmap.milestones.values())
    }));
};

// Update module.exports
module.exports = {
    generateNewRoadmapID,
    addUserRoadmaps,
    getUserRoadmapsWithDetails,
    getRoadmapProgress,
    getUserOverallProgress,
    deleteUserRoadmapCascade,
    fetchAllGlobalRoadmaps
};

