import React, { useState, useEffect } from 'react';
import milestonemessage from '../assets/milestonemessage.svg'
import axios from 'axios';
import { useAuth } from './Contexts/authContext.jsx';

const SearchMilestonePlanner = ({ roadmap, onClose }) => {
    const { authUser } = useAuth();
    const userId = authUser?.id;
    
    // Prefer name from global roadmaps, fallback to skill
    const [skill, setSkill] = useState(roadmap?.name || roadmap?.skill || '');
    const [milestones, setMilestones] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch global roadmap data when component mounts
    useEffect(() => {
        // Ensure skill is populated if we got roadmap name
        if (!skill && (roadmap?.name || roadmap?.skill)) {
            setSkill(roadmap?.name || roadmap?.skill);
        }
        if (roadmap?.global_rm_id) {
            fetchGlobalRoadmapData(roadmap.global_rm_id);
        } else if (roadmap?.name || roadmap?.skill) {
            // If no global roadmap ID, try to find it by name
            searchGlobalRoadmapByName(roadmap.name || roadmap.skill);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roadmap]);  

    const searchGlobalRoadmapByName = async (skillName) => {
        try {
            setIsLoading(true);
            // Search for global roadmap by name
            const response = await axios.get(`http://localhost:8000/api/roadmaps/globalRoadmaps`);
            const foundRoadmap = response.data.find(rm => 
                rm.name.toLowerCase().includes(skillName.toLowerCase())
            );
            
            if (foundRoadmap) {
                setSkill(foundRoadmap.name);
                await fetchGlobalRoadmapData(foundRoadmap.global_rm_id);
            } else {
                // If no roadmap found, create a default milestone
                setSkill(skillName);
                setMilestones([{
                    name: 'Getting Started',
                    deadline: '',
                    tasks: [{ name: 'Learn the basics' }, { name: 'Set up your environment' }, { name: 'Create your first project' }],
                    notes: 'Start your learning journey with this roadmap',
                    position: 1
                }]);
            }
        } catch (error) {
            console.error('Error searching global roadmap:', error);
            // Fallback to default milestone if API fails
            setSkill(skillName);
            setMilestones([{
                name: 'Getting Started',
                deadline: '',
                tasks: [{ name: 'Learn the basics' }, { name: 'Set up your environment' }, { name: 'Create your first project' }],
                notes: 'Start your learning journey with this roadmap',
                position: 1
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchGlobalRoadmapData = async (globalRoadmapId) => {
        try {
            setIsLoading(true);
            // Fetch milestones for this global roadmaps
            console.log(globalRoadmapId);
            const response = await axios.get(`http://localhost:8000/api/milestone/${globalRoadmapId}`);
            console.log(response.status, response.data);
            if (response.data && response.data.length > 0) {
                const formattedMilestones = response.data.map((milestone, index) => ({
                    name: milestone.name || '',
                    deadline: '',
                    tasks: milestone.tasks?.map(t => ({ name: t.name })) || [],
                    notes: milestone.notes || '',
                    position: milestone.position || index + 1
                }));
                setMilestones(formattedMilestones);
            } else {
                // If no milestones found, create a default one
                setMilestones([{
                    name: 'Getting Started',
                    deadline: '',
                    tasks: [{ name: 'Learn the basics' }, { name: 'Set up your environment' }, { name: 'Create your first project' }],
                    notes: 'Start your learning journey with this roadmap',
                    position: 1
                }]);
            }
        } catch (error) {
            console.error('Error fetching global roadmap data:', error);
            // Fallback to default milestone if API fails
            setMilestones([{
                name: 'Getting Started',
                deadline: '',
                tasks: [{ name: 'Learn the basics' }, { name: 'Set up your environment' }, { name: 'Create your first project' }],
                notes: 'Start your learning journey with this roadmap',
                position: 1
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMilestoneChange = (idx, field, value) => {
        const newMilestones = [...milestones];
        newMilestones[idx][field] = value;
        setMilestones(newMilestones);
    };

    const handleTaskChange = (milestoneIdx, taskIdx, value) => {
        const newMilestones = [...milestones];
        const milestoneToUpdate = { ...newMilestones[milestoneIdx] };
        const tasksCopy = milestoneToUpdate.tasks.map((t, idx) => idx === taskIdx ? { ...t, name: value } : t);
        milestoneToUpdate.tasks = tasksCopy;
        newMilestones[milestoneIdx] = milestoneToUpdate;
        setMilestones(newMilestones);
    };

    const handleAddTask = (milestoneIdx) => {
        const newMilestones = [...milestones];
        const milestoneToUpdate = { ...newMilestones[milestoneIdx] };
        const tasksCopy = [...milestoneToUpdate.tasks, { name: '' }];
        milestoneToUpdate.tasks = tasksCopy;
        newMilestones[milestoneIdx] = milestoneToUpdate;
        setMilestones(newMilestones);
    };

    const handleRemoveTask = (milestoneIdx, taskIdx) => {
        const newMilestones = [...milestones];
        const milestoneToUpdate = { ...newMilestones[milestoneIdx] };
        if (milestoneToUpdate.tasks.length > 1) {
            const tasksCopy = milestoneToUpdate.tasks.filter((_, idx) => idx !== taskIdx);
            milestoneToUpdate.tasks = tasksCopy;
            newMilestones[milestoneIdx] = milestoneToUpdate;
            setMilestones(newMilestones);
        }
    };

    const addMilestone = () => {
        setMilestones([...milestones, { 
            name: '', 
            deadline: '', 
            tasks: [{ name: '' }], 
            notes: '', 
            position: milestones.length + 1 
        }]);
    };

    const handleRemoveMilestone = (idx) => {
        if (milestones.length > 1) {
            const newMilestones = milestones.filter((_, index) => index !== idx);
            // Update positions after removal
            const updatedMilestones = newMilestones.map((milestone, index) => ({
                ...milestone,
                position: index + 1
            }));
            setMilestones(updatedMilestones);
        }
    };

    const handleStartLearning = async () => {
        if (!skill.trim()) {
            alert('Please enter a roadmap name');
            return;
        }
        
        if (!userId) {
            alert('Please log in to start learning this roadmap.');
            return;
        }
        
        if (!milestones || milestones.length === 0) {
            alert('No milestones found for this roadmap.');
            return;
        }
        
        try {
            setIsLoading(true);
            
            // Convert milestones to the format expected by the backend
            const formattedMilestones = milestones.map((milestone, index) => ({
                name: milestone.name,
                position: milestone.position || index + 1,
                deadline: milestone.deadline || null,
                notes: milestone.notes || null,
                tasks: milestone.tasks.filter(task => task.name && task.name.trim()).map((t, i) => ({ name: t.name.trim() }))
            }));

            const payload = { roadmap: { name: skill }, milestones: formattedMilestones };
            const url = `http://localhost:8000/api/roadmaps/add/${userId}`;
            console.log('[SearchMilestonePlanner] POST', url, payload);

            // Add roadmap to user's roadmaps via backend
            const response = await axios.post(url, payload);
            console.log('[SearchMilestonePlanner] add response', response.status, response.data);

            if (response.status === 201 || response.status === 200) {
                alert('Roadmap added to your learning journey!');
                onClose();
            } else {
                alert('Unexpected server response. Please try again.');
            }
        } catch (error) {
            console.error('Error adding roadmap:', error?.response || error);
            alert(error?.response?.data?.error || 'Error adding roadmap. Please check the server logs.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white rounded-2xl shadow-lg p-12 w-[700px] max-w-full border border-black relative max-h-[90vh] overflow-y-auto flex flex-col items-center">
                    <div className="text-center text-lg">Loading roadmap data...</div>
                    <div className="mt-4 text-sm text-gray-500">Please wait while we fetch the roadmap details...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-12 w-[700px] max-w-full border border-black relative max-h-[90vh] overflow-y-auto flex flex-col items-center">
                <input
                    className="text-xl font-extrabold font-rubik text-center text-[#2d39e8] font-poppins mb-2 tracking-wide w-full outline-none border-b-2 border-[#2d39e8] bg-transparent placeholder-[#2d39e8]"
                    type="text"
                    placeholder="Enter your goal/skill"
                    value={skill}
                    onChange={e => setSkill(e.target.value)}
                />
                <div> <img src={milestonemessage} /></div>

                <div className="bg-[#f8fcff] rounded-xl w-full px-8 py-10 flex flex-col items-center gap-2">
                    {milestones.length === 0 ? (
                        <div className="text-center text-gray-500">
                            No milestones found for this roadmap. Please add some milestones.
                        </div>
                    ) : (
                        milestones.map((milestone, idx) => (
                            <div key={idx} className="w-full mb-8 last:mb-0">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-semibold font-rubik text-center flex-1">
                                        Milestone goal {milestone.position}
                                    </h2>
                                    {milestones.length > 1 && (
                                        <button
                                            type="button"
                                            className="text-red-500 font-bold text-xl ml-2"
                                            onClick={() => handleRemoveMilestone(idx)}
                                            title="Remove milestone"
                                        >×</button>
                                    )}
                                </div>
                                
                                <div className="w-full flex flex-col gap-4">
                                    <div>
                                        <label className="block text-xs font-poppins font-semibold mb-1">Name</label>
                                        <input
                                            className="w-full border border-gray-400 font-poppins rounded px-2 py-1 text-sm"
                                            type="text"
                                            placeholder="Milestone name"
                                            value={milestone.name}
                                            onChange={e => handleMilestoneChange(idx, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-poppins font-semibold mb-1">Deadline</label>
                                        <input
                                            className="w-full border font-poppins border-gray-400 rounded px-2 py-1 text-sm"
                                            type="date"
                                            value={milestone.deadline}
                                            onChange={e => handleMilestoneChange(idx, 'deadline', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-poppins font-semibold mb-1">Tasks</label>
                                        {milestone.tasks.map((task, taskIdx) => (
                                            <div key={taskIdx} className="flex items-center mb-2">
                                                <span className="mr-2 text-xs font-bold">{taskIdx + 1}.</span>
                                                <input
                                                    className="flex-1 border font-poppins border-gray-400 rounded px-2 py-1 text-sm"
                                                    type="text"
                                                    placeholder={`Task ${taskIdx + 1}`}
                                                    value={task.name}
                                                    onChange={e => handleTaskChange(idx, taskIdx, e.target.value)}
                                                />
                                                {milestone.tasks.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="ml-2 text-red-500 font-bold"
                                                        onClick={() => handleRemoveTask(idx, taskIdx)}
                                                    >×</button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="mt-2 text-blue-600 font-bold flex items-center"
                                            onClick={() => handleAddTask(idx)}
                                        >
                                            <span className="text-xl mr-1">+</span> Add Task
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-poppins font-semibold mb-1">Notes (optional)</label>
                                        <textarea
                                            className="w-full border font-poppins border-gray-400 rounded px-2 py-1 text-sm"
                                            placeholder="Notes"
                                            value={milestone.notes}
                                            onChange={e => handleMilestoneChange(idx, 'notes', e.target.value)}
                                            rows="2"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex w-full justify-between mt-8 gap-4">
                    <button className="bg-red-400 hover:bg-red-500 text-white text-xs font-rubik font-bold py-2 px-4 rounded" onClick={onClose}>GO BACK</button>
                    <button className="bg-[#2d39e8] hover:bg-blue-800 text-white font-rubik text-xs font-bold py-2 px-4 rounded" onClick={addMilestone}>ADD ANOTHER MILESTONE</button>
                    <button 
                        className="bg-gradient-to-r from-[#85b4fa] to-[#e8f2f8] text-xs hover:from-blue-400 hover:to-blue-200 font-rubik text-blue-900 font-bold py-2 px-4 rounded" 
                        onClick={handleStartLearning}
                        disabled={isLoading}
                    >
                        {isLoading ? 'ADDING...' : 'START LEARNING!'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchMilestonePlanner;