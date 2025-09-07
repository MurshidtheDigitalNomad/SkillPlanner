import React, { useState } from 'react';
import milestonemessage from '../assets/milestonemessage.svg'
import {useAuth} from './Contexts/authContext.jsx';
import axios from 'axios';

const MilestonePlannerModal = ({ onClose }) => {
    const {authUser} = useAuth();
    const user_id = authUser.id
    

    const [userRoadmap, setUserRoadmap] = useState({name:''});
    const [userMilestone, setUserMilestone] = useState([
      { name: '', position: 0, deadline: '', tasks: [{ name: '' }], notes: '' }
    ]);

    const handleMilestoneChange = (idx, field, value) => {
        const newMilestones = [...userMilestone];
        newMilestones[idx][field] = value;
        setUserMilestone(newMilestones);
    };

    const handleTaskChange = (milestoneIdx, taskIdx, value) => {
        const newMilestones = [...userMilestone];
        const milestoneToUpdate = { ...newMilestones[milestoneIdx] };
        const tasksCopy = milestoneToUpdate.tasks.map((t, idx) => idx === taskIdx ? { ...t, name: value } : t);
        milestoneToUpdate.tasks = tasksCopy;
        newMilestones[milestoneIdx] = milestoneToUpdate;
        setUserMilestone(newMilestones);
    };

    const handleAddTask = (milestoneIdx) => {
        const newMilestones = [...userMilestone];
        const milestoneToUpdate = { ...newMilestones[milestoneIdx] };
        const tasksCopy = [...milestoneToUpdate.tasks, { name: '' }];
        milestoneToUpdate.tasks = tasksCopy;
        newMilestones[milestoneIdx] = milestoneToUpdate;
        setUserMilestone(newMilestones);
    };

    const handleRemoveTask = (milestoneIdx, taskIdx) => {
        const newMilestones = [...userMilestone];
        const milestoneToUpdate = { ...newMilestones[milestoneIdx] };
        if (milestoneToUpdate.tasks.length > 1) {
            const tasksCopy = milestoneToUpdate.tasks.filter((_, idx) => idx !== taskIdx);
            milestoneToUpdate.tasks = tasksCopy;
            newMilestones[milestoneIdx] = milestoneToUpdate;
            setUserMilestone(newMilestones);
        }
    };

    const handleAddMilestone = () => {
        setUserMilestone([
            ...userMilestone,
            { name: '', position: userMilestone.length, deadline: '', tasks: [{ name: '' }], notes: '' }
        ]);
    };

    const handleRemoveMilestone = (idx) => {
        if (userMilestone.length > 1) {
            const newMilestones = userMilestone.filter((_, index) => index !== idx);
            // Update positions after removal
            const updatedMilestones = newMilestones.map((milestone, index) => ({
                ...milestone,
                position: index
            }));
            setUserMilestone(updatedMilestones);
        }
    };

    const validateForm = () => {
        if (!userRoadmap.name.trim()) {
            alert('Please enter a roadmap name');
            return false;
        }

        for (let i = 0; i < userMilestone.length; i++) {
            const milestone = userMilestone[i];
            if (!milestone.name.trim()) {
                alert(`Please enter a name for milestone ${i + 1}`);
                return false;
            }
            if (!milestone.deadline) {
                alert(`Please set a deadline for milestone ${i + 1}`);
                return false;
            }
            
            const hasValidTask = milestone.tasks.some(task => task.name.trim());
            if (!hasValidTask) {
                alert(`Please add at least one task for milestone ${i + 1}`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Clean up data before sending
        const cleanedMilestones = userMilestone.map(milestone => ({
            ...milestone,
            tasks: milestone.tasks.filter(task => task.name.trim()) // Remove empty tasks
        }));

        try{
            const response = await axios.post(`http://localhost:8000/api/roadmaps/add/${user_id}`, {
               roadmap: userRoadmap,
               milestones: cleanedMilestones
            });
            
            if (response.status === 200 || response.status === 201) {
                alert('Roadmap and milestones saved successfully');
                console.log(response.data)
                onClose();
            } else {
                alert('Error saving roadmap and milestones');
            }
        } catch(err) {
            console.error('Error:', err);
            alert('Error uploading roadmap to server, please try again');
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-12 w-[700px] max-w-full border border-black relative max-h-[90vh] overflow-y-auto flex flex-col items-center">
                <form className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
                    <input
                        className="text-xl font-extrabold font-rubik text-center text-[#2d39e8] font-poppins mb-2 tracking-wide w-full outline-none border-b-2 border-[#2d39e8] bg-transparent placeholder-[#2d39e8]"
                        type="text"
                        placeholder="Enter your goal/skill"
                        value={userRoadmap.name}
                        onChange={e => setUserRoadmap({...userRoadmap, name: e.target.value})}
                        required
                    />
                    <div> <img src={milestonemessage} /></div>

                    <div className="bg-[#f8fcff] rounded-xl w-full px-8 py-10 flex flex-col items-center gap-2">

                        {userMilestone.map((milestone, idx) => (
                            <div key={idx} className="w-full mb-8 last:mb-0">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-semibold font-rubik text-center flex-1">
                                        Milestone goal {milestone.position + 1}
                                    </h2>
                                    {userMilestone.length > 1 && (
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
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-poppins font-semibold mb-1">Deadline</label>
                                        <input
                                            className="w-full border font-poppins border-gray-400 rounded px-2 py-1 text-sm"
                                            type="date"
                                            value={milestone.deadline}
                                            onChange={e => handleMilestoneChange(idx, 'deadline', e.target.value)}
                                            required
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
                        ))}
                    </div>
                    
                    <div className="flex w-full justify-between mt-8 gap-4">
                        <button 
                            type="button"
                            className="bg-red-400 hover:bg-red-500 text-white text-xs font-rubik font-bold py-2 px-4 rounded" 
                            onClick={onClose}
                        >
                            GO BACK
                        </button>
                        <button 
                            type="button"
                            className="bg-[#2d39e8] hover:bg-blue-800 text-white font-rubik text-xs font-bold py-2 px-4 rounded" 
                            onClick={handleAddMilestone}
                        >
                            ADD ANOTHER MILESTONE
                        </button>
                        <button 
                            className="bg-gradient-to-r from-[#85b4fa] to-[#e8f2f8] text-xs hover:from-blue-400 hover:to-blue-200 font-rubik text-blue-900 font-bold py-2 px-4 rounded" 
                            type='submit'
                        >
                            START LEARNING!
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MilestonePlannerModal;