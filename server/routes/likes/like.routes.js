const express = require('express');
const router = express.Router();

//controller functions
const { toggleLikeController, getLikeCountController, getUserLikeStatusController } = require('./like.controller');

router.post('/toggle', toggleLikeController);
router.get('/count/:postId', getLikeCountController);
router.get('/status/:userId/:postId', getUserLikeStatusController);

module.exports = router;
