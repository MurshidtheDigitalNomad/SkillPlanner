const pool = require('../db')

const generateNewResourceID = async () => {
    const query = `SELECT resource_id FROM resources ORDER BY resource_id DESC LIMIT 1`;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
        return 'RS001';
    }

    const lastID = result.rows[0].resource_id;
    const lastNumber = parseInt(lastID.replace('RS', ''), 10);
    const newNumber = lastNumber + 1;

    return `RS${String(newNumber).padStart(3, '0')}`;
};

const generateNewGlobalMilestoneID = async () => {
    const query = `SELECT global_ms_id FROM global_milestones ORDER BY global_ms_id DESC LIMIT 1`;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
        return 'GMS001';
    }

    const lastID = result.rows[0].global_ms_id;
    const lastNumber = parseInt(lastID.replace('GMS', ''), 10);
    const newNumber = lastNumber + 1;

    return `GMS${String(newNumber).padStart(3, '0')}`;
};

const generateNewGlobalTaskID = async () => {
    const query = `SELECT global_task_id FROM global_tasks ORDER BY global_task_id DESC LIMIT 1`;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
        return 'GT001';
    }

    const lastID = result.rows[0].global_task_id;
    const lastNumber = parseInt(lastID.replace('GT', ''), 10);
    const newNumber = lastNumber + 1;

    return `GT${String(newNumber).padStart(3, '0')}`;
};

const generateNewGlobalRoadmapID = async () => {
    const query = `SELECT gloabl_rm_id FROM global_roadmaps ORDER BY global_rm_id DESC LIMIT 1`;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
        return 'GRM001';
    }

    const lastID = result.rows[0].global_rm_id;
    const lastNumber = parseInt(lastID.replace('GRM', ''), 10);
    const newNumber = lastNumber + 1;

    return `GRM${String(newNumber).padStart(3, '0')}`;
};


const fetchGlobalRoadmapsByResources = async () => {
    // Get unique roadmaps for dropdown
    const query = `SELECT DISTINCT gr.global_RM_id, gr.name
    FROM global_roadmaps gr
    WHERE EXISTS (
        SELECT 1 FROM resources r 
        WHERE r.global_RM_id = gr.global_RM_id
    )
    ORDER BY gr.name;`;

    const result = await pool.query(query);
    return result.rows;
};

const fetchGlobalMilestonesByResources = async () => {
    // Get unique milestones for dropdown
    const query = `SELECT DISTINCT gms.global_MS_id, gms.name
    FROM global_milestones gms
    WHERE EXISTS (
        SELECT 1 FROM resources r 
        WHERE r.global_MS_id = gms.global_MS_id
    )
    ORDER BY gms.name;`;

    const result = await pool.query(query);
    return result.rows;
};

const fetchResourcesByRoadmap = async (roadmapId) => {
    const query = `SELECT r.resource_id, r.url, r.title, r.description, r.type
    FROM resources r
    WHERE r.global_RM_id = $1
    ORDER BY r.title;`;

    const result = await pool.query(query, [roadmapId]);
    return result.rows;
};

const fetchResourcesByMilestone = async (milestoneId) => {
    const query = `SELECT r.resource_id, r.url, r.title, r.description, r.type
    FROM resources r
    WHERE r.global_MS_id = $1
    ORDER BY r.title;`;

    const result = await pool.query(query, [milestoneId]);
    return result.rows;
};

