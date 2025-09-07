const { updateMilestoneStatus, fetchGlobalMilestonesByRoadmap } = require('../../models/milestone.model');

const updateMilestoneStatusController = async (req, res) => {
    try {
        const { milestoneId } = req.params;
        const { status } = req.body;
        
        if (!status || !['completed', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be "completed" or "pending"' });
        }
        
        const result = await updateMilestoneStatus(milestoneId, status);
        return res.status(200).json(result);
    } catch (err) {
        console.error('Error updating milestone status:', err);
        return res.status(500).json({ error: 'Failed to update milestone status', details: err.message });
    }
};

const getGlobalMilestonesByRoadmap = async (req, res) => {
    try {
        const { roadmapId } = req.params;
        const milestonegoals = await fetchGlobalMilestonesByRoadmap(roadmapId);
        console.log('Fetched milestones:', milestonegoals);    
        res.status(200).json(milestonegoals);
    } catch (error) {
        console.error('Error fetching global milestones:', error);
        res.status(500).json({ 
            error: 'Failed to fetch global milestones',
            details: error.message 
        });
    }
};

module.exports = { updateMilestoneStatusController, getGlobalMilestonesByRoadmap };