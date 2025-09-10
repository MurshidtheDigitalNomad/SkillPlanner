const express = require('express');
const router = express.Router();

//controller functions
const {getGlobalroadmapsByResources, getGlobalMilestonesByResources, getResourcesByRoadmap, RecommendResources, getResourcesByMilestone, getMilestonesByRoadmap, AddResourcebyUser, getGlobalMilestones}= require('./resources.controller')

router.get('/global_roadmaps', getGlobalroadmapsByResources);
router.get('/global_milestones', getGlobalMilestonesByResources);
router.get('/global_milestones/:roadmapId', getGlobalMilestones);

router.get('/roadmap/:roadmapId', getResourcesByRoadmap);
router.get('/milestone/:milestoneId', getResourcesByMilestone);

router.get('/milestones/:roadmapId', getMilestonesByRoadmap );

router.post('/addresource/:userID', AddResourcebyUser)
router.post('/roadmap/GRM001', RecommendResources)

module.exports = router;