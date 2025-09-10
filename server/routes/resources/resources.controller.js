const {fetchGlobalRoadmapsByResources, fetchGlobalMilestonesByResources, fetchResourcesByRoadmap, getResourcesByUserRoadmap, fetchResourcesByMilestone, fetchmilestonesByRoadmap, getOrCreateMilestone, getOrCreateRoadmap, addResource} = require('../../models/resources.model');

const getGlobalroadmapsByResources = async (req, res) => {
    try {
        const roadmaps_names = await fetchGlobalRoadmapsByResources();
        console.log('Fetched roadmaps:', roadmaps_names);
        
        if (!roadmaps_names || roadmaps_names.length === 0) {
            console.log('No roadmaps found in database');
            return res.status(200).json([]);
        }
        

        
        res.status(200).json(roadmaps_names);
    } catch (error) {
        console.error('Error fetching global roadmaps:', error);
        res.status(500).json({ 
            error: 'Failed to fetch global roadmaps',
            details: error.message 
        });
    }
};

const getGlobalMilestones = async (req, res) => {
    try {
        const { roadmapId } = req.params;
        if (!roadmapId) {
            return res.status(400).json({ message: 'Roadmap ID is required' });
        }
        const milestones = await fetchGlobalMilestonesByResources(roadmapId);
        res.json(milestones);
    } catch (err) {
        console.error('Error fetching global milestones:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getGlobalMilestonesByResources = async (req, res) => {
    try {
        // This endpoint should not be used anymore - milestones should be fetched by roadmap
        // Return empty array or error message
        res.status(400).json({ 
            error: 'This endpoint is deprecated. Use /global_milestones/:roadmapId instead',
            message: 'Please select a roadmap first to fetch its milestones'
        });
    } catch (error) {
        console.error('Error fetching global milestones:', error);
        res.status(500).json({ 
            error: 'Failed to fetch global milestones',
            details: error.message 
        });
    }
};

const getResourcesByRoadmap = async (req, res) => {
    try {
        const { roadmapId } = req.params;

        
        const resources = await fetchResourcesByRoadmap(roadmapId);
        console.log('Fetched resources for roadmap:', roadmapId, resources);
        res.status(200).json(resources);
    } catch (error) {
        console.error('Error fetching resources by roadmap:', error);
        res.status(500).json({ 
            error: 'Failed to fetch resources by roadmap',
            details: error.message 
        });
    }
};

const getResourcesByMilestone = async (req, res) => {
    try {
        const { milestoneId } = req.params;
        const resources = await fetchResourcesByMilestone(milestoneId);
        console.log('Fetched resources for milestone:', milestoneId, resources);
        res.status(200).json(resources);
    } catch (error) {
        console.error('Error fetching resources by milestone:', error);
        res.status(500).json({ 
            error: 'Failed to fetch resources by milestone',
            details: error.message 
        });
    }
};

const getMilestonesByRoadmap = async(req, res)=>{
    try{
        const {roadmapId} = req.params;
        console.log('Params: ', req.params)
        console.log('Received roadmapID: ', roadmapId)
        const milestonesByRoadmaps = await fetchmilestonesByRoadmap(roadmapId);
        console.log(`Milestones of selected roadmaps: `, milestonesByRoadmaps)
        res.status(200).json(milestonesByRoadmaps)

    }catch(err){
        console.error('Error fetching milestones of selected roadmap:', err);
    }
}

async function AddResourcebyUser(req, res) {
    const userID = req.params.userID;
    const {
      roadmapId,
      milestoneId,
      newRoadmap,
      newMilestone,
      resourceType,
      title,
      resourceURL
    } = req.body;
  
    try {
      // Get or create roadmap
      const finalRoadmapId = await getOrCreateRoadmap(newRoadmap, roadmapId);
  
      // Get or create milestone
      const finalMilestoneId = await getOrCreateMilestone(newMilestone, milestoneId, finalRoadmapId);
  
      // Add resource and link to roadmap & milestone
      const resourceId = await addResource({
        title,
        resourceType,
        resourceURL,
        userID,
        roadmapId: finalRoadmapId,
        milestoneId: finalMilestoneId
      });
  
      res.status(200).json({ message: 'Resource added successfully!', resourceId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong while adding resource' });
    }
  }

  async function RecommendResources(req, res) {
    try {
      roadmapId = 'GRM001'
  
      const resources = await getResourcesByUserRoadmap(roadmapId);
      return res.status(200).json(resources);
    } catch (err) {
      console.error('Error in RecommendedResources controller:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  

module.exports = {
    getGlobalroadmapsByResources, 
    getGlobalMilestonesByResources,
    getGlobalMilestones,
    getResourcesByRoadmap,
    getResourcesByMilestone,
    getMilestonesByRoadmap,
    AddResourcebyUser,
    RecommendResources
};