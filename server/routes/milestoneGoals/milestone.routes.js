const express = require('express');
const router = express.Router();

const { updateMilestoneStatusController } = require('./milestone.controller');
const { getMilestonesByRoadmap } = require('../resources/resources.controller');

router.put('/:milestoneId/status', updateMilestoneStatusController);
router.get('/:roadmapId', getMilestonesByRoadmap)

module.exports = router;