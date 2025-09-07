const { toggleLike, getLikeCount, getUserLikeStatus } = require('../../models/likes.model');

const toggleLikeController = async (req, res) => {
    try {
        const { userId, postId } = req.body;

        // Validate input
        if (!userId || !postId) {
            return res.status(400).json({
                success: false,
                error: 'User ID and Post ID are required'
            });
        }

        // Toggle like
        const result = await toggleLike(userId, postId);

        if (result.success) {
            // Get updated like count
            const countResult = await getLikeCount(postId);
            
            res.status(200).json({
                success: true,
                action: result.action,
                message: result.message,
                likeCount: countResult.success ? countResult.count : 0
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error || 'Failed to toggle like'
            });
        }
    } catch (error) {
        console.error('Error in toggleLikeController:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

const getLikeCountController = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({
                success: false,
                error: 'Post ID is required'
            });
        }

        const result = await getLikeCount(postId);

        if (result.success) {
            res.status(200).json({
                success: true,
                likeCount: result.count
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error || 'Failed to get like count'
            });
        }
    } catch (error) {
        console.error('Error in getLikeCountController:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

const getUserLikeStatusController = async (req, res) => {
    try {
        const { userId, postId } = req.params;

        if (!userId || !postId) {
            return res.status(400).json({
                success: false,
                error: 'User ID and Post ID are required'
            });
        }

        const result = await getUserLikeStatus(userId, postId);

        if (result.success) {
            res.status(200).json({
                success: true,
                isLiked: result.isLiked
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error || 'Failed to get like status'
            });
        }
    } catch (error) {
        console.error('Error in getUserLikeStatusController:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

module.exports = {
    toggleLikeController,
    getLikeCountController,
    getUserLikeStatusController
};
