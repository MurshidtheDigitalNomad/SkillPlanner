import React, { useEffect, useState } from 'react';

const AddTaskModal = ({ onClose, onAddTask }) => {
    const [roadmaps, setRoadmaps] = useState([]);
    const [selectedRoadmap, setSelectedRoadmap] = useState('');
    const [task, setTask] = useState('');

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('userRoadmaps') || '[]');
        setRoadmaps(stored);
        if (stored.length > 0) setSelectedRoadmap(stored[0].skill);
    }, []);

    const handleAdd = () => {
        if (selectedRoadmap && task.trim()) {
            onAddTask({ skill: selectedRoadmap, label: task.trim() });
            setTask('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-[400px] max-w-full border border-black relative">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-2xl font-extrabold font-rubik text-center text-[#2d39e8] mb-8">Add Task</h2>
                <div className="mb-6">
                    <label className="block font-bold mb-2 text-base font-rubik">Select Roadmap</label>
                    <select
                        className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 font-poppins"
                        value={selectedRoadmap}
                        onChange={e => setSelectedRoadmap(e.target.value)}
                    >
                        {roadmaps.map((rm, idx) => (
                            <option key={idx} value={rm.skill}>{rm.skill}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block font-bold mb-2 text-base font-rubik">Add Task</label>
                    <input
                        type="text"
                        className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 font-poppins"
                        value={task}
                        onChange={e => setTask(e.target.value)}
                        placeholder="Enter your task..."
                    />
                </div>
                <button
                    className="w-full bg-[#3b2db8] hover:bg-[#2d39e8] text-white font-bold py-2 px-6 rounded-lg shadow font-rubik text-base"
                    onClick={handleAdd}
                >
                    Add to Task List
                </button>
            </div>
        </div>
    );
};

export default AddTaskModal;