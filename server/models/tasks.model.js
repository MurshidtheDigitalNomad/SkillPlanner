const pool = require('../db')

const generateNewTaskID = async () => {
    // Get all existing task IDs to find the next available one
    const query = `SELECT task_id FROM tasks ORDER BY task_id`;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
        return 'T001';
    }

    // Find the next available ID by checking for gaps
    const existingIds = result.rows.map(row => parseInt(row.task_id.replace('T', ''), 10));
    let nextId = 1;
    
    for (const id of existingIds) {
        if (id === nextId) {
            nextId++;
        } else {
            break;
        }
    }

    return `T${String(nextId).padStart(3, '0')}`;
};


const updateTaskStatus = async (taskId, status) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        await client.query(
            `UPDATE tasks SET status = $1 WHERE task_id = $2`,
            [status, taskId]
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

module.exports = { generateNewTaskID, updateTaskStatus };