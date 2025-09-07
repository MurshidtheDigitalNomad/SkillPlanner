const { addUserRoadmaps, getUserRoadmapsWithDetails, getRoadmapProgress, getUserOverallProgress, deleteUserRoadmapCascade, fetchAllGlobalRoadmaps } = require('../../models/roadmaps.model');

// POST /api/roadmaps/add/:userid
// Body: { roadmap: { name }, milestones: [{ name, position, deadline, notes?, tasks: [{ name }] }] }
const addRoadmap = async (req, res) => {
    try {
        const { userid } = req.params;
        const { roadmap, milestones } = req.body;

        // Basic validation with clearer messages
        if (!userid) {
            return res.status(400).json({ error: 'Missing user id in URL' });
        }
        if (!roadmap || !roadmap.name || !roadmap.name.trim()) {
            return res.status(400).json({ error: 'Missing roadmap name' });
        }
        if (!Array.isArray(milestones) || milestones.length === 0) {
            return res.status(400).json({ error: 'Milestones must be a non-empty array' });
        }

        // Normalize payload
        const normalizedMilestones = milestones.map((m, idx) => ({
            name: m.name,
            position: typeof m.position === 'number' ? m.position : idx + 1,
            deadline: m.deadline || null,
            notes: m.notes || null,
            tasks: Array.isArray(m.tasks) ? m.tasks.filter(t => t && t.name && t.name.trim()) : []
        }));

        // Log for diagnostics
        console.log('[addRoadmap] user:', userid, 'roadmap:', roadmap.name, 'milestones:', normalizedMilestones.length);

        const result = await addUserRoadmaps(userid, { name: roadmap.name.trim() }, normalizedMilestones);
        return res.status(201).json({ message: 'Roadmap created', ...result });
    } catch (err) {
        console.error('Error adding roadmap:', err);

        // Common Postgres error mapping
        const msg = err?.message || 'Failed to add roadmap';
        if (msg.includes('foreign key') || msg.includes('violates foreign key constraint')) {
            return res.status(400).json({ error: 'Invalid user id. Please ensure the user exists before adding a roadmap.' });
        }
        if (msg.includes('duplicate key value') || msg.includes('unique constraint')) {
            return res.status(500).json({ error: 'ID generation conflict while saving. Please retry.' });
        }
        return res.status(500).json({ error: 'Failed to add roadmap', details: msg });
    }
};

// GET /api/roadmaps/:userid
const getUserRoadmaps = async (req, res) => {
    try {
        const { userid } = req.params;
        const data = await getUserRoadmapsWithDetails(userid);
        return res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching user roadmaps:', err);
        return res.status(500).json({ error: 'Failed to fetch user roadmaps', details: err.message });
    }
};


// GET /api/roadmaps/:roadmapId/progress
const getRoadmapProgressController = async (req, res) => {
    try {
        const { roadmapId } = req.params;
        const progress = await getRoadmapProgress(roadmapId);
        return res.status(200).json(progress);
    } catch (err) {
        console.error('Error fetching roadmap progress:', err);
        return res.status(500).json({ error: 'Failed to fetch roadmap progress', details: err.message });
    }
};

// GET /api/roadmaps/user/:userId/progress
const getUserProgressController = async (req, res) => {
    try {
        const { userId } = req.params;
        const progress = await getUserOverallProgress(userId);
        return res.status(200).json(progress);
    } catch (err) {
        console.error('Error fetching user progress:', err);
        return res.status(500).json({ error: 'Failed to fetch user progress', details: err.message });
    }
};


// DELETE /api/roadmaps/:userId/:roadmapId
const deleteRoadmapController = async (req, res) => {
    try {
        const { userId, roadmapId } = req.params;
        if (!userId || !roadmapId) {
            return res.status(400).json({ error: 'Missing userId or roadmapId' });
        }
        await deleteUserRoadmapCascade(userId, roadmapId);
        return res.status(200).json({ message: 'Roadmap deleted', roadmapId });
    } catch (err) {
        const msg = err?.message || 'Failed to delete roadmap';
        const status = msg.includes('Not found') ? 404 : 500;
        return res.status(status).json({ error: 'Failed to delete roadmap', details: msg });
    }
};

const getGlobalRoadmaps = async (req, res) => {
    try {
        const roadmaps_names = await fetchAllGlobalRoadmaps();
        console.log('Fetched roadmaps:', roadmaps_names);
        
        if (!roadmaps_names || roadmaps_names.length === 0) {
            console.log('No roadmaps found in database');
            return res.status(200).json([]);
        }
        
        res.status(200).json(roadmaps_names);
    } catch (error) {
        console.error('Error fetching global roadmaps:', error);
        res.status(500).json({ 
            error: 'Failed to fetch global roadmaps',
            details: error.message 
        });
    }
};
module.exports = { 
    addRoadmap, 
    getUserRoadmaps,
    getRoadmapProgressController,
    getUserProgressController,
    deleteRoadmapController,
    getGlobalRoadmaps
};


