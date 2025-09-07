const { updateTaskStatus } = require('../../models/tasks.model');

const updateTaskStatusController = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        
        if (!status || !['completed', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be "completed" or "pending"' });
        }
        
        const result = await updateTaskStatus(taskId, status);
        return res.status(200).json(result);
    } catch (err) {
        console.error('Error updating task status:', err);
        return res.status(500).json({ error: 'Failed to update task status', details: err.message });
    }
};

module.exports = { updateTaskStatusController };
