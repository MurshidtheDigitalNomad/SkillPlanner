const pool = require('../db');

const generateNewLikeID = async () => {
    const query = `SELECT like_id FROM likes ORDER BY like_id DESC LIMIT 1`;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
        return 'L001';
    }

    const lastID = result.rows[0].like_id;
    const lastNumber = parseInt(lastID.replace('L', ''), 10);
    const newNumber = lastNumber + 1;

    return `L${String(newNumber).padStart(3, '0')}`;
};

const toggleLike = async (userId, postId) => {
    try {
        // Check if user already liked this post
        const checkQuery = `SELECT like_id FROM likes WHERE user_id = $1 AND post_id = $2`;
        const checkResult = await pool.query(checkQuery, [userId, postId]);

        if (checkResult.rows.length > 0) {
            // User already liked, so unlike (remove the like)
            const deleteQuery = `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`;
            await pool.query(deleteQuery, [userId, postId]);
            
            return {
                success: true,
                action: 'unliked',
                message: 'Post unliked successfully'
            };
        } else {
            // User hasn't liked yet, so add like
            const likeId = await generateNewLikeID();
            const insertQuery = `
                INSERT INTO likes (like_id, user_id, post_id, created_at)
                VALUES ($1, $2, $3, NOW())
            `;
            await pool.query(insertQuery, [likeId, userId, postId]);
            
            return {
                success: true,
                action: 'liked',
                message: 'Post liked successfully'
            };
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

const getLikeCount = async (postId) => {
    try {
        const query = `SELECT COUNT(*) as count FROM likes WHERE post_id = $1`;
        const result = await pool.query(query, [postId]);
        
        return {
            success: true,
            count: parseInt(result.rows[0].count)
        };
    } catch (error) {
        console.error('Error getting like count:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

const getUserLikeStatus = async (userId, postId) => {
    try {
        const query = `SELECT like_id FROM likes WHERE user_id = $1 AND post_id = $2`;
        const result = await pool.query(query, [userId, postId]);
        
        return {
            success: true,
            isLiked: result.rows.length > 0
        };
    } catch (error) {
        console.error('Error getting user like status:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    toggleLike,
    getLikeCount,
    getUserLikeStatus,
    generateNewLikeID
};
