const pool = require('../db')

const generateNewMilestoneID = async () => {
    const query = `SELECT milestone_id FROM milestone_goals ORDER BY milestone_id DESC LIMIT 1`;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
        return 'MS001';
    }

    const lastID = result.rows[0].milestone_id;
    const lastNumber = parseInt(lastID.replace('MS', ''), 10);
    const newNumber = lastNumber + 1;

    return `MS${String(newNumber).padStart(3, '0')}`;
};
