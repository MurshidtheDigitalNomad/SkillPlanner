const express = require('express');
const router = express.Router();

//controller functions
const {getGlobalroadmaps, getGlobalMilestones, getResourcesByRoadmap, RecommendResources, getResourcesByMilestone, getMilestonesByRoadmap, AddResourcebyUser}= require('./resources.controller')

router.get('/global_roadmaps', getGlobalroadmaps);
router.get('/global_milestones', getGlobalMilestones);
router.get('/roadmap/:roadmapId', getResourcesByRoadmap);
router.get('/milestone/:milestoneId', getResourcesByMilestone);
router.get('/milestones/:roadmapId', getMilestonesByRoadmap );
router.post('/addresource/:userID', AddResourcebyUser)
router.post('/roadmap/GRM001', RecommendResources)

module.exports = router;