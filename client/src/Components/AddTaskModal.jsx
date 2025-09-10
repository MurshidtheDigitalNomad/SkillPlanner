import React, { useState, useEffect } from 'react';
import { useAuth } from './Contexts/authContext.jsx';
import { useUserRoadmaps } from './Contexts/useRoadmaps.js';

const AddTaskModal = ({ onClose, onAddTask }) => {
    const { authUser } = useAuth();
    const userId = authUser?.id;
    const { data: roadmaps, isLoading, error } = useUserRoadmaps(userId);
    const [selectedRoadmap, setSelectedRoadmap] = useState('');
    const [task, setTask] = useState('');

    // Set default roadmap when roadmaps are loaded
    React.useEffect(() => {
        if (roadmaps && roadmaps.length > 0 && !selectedRoadmap) {
            setSelectedRoadmap(roadmaps[0].roadmap_id);
        }
    }, [roadmaps, selectedRoadmap]);

    const handleAdd = () => {
        if (selectedRoadmap && task.trim()) {
            // Find the selected roadmap details
            const selectedRoadmapData = roadmaps.find(rm => rm.roadmap_id == selectedRoadmap);
            
            console.log('Selected roadmap:', selectedRoadmap);
            console.log('Available roadmaps:', roadmaps);
            console.log('Found roadmap data:', selectedRoadmapData);
            
            // Create temporary task object
            const tempTask = {
                id: Date.now(), // Simple ID for temporary tasks
                roadmapId: selectedRoadmap,
                roadmapName: selectedRoadmapData?.name || 'Unknown Roadmap',
                task: task.trim(),
                completed: false,
                createdAt: new Date().toISOString()
            };

            // Get existing temporary tasks from localStorage
            const existingTasks = JSON.parse(localStorage.getItem('temporaryTasks') || '[]');
            
            // Add new task
            const updatedTasks = [...existingTasks, tempTask];
            
            // Save to localStorage
            localStorage.setItem('temporaryTasks', JSON.stringify(updatedTasks));

            // Call parent callback if provided
            if (onAddTask) {
                onAddTask(tempTask);
            }

            setTask('');
            onClose();
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-[400px] max-w-full border border-black relative">
                    <div className="text-center font-poppins">Loading roadmaps...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-[400px] max-w-full border border-black relative">
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                    <div className="text-center text-red-600 font-poppins">Failed to load roadmaps</div>
                </div>
            </div>
        );
    }

    if (!roadmaps || roadmaps.length === 0) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-[400px] max-w-full border border-black relative">
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                    <h2 className="text-2xl font-extrabold font-rubik text-center text-[#2d39e8] mb-4">No Roadmaps Found</h2>
                    <p className="text-center font-poppins text-gray-600">You need to create a roadmap first before adding tasks.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-[400px] max-w-full border border-black relative">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-2xl font-extrabold font-rubik text-center text-[#2d39e8] mb-8">Add Daily Task</h2>
                <div className="mb-6">
                    <label className="block font-bold mb-2 text-base font-rubik">Select Roadmap</label>
                    <select
                        className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 font-poppins"
                        value={selectedRoadmap}
                        onChange={e => setSelectedRoadmap(e.target.value)}
                    >
                        <option value="">Choose a roadmap...</option>
                        {roadmaps.map((rm) => (
                            <option key={rm.roadmap_id} value={rm.roadmap_id}>{rm.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block font-bold mb-2 text-base font-rubik">Task Description</label>
                    <input
                        type="text"
                        className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 font-poppins"
                        value={task}
                        onChange={e => setTask(e.target.value)}
                        placeholder="Enter your daily task..."
                    />
                </div>
                <button
                    className="w-full bg-[#3b2db8] hover:bg-[#2d39e8] text-white font-bold py-2 px-6 rounded-lg shadow font-rubik text-base disabled:opacity-50"
                    onClick={handleAdd}
                    disabled={!selectedRoadmap || !task.trim()}
                >
                    Add to Daily Tasks
                </button>
            </div>
        </div>
    );
};

export default AddTaskModal;