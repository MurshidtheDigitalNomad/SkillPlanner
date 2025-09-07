const { addComment, getCommentsByPost, getCommentCount, deleteComment } = require('../../models/comments.model');

const addCommentController = async (req, res) => {
    try {
        const { userId, postId, content } = req.body;

        // Validate input
        if (!userId || !postId || !content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'User ID, Post ID, and content are required'
            });
        }

        // Add comment
        const result = await addComment(userId, postId, content.trim());

        if (result.success) {
            // Get updated comment count
            const countResult = await getCommentCount(postId);
            
            res.status(201).json({
                success: true,
                message: 'Comment added successfully',
                comment: result.comment,
                commentCount: countResult.success ? countResult.count : 0
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error || 'Failed to add comment'
            });
        }
    } catch (error) {
        console.error('Error in addCommentController:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

const getCommentsController = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({
                success: false,
                error: 'Post ID is required'
            });
        }

        const result = await getCommentsByPost(postId);

        if (result.success) {
            res.status(200).json({
                success: true,
                comments: result.comments
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error || 'Failed to get comments'
            });
        }
    } catch (error) {
        console.error('Error in getCommentsController:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

const getCommentCountController = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({
                success: false,
                error: 'Post ID is required'
            });
        }

        const result = await getCommentCount(postId);

        if (result.success) {
            res.status(200).json({
                success: true,
                commentCount: result.count
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error || 'Failed to get comment count'
            });
        }
    } catch (error) {
        console.error('Error in getCommentCountController:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

const deleteCommentController = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body;

        // Validate input
        if (!commentId || !userId) {
            return res.status(400).json({
                success: false,
                error: 'Comment ID and User ID are required'
            });
        }

        // Delete comment
        const result = await deleteComment(commentId, userId);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: result.message
            });
        } else {
            res.status(400).json({
                success: false,
                error: result.error || 'Failed to delete comment'
            });
        }
    } catch (error) {
        console.error('Error in deleteCommentController:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

module.exports = {
    addCommentController,
    getCommentsController,
    getCommentCountController,
    deleteCommentController
};
