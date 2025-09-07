import React, { useEffect, useState } from 'react'
import progresstracker from '../assets/progress-tracker.svg'
import UpdateRoadmapProgress from '../Components/UpdateRoadmapProgress';
import taskcalender from '../assets/taskviewer.svg'
import { FiPlus, FiX } from 'react-icons/fi';
import AddTaskModal from '../Components/AddTaskModal';
import trackermessage from '../assets/trackermessage.svg'
import updateprogressicon from '../assets/updateprogress.svg'
import RoadmapStatus from '../Components/RoadmapStatus';
import MilestoneStatus from '../Components/MilestoneStatus';
import { useAuth } from '../Components/Contexts/authContext.jsx';
import { useUserRoadmaps, useUserProgress } from '../Components/Contexts/useRoadmaps.js';

const Tracker = () => {
    const { authUser } = useAuth();
    const userId = authUser?.id; //ensure userID is not null
    const { data: userRoadmaps, isLoading } = useUserRoadmaps(userId); //fetching queries
    const { data: userProgress } = useUserProgress(userId);
    const [modalOpen, setModalOpen] = useState(false);  //state for our modals
    const [selectedRoadmap, setSelectedRoadmap] = useState(null); //state for our selected roadmap
    const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
    const [progressUpdated, setProgressUpdated] = useState(0); //state for our progress 
   
    const today = new Date();
    const monthNames = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];
    const formattedDate = `${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

    //opening and closing our modals
    const openModal = (roadmap) => {
        setSelectedRoadmap(roadmap);
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
        setSelectedRoadmap(null);
    };

    //keeping displayedTasks and its logic
    const [displayedTasks, setDisplayedTasks] = useState([]);
    const [checked, setChecked] = useState({});
    const handleCheck = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

    //deleting tasks from the displayed random list
    const handleDeleteTask = (key) => {
        setDisplayedTasks(prev => prev.filter(task => task.key !== key));
    };

    const handleAddTask = (task) => {
        // Adding new tasks to the Task list
        setDisplayedTasks(prev => [
            ...prev,
            {
                ...task,
                key: `${task.skill}-${task.label}-${Date.now()}`
            }
        ]);
    };

    return (
        <div className="flex justify-center items-center">
            
            {modalOpen && selectedRoadmap && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-8 relative min-w-[350px] min-h-[200px]">
                        <button onClick={closeModal} className="absolute top-2 right-4 text-2xl font-bold">&times;</button>
                        <UpdateRoadmapProgress roadmap={selectedRoadmap} onProgressUpdate={() => setProgressUpdated(p => p + 1)} />
                    </div>
                </div>
            )}
            {addTaskModalOpen && (
                <AddTaskModal
                    onClose={() => setAddTaskModalOpen(false)}
                    onAddTask={handleAddTask}
                />
            )}
            <div className="flex flex-col gap-6 w-[90vw] max-w-[1200px]">
            <div className='flex items-center justify-center ml-10'> <img src={trackermessage} className='h-15'/></div>
                <div className="bg-white h-[30vh] p-8 rounded-2xl shadow-md flex flex-col justify-start">
                    <div className="flex items-center mb-2">
                        <img src={updateprogressicon} alt="Progress Tracker icon" className="w-12 h-8 mb-1" />
                        <span className="font-rubik text-xl font-extrabold ml-2 mb-4">UPDATE YOUR PROGRESS</span>
                    </div>
                    <div className="updateroadmaps flex gap-3 flex-wrap">
                        {isLoading ? (
                            <div className="text-gray-400 font-poppins">Loading roadmaps...</div>
                        ) : !userRoadmaps || userRoadmaps.length === 0 ? (
                            <div className="text-gray-400 font-poppins">No roadmaps yet.</div>
                        ) : (
                            userRoadmaps.map((rm, idx) => (
                                <button
                                    key={rm.roadmap_id || idx}
                                    className="flex-1 h-16 rounded-l text-xl font-extrabold font-rubik bg-gradient-to-r from-blue-300 to-blue-100 flex items-center justify-center min-w-[120px] px-4"
                                    onClick={() => openModal(rm)}
                                >
                                    {rm.name}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="taskadder bg-white h-[40vh] p-8 rounded-2xl shadow-md flex flex-col items-start mb-2 w-full">
                    <div className="flex items-center mb-4">
                        <img src={taskcalender} className="w-10 h-10 mr-2" />
                        <span className="font-rubik text-xl font-extrabold">{formattedDate}- ADD TASKS FOR TODAY</span>
                    </div>
                    <div className="w-full flex flex-col gap-6 mb-8">
                        {displayedTasks.length === 0 ? (
                            <span className="text-gray-400 font-poppins">No tasks added.</span>
                        ) : (
                            displayedTasks.map((task, idx) => (
                                <div key={task.key} className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={!!checked[task.key]}
                                        onChange={() => handleCheck(task.key)}
                                        className="w-6 h-6 border-2 border-black rounded-none mr-2 focus:ring-0"
                                        style={{ accentColor: 'black' }}
                                    />
                                    <span className="bg-blue-100 text-blue-900 font-extrabold text-xs rounded-md px-3 py-1 uppercase font-rubik tracking-wide mr-2">
                                        {task.skill}
                                    </span>
                                    <span className="font-poppins text-base text-black">{task.label}</span>
                                    <button
                                        className="ml-2 text-red-500 hover:text-red-700 text-xl"
                                        onClick={() => handleDeleteTask(task.key)}
                                        title="Delete task"
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                        <button
                            className="w-8 h-8 border-2 border-[#3b2db8] rounded-md flex items-center justify-center text-[#3b2db8] text-xl hover:bg-[#edeaff] transition-colors"
                            onClick={() => setAddTaskModalOpen(true)}
                        >
                            <FiPlus />
                        </button>
                        <button
                            className="bg-[#3b2db8] hover:bg-[#2d39e8] text-white font-bold py-2 px-6 rounded-md shadow font-rubik text-base"
                            onClick={() => setAddTaskModalOpen(true)}
                        >
                            ADD A TASK
                        </button>
                    </div>
                </div>


                <div className="bg-white h-[100vh] p-8 rounded-2xl shadow-md flex flex-col gap-4">
                    <div>
                    <div className="flex items-center mb-2">
                        <img src={progresstracker} alt="Progress Tracker icon" className="w-12 h-8 mb-1" />
                        <span className="font-rubik text-xl font-extrabold ml-2 mb-4">VIEW YOUR STATS</span>
                    </div>
                    </div>
                    <div className="flex-1">
                        <RoadmapStatus userProgress={userProgress} progressUpdated={progressUpdated} />
                    </div>
                    <div className="flex-1 border-2 border-black rounded-2xl mt-2">
                        <MilestoneStatus userProgress={userProgress} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tracker;