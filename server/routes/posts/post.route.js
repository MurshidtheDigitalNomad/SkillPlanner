const express = require('express');
const router = express.Router();

//controller functions
const { uploadPostController, getAllPostsController, getUserPostsController } = require('./post.controller');

router.post('/upload/:id', uploadPostController);
router.get('/all', getAllPostsController);
router.get('/user/:userId', getUserPostsController);

module.exports = router;