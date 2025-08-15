const pool = require('../db')

const generateNewTaskID = async () => {
    const query = `SELECT task_id FROM tasks ORDER BY task_id DESC LIMIT 1`;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
        return 'T001';
    }

    const lastID = result.rows[0].task_id;
    const lastNumber = parseInt(lastID.replace('T', ''), 10);
    const newNumber = lastNumber + 1;

    return `T${String(newNumber).padStart(3, '0')}`;
};