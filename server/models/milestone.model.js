const pool = require('../db')

const generateNewMilestoneID = async () => {
    // Get all existing milestone IDs to find the next available one
    const query = `SELECT milestone_id FROM milestone_goals ORDER BY milestone_id`;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
        return 'MS001';
    }

    // Find the next available ID by checking for gaps
    const existingIds = result.rows.map(row => parseInt(row.milestone_id.replace('MS', ''), 10));
    let nextId = 1;
    
    for (const id of existingIds) {
        if (id === nextId) {
            nextId++;
        } else {
            break;
        }
    }

    return `MS${String(nextId).padStart(3, '0')}`;
};

const updateMilestoneStatus = async (milestoneId, status) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        await client.query(
            `UPDATE milestone_goals SET status = $1 WHERE milestone_id = $2`,
            [status, milestoneId]
        );
        
        await client.query('COMMIT');
        return { success: true };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const fetchGlobalMilestonesByRoadmap = async (globalRoadmapId) => {
    // 1. Fetch milestones
    const milestonesQuery = `
        SELECT gm.global_MS_id, gm.name, gm.description
        FROM global_milestones gm
        WHERE gm.global_RM_id = $1
        ORDER BY gm.global_MS_id ASC
    `;
    const milestonesResult = await pool.query(milestonesQuery, [globalRoadmapId]);
    const milestones = milestonesResult.rows;

    if (milestones.length === 0) return [];

    // 2. Fetch tasks for all milestones
    const milestoneIds = milestones.map(m => m.global_ms_id);
    const tasksQuery = `
        SELECT gt.global_task_id, gt.description, gt.task_no, gt.global_ms_id
        FROM global_tasks gt
        WHERE gt.global_ms_id = ANY($1::varchar[])
        ORDER BY gt.global_ms_id, gt.task_no ASC
    `;
    const tasksResult = await pool.query(tasksQuery, [milestoneIds]);
    const tasks = tasksResult.rows;

    // 3. Attach tasks to milestones
    const tasksByMilestone = {};
    for (const t of tasks) {
        if (!tasksByMilestone[t.global_ms_id]) tasksByMilestone[t.global_ms_id] = [];
        tasksByMilestone[t.global_ms_id].push({
            name: t.description,
            task_no: t.task_no
        });
    }

    // 4. Return milestones with tasks
    return milestones.map(m => ({
        ...m,
        tasks: tasksByMilestone[m.global_ms_id] || []
    }));
};

module.exports = {
    generateNewMilestoneID,
    updateMilestoneStatus,
    fetchGlobalMilestonesByRoadmap
};