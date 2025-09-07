const pool = require('../db');

const generateNewCommentID = async () => {
    const query = `SELECT comment_id FROM comments ORDER BY comment_id DESC LIMIT 1`;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
        return 'C001';
    }

    const lastID = result.rows[0].comment_id;
    const lastNumber = parseInt(lastID.replace('C', ''), 10);
    const newNumber = lastNumber + 1;

    return `C${String(newNumber).padStart(3, '0')}`;
};

const addComment = async (userId, postId, content) => {
    try {
        const commentId = await generateNewCommentID();
        
        const query = `
            INSERT INTO comments (comment_id, user_id, post_id, content, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING comment_id, user_id, post_id, content, created_at
        `;
        
        const result = await pool.query(query, [commentId, userId, postId, content.trim()]);
        
        if (result.rows.length > 0) {
            return {
                success: true,
                comment: result.rows[0]
            };
        } else {
            return {
                success: false,
                error: 'Failed to create comment'
            };
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

const getCommentsByPost = async (postId) => {
    try {
        const query = `
            SELECT c.comment_id, c.user_id, c.content, c.created_at, u.name as user_name
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = $1
            ORDER BY c.created_at ASC
        `;
        
        const result = await pool.query(query, [postId]);
        
        return {
            success: true,
            comments: result.rows
        };
    } catch (error) {
        console.error('Error getting comments:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

const getCommentCount = async (postId) => {
    try {
        const query = `SELECT COUNT(*) as count FROM comments WHERE post_id = $1`;
        const result = await pool.query(query, [postId]);
        
        return {
            success: true,
            count: parseInt(result.rows[0].count)
        };
    } catch (error) {
        console.error('Error getting comment count:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

const deleteComment = async (commentId, userId) => {
    try {
        // First check if the comment exists and belongs to the user
        const checkQuery = `SELECT comment_id FROM comments WHERE comment_id = $1 AND user_id = $2`;
        const checkResult = await pool.query(checkQuery, [commentId, userId]);

        if (checkResult.rows.length === 0) {
            return {
                success: false,
                error: 'Comment not found or you do not have permission to delete it'
            };
        }

        // Delete the comment
        const deleteQuery = `DELETE FROM comments WHERE comment_id = $1 AND user_id = $2`;
        const result = await pool.query(deleteQuery, [commentId, userId]);

        if (result.rowCount > 0) {
            return {
                success: true,
                message: 'Comment deleted successfully'
            };
        } else {
            return {
                success: false,
                error: 'Failed to delete comment'
            };
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    addComment,
    getCommentsByPost,
    getCommentCount,
    deleteComment,
    generateNewCommentID
};
