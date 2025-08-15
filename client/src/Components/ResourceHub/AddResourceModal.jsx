import React, { useState, useEffect } from 'react';
import { useAuth } from '../Contexts/authContext';
import axios from 'axios';

const resourceTypes = ["youtube", "Article", 'External Links', "PDF"];

const AddResourceModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [resourceType, setResourceType] = useState(resourceTypes[0]);
  const [resourceURL, setResourceURL] = useState('');

  const [groadmaps, setGroadmaps] = useState([]);
  const [gmilestones, setGmilestones] = useState([]);

  const [roadmapId, setRoadmapId] = useState('');
  const [milestoneId, setMilestoneId] = useState('');

  const [proadmap, setProadmap] = useState(''); // single name for new roadmap
  const [pmilestone, setPmilestone] = useState(''); // single name for new milestone

  const { authUser } = useAuth();
  const userID = authUser.id;

  // Fetch global roadmaps
  useEffect(() => {
    axios.get(`http://localhost:8000/api/resources/global_roadmaps`)
      .then(res => setGroadmaps(res.data))
      .catch(err => console.error('Error fetching roadmaps:', err));
  }, []);

  // Fetch milestones for the selected roadmap
  useEffect(() => {
    if (roadmapId && roadmapId !== "other") {
      console.log(roadmapId)  
      axios.get(`http://localhost:8000/api/resources/milestones/${roadmapId}`)
        .then(res => setGmilestones(res.data))
        .catch(err => console.error('Error fetching milestones:', err));
    } else {
      setGmilestones([]);
    }
  }, [roadmapId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        roadmapId: roadmapId !== "other" ? roadmapId : null,
        milestoneId: milestoneId !== "other" ? milestoneId : null,
        newRoadmap: roadmapId === "other" ? proadmap.trim() : null,
        newMilestone: milestoneId === "other" ? pmilestone.trim() : null,
        resourceType,
        title: title.trim(),
        resourceURL: resourceURL.trim()
      };

      const response = await axios.post(`http://localhost:8000/api/resources/addresource/${userID}`,formData);

      if (response.status === 200) {
        alert('Resource Submitted, Waiting for review');
        onClose();
      } else {
        alert('Error uploading resource to server, please try again later');
      }
    } catch (err) {
      console.error('Could not submit resource:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-12 w-[700px] max-w-full border border-black relative max-h-[90vh] overflow-y-auto flex flex-col items-center">
        <h2 className="text-2xl font-extrabold font-rubik text-center text-[#2d39e8] mb-6">
          CONTRIBUTE A RESOURCE
        </h2>

        <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Roadmap Selection */}
          <div>
            <select
              className="w-full border p-2 rounded"
              value={roadmapId}
              onChange={(e) => setRoadmapId(e.target.value)}
              required
            >
              <option value="">Select Roadmap</option>
              {groadmaps.map(r => (
                <option key={r.global_rm_id} value={r.global_rm_id}>
                  {r.name}
                </option>
              ))}
              <option value="other">Other (Create New)</option>
            </select>

            {roadmapId === "other" && (
              <input
                type="text"
                placeholder="Enter new roadmap name"
                value={proadmap}
                onChange={(e) => setProadmap(e.target.value)}
                className="w-full border p-2 rounded mt-2"
                required
              />
            )}
          </div>

          {/* Milestone Selection */}
          <div>
            <select
              className="w-full border p-2 rounded"
              value={milestoneId}
              onChange={(e) => setMilestoneId(e.target.value)}
              required
            >
              <option value="">Select Milestone</option>
              {gmilestones.map(m => (
                <option key={m.global_ms_id} value={m.global_ms_id}>
                  {m.name}
                </option>
              ))}
              <option value="other">Other (Create New)</option>
            </select>

            {milestoneId === "other" && (
              <input
                type="text"
                placeholder="Enter new milestone name"
                value={pmilestone}
                onChange={(e) => setPmilestone(e.target.value)}
                className="w-full border p-2 rounded mt-2"
                required
              />
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-poppins font-semibold mb-1">Title</label>
            <input
              type="text"
              placeholder="Resource Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Resource Type */}
          <div>
            <label className="block text-xs font-poppins font-semibold mb-1">Resource Type</label>
            <select
              className="w-full border border-gray-400 font-poppins rounded px-2 py-2 text-base"
              value={resourceType}
              onChange={e => setResourceType(e.target.value)}
            >
              {resourceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Resource URL */}
          <div>
            <label className="block text-xs font-poppins font-semibold mb-1">Resource URL</label>
            <input
              className="w-full border border-gray-400 font-poppins rounded px-2 py-2 text-base"
              placeholder='www.resourceexample.com'
              type='text'
              value={resourceURL}
              onChange={e => setResourceURL(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex w-full justify-between mt-8 gap-4">
            <button
              type="button"
              className="bg-red-400 hover:bg-red-500 text-white text-xs font-rubik font-bold py-2 px-4 rounded"
              onClick={onClose}
            >
              GO BACK
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#85b4fa] to-[#e8f2f8] text-xs hover:from-blue-400 hover:to-blue-200 font-rubik text-blue-900 font-bold py-2 px-4 rounded"
            >
              SUBMIT RESOURCE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResourceModal;
