const express = require('express');
const router = express.Router();

const { updateTaskStatusController } = require('./task.controller');

router.put('/:taskId/status', updateTaskStatusController);

module.exports = router;