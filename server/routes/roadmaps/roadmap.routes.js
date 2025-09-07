const express = require('express');
const router = express.Router();

//controller functions
const {addRoadmap, getUserRoadmaps, getRoadmapProgressController, getUserProgressController, deleteRoadmapController, getGlobalRoadmaps} = require('./roadmap.controller')

router.get('/globalRoadmaps', getGlobalRoadmaps)
router.post('/add/:userid', addRoadmap);
router.get('/:userid', getUserRoadmaps);


//overall roadmap Progress tracking routes
router.get('/:roadmapId/progress', getRoadmapProgressController);
router.get('/user/:userId/progress', getUserProgressController);

// delete roadmap (owner)
router.delete('/:userId/:roadmapId', deleteRoadmapController);

module.exports = router;