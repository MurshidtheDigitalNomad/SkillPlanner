const { uploadPost, getAllPosts, getPostsByUser } = require('../../models/posts.model');

const uploadPostController = async (req, res) => {
    try {
        const { id: userId } = req.params;
        const { content } = req.body;

        // Validate input
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Post content is required'
            });
        }

        // Upload post to database
        const result = await uploadPost(userId, content.trim());

        if (result.success) {
            res.status(201).json({
                success: true,
                message: 'Post uploaded successfully',
                post: result.post
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error || 'Failed to upload post'
            });
        }
    } catch (error) {
        console.error('Error in uploadPostController:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

const getAllPostsController = async (req, res) => {
    try {
        const result = await getAllPosts();

        if (result.success) {
            res.status(200).json({
                success: true,
                posts: result.posts
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error || 'Failed to fetch posts'
            });
        }
    } catch (error) {
        console.error('Error in getAllPostsController:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

const getUserPostsController = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }

        const result = await getPostsByUser(userId);

        if (result.success) {
            res.status(200).json({
                success: true,
                posts: result.posts
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error || 'Failed to fetch user posts'
            });
        }
    } catch (error) {
        console.error('Error in getUserPostsController:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

module.exports = {
    uploadPostController,
    getAllPostsController,
    getUserPostsController
};
