const pool = require('../db')

const generateNewPostID = async () => {
    const query = `SELECT post_id FROM posts ORDER BY post_id DESC LIMIT 1`;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
        return 'P001';
    }

    const lastID = result.rows[0].post_id;
    const lastNumber = parseInt(lastID.replace('P', ''), 10);
    const newNumber = lastNumber + 1;

    return `P${String(newNumber).padStart(3, '0')}`;
};

const uploadPost = async (userId, content) => {
    try {
        const postId = await generateNewPostID();
        
        const query = `
            INSERT INTO posts (post_id, user_id, content, created_at)
            VALUES ($1, $2, $3, NOW())
            RETURNING post_id, user_id, content, created_at
        `;
        
        const result = await pool.query(query, [postId, userId, content]);
        
        if (result.rows.length > 0) {
            return {
                success: true,
                post: result.rows[0]
            };
        } else {
            return {
                success: false,
                error: 'Failed to create post'
            };
        }
    } catch (error) {
        console.error('Error uploading post:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

const getAllPosts = async () => {
    try {
        const query = `
            SELECT 
                p.post_id, 
                p.user_id, 
                p.content, 
                p.created_at, 
                u.name as user_name,
                COALESCE(like_counts.like_count, 0) as like_count,
                COALESCE(comment_counts.comment_count, 0) as comment_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN (
                SELECT post_id, COUNT(*) as like_count 
                FROM likes 
                GROUP BY post_id
            ) like_counts ON p.post_id = like_counts.post_id
            LEFT JOIN (
                SELECT post_id, COUNT(*) as comment_count 
                FROM comments 
                GROUP BY post_id
            ) comment_counts ON p.post_id = comment_counts.post_id
            ORDER BY p.created_at DESC
        `;
        
        const result = await pool.query(query);
        
        return {
            success: true,
            posts: result.rows
        };
    } catch (error) {
        console.error('Error fetching posts:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

const getPostsByUser = async (userId) => {
    try {
        const query = `
            SELECT 
                p.post_id, 
                p.user_id, 
                p.content, 
                p.created_at, 
                u.name as user_name,
                COALESCE(like_counts.like_count, 0) as like_count,
                COALESCE(comment_counts.comment_count, 0) as comment_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN (
                SELECT post_id, COUNT(*) as like_count 
                FROM likes 
                GROUP BY post_id
            ) like_counts ON p.post_id = like_counts.post_id
            LEFT JOIN (
                SELECT post_id, COUNT(*) as comment_count 
                FROM comments 
                GROUP BY post_id
            ) comment_counts ON p.post_id = comment_counts.post_id
            WHERE p.user_id = $1
            ORDER BY p.created_at DESC
        `;
        
        const result = await pool.query(query, [userId]);
        
        return {
            success: true,
            posts: result.rows
        };
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    uploadPost,
    generateNewPostID,
    getAllPosts,
    getPostsByUser
};