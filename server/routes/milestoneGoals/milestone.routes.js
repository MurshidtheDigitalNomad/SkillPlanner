const express = require('express');
const router = express.Router();

const { updateMilestoneStatusController, getGlobalMilestonesByRoadmap } = require('./milestone.controller');

router.put('/:milestoneId/status', updateMilestoneStatusController);
router.get('/:roadmapId', getGlobalMilestonesByRoadmap);

module.exports = router;