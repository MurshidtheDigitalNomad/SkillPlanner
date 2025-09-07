const express = require('express');
const router = express.Router();

//controller functions
const { addCommentController, getCommentsController, getCommentCountController, deleteCommentController } = require('./comment.controller');

router.post('/add', addCommentController);
router.get('/post/:postId', getCommentsController);
router.get('/count/:postId', getCommentCountController);
router.delete('/delete/:commentId', deleteCommentController);

module.exports = router;
