const pool = require('../db')

const generateNewRoadmapID = async () => {
    const query = `SELECT roadmap_id FROM roadmaps ORDER BY roadmap_id DESC LIMIT 1`;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
        return 'RM001';
    }

    const lastID = result.rows[0].roadmap_id;
    const lastNumber = parseInt(lastID.replace('RM', ''), 10);
    const newNumber = lastNumber + 1;

    return `RM${String(newNumber).padStart(3, '0')}`;
};