const fetchmilestonesByRoadmap = async (roadmapId) =>{
    // Fetch milestones with their actual tasks from global_tasks table
    const query = `
        SELECT 
            gm.global_ms_id, 
            gm.name,
            gt.global_task_id,
            gt.description as task_name,
            gt.task_no
        FROM global_milestones gm
        LEFT JOIN global_tasks gt ON gm.global_ms_id = gt.global_ms_id
        WHERE gm.global_rm_id = $1
        ORDER BY gm.name ASC, gt.task_no ASC
    `;
    
    const result = await pool.query(query, [roadmapId]);
    
    // Group tasks by milestone
    const milestonesMap = new Map();
    
    result.rows.forEach(row => {
        const milestoneId = row.global_ms_id;
        if (!milestonesMap.has(milestoneId)) {
            milestonesMap.set(milestoneId, {
                global_ms_id: milestoneId,
                name: row.name,
                position: milestonesMap.size + 1,
                notes: '',
                tasks: []
            });
        }
        
        if (row.global_task_id) {
            milestonesMap.get(milestoneId).tasks.push({
                name: row.task_name
            });
        }
    });
    
    // Convert map to array
    const milestonesWithTasks = Array.from(milestonesMap.values());
    
    // If no tasks found, add default tasks
    milestonesWithTasks.forEach(milestone => {
        if (milestone.tasks.length === 0) {
            milestone.tasks = [
                { name: `Learn the basics of ${milestone.name}` },
                { name: `Practice ${milestone.name} concepts` },
                { name: `Build a project using ${milestone.name}` }
            ];
        }
    });
    
    return milestonesWithTasks;
}

async function getOrCreateRoadmap(newRoadmap, roadmapId) {
    if (roadmapId) return roadmapId;
  
    // Check if roadmap exists
    const existing = await pool.query(
      `SELECT global_rm_id FROM global_roadmaps WHERE name = $1`,
      [newRoadmap]
    );
  
    if (existing.rows.length > 0) return existing.rows[0].global_rm_id;
  
    // Insert new roadmap
    const newGlobalRoadmapID= await generateNewGlobalRoadmapID()
    const inserted = await pool.query(
      `INSERT INTO global_roadmaps (name, global_rm_id) VALUES ($1, $2) RETURNING global_rm_id`,
      [newRoadmap, newGlobalRoadmapID]
    );
  
    return inserted.rows[0].global_rm_id;
  }
  
  // Function to get or create a milestone
async function getOrCreateMilestone(newMilestone, milestoneId, roadmapId) {
    if (milestoneId) return milestoneId;
  
    // Check if milestone exists under this roadmap
    const existing = await pool.query(
      `SELECT global_ms_id FROM global_milestones WHERE name = $1 AND global_rm_id = $2`,
      [newMilestone, roadmapId]
    );
  
    if (existing.rows.length > 0) return existing.rows[0].global_ms_id;
  
    // Insert new milestone
    const newGlobalMilestoneID= await generateNewGlobalMilestoneID()
    const inserted = await pool.query(
      `INSERT INTO global_milestones (name, global_rm_id, global_ms_id) VALUES ($1, $2, $3) RETURNING global_ms_id`,
      [newMilestone, roadmapId, newGlobalMilestoneID]
    );
  
    return inserted.rows[0].global_ms_id;
  }
  
  // Function to add resource and link to roadmap & milestone
async function addResource({ title, resourceType, resourceURL, userID, roadmapId, milestoneId }) {
    // Insert resource
    const resourceid = await generateNewResourceID();
    const resourceInsert = await pool.query(
      `INSERT INTO resources (resource_id, title, type, url, added_by, global_ms_id, global_rm_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING resource_id`,
      [resourceid, title, resourceType, resourceURL, userID, milestoneId, roadmapId]
    );
    const resourceId = resourceInsert.rows[0].resource_id;
  
    return resourceId;
}


// Fetch resources by roadmap ID
async function getResourcesByUserRoadmap(roadmapId) {
  try {
    const query = `
      SELECT resource_id, title, type, url
      FROM resources
      WHERE global_rm_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [roadmapId]);
    return result.rows;
  } catch (err) {
    console.error('Error fetching resources by roadmap:', err);
    throw err;
  }
}
  

module.exports = {
    fetchGlobalRoadmapsByResources, 
    fetchGlobalMilestonesByResources,
    fetchResourcesByRoadmap,
    fetchResourcesByMilestone,
    fetchmilestonesByRoadmap,
    getOrCreateMilestone,
    getOrCreateRoadmap,
    addResource,
    getResourcesByUserRoadmap,
    generateNewGlobalTaskID
};