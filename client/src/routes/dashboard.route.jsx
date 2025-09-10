import React, { useState, useEffect } from 'react';
import Navbar from "../Components/Navbar/Navbar";
import Sidebar from "../Components/Sidebar";
import progresstracker from "../assets/progress-tracker.svg"
import taskviewer from "../assets/taskviewer.svg"
import resourceicon from "../assets/resourcehub.svg"
import communityshortcut from "../assets/communityshortcut.svg"
import { useAuth } from '../Components/Contexts/authContext.jsx';
import { useUserRoadmaps, useUserProgress } from '../Components/Contexts/useRoadmaps.js';
import { useResourceCount, usePostCount } from '../Components/Contexts/useResources.js';
import hammerbullet from '../assets/hammerbullet.svg'

const Dashboard = () => {
    const { authUser } = useAuth();
    const userId = authUser?.id;
    const { data: userRoadmaps, isLoading } = useUserRoadmaps(userId);
    const { data: userProgress } = useUserProgress(userId);
    const { resourceCount, loading: resourcesLoading } = useResourceCount();
    const { postCount, loading: postsLoading } = usePostCount();
    const [temporaryTasks, setTemporaryTasks] = useState([]);

    // Load temporary tasks from localStorage
    useEffect(() => {
        const loadTemporaryTasks = () => {
            const storedTasks = JSON.parse(localStorage.getItem('temporaryTasks') || '[]');
            setTemporaryTasks(storedTasks);
        };
        loadTemporaryTasks();
    }, []);

    return (
        <div className="flex min-h-screen w-full">
            
            <div className=" w-[85vw] flex flex-col ">
               
                <div className="shortcuts flex flex-col gap-8 mr-10 w-full">
                  
                    <div className="flex gap-8 w-full">

                        <div className="bg-white rounded-xl shadow flex-1 h-80 flex flex-col">
                            <div className="flex items-center gap-2 font-rubik text-xl font-extrabold mt-5 ml-5">
                                <img src={progresstracker} className="w-10 h-10" alt="progress tracker"/>
                                <span>YOUR CURRENT PROGRESS</span>
                            </div>
                            <div className="flex-1 p-5 overflow-y-auto">
                                {!userProgress ? (
                                    <div className="text-gray-500 font-poppins">Loading progress...</div>
                                ) : userProgress.roadmaps?.length === 0 ? (
                                    <div className="text-gray-500 font-poppins">No roadmaps created yet.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {userProgress.roadmaps.map((roadmap, idx) => (
                                            <div key={roadmap.roadmap_id || idx} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg">
                                                <span className="font-semibold font-rubik text-lg text-gray-800">
                                                    {roadmap.roadmap_name}
                                                </span>
                                                <span className="font-bold font-rubik text-lg text-blue-600">
                                                    {roadmap.milestones.percentage}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow flex-1 h-80 flex flex-col">
                            <div className="tasks flex items-center gap-2 font-rubik text-xl font-extrabold mt-5 ml-5">
                                <img src={taskviewer} className="w-10 h-10"/>
                                <span>SEPTEMBER 10, 2025</span>
                            </div>
                            <div className="flex-1 p-5 overflow-y-auto">
                                {temporaryTasks.length === 0 ? (
                                    <div className="text-gray-500 font-poppins">No tasks added for today.</div>
                                ) : (
                                    <ul className="space-y-2">
                                        {temporaryTasks.map((task, idx) => (
                                            <li key={task.id || idx} className="flex items-start gap-2">
                                                <span className="text-blue-600 mt-1"><img src={hammerbullet} className="w-10 h-10"/></span>
                                                <div className="flex-1">
                                                    <span className="font-poppins text-lg text-gray-800">
                                                        {task.task}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                  
                    <div className="flex gap-8 w-full">

                        <div className="bg-white rounded-xl shadow" style={{width: '35%'}}>
                            <div className="h-80 flex flex-col">
                                <div className="resourcehub flex items-center gap-2 font-rubik text-xl font-extrabold mt-5 ml-5">
                                    <img src={resourceicon} className="w-10 h-10"/>
                                    <span>CHECK OUT UPDATES FROM RESOURCE HUB</span>
                                </div>
                                <div className="flex-1 p-5 flex items-center justify-center">
                                    {resourcesLoading ? (
                                        <div className="text-gray-500 font-poppins">Loading resources...</div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="text-5xl font-bold font-rubik text-blue-600">
                                                {resourceCount}
                                            </div>
                                            <div className="text-xl font-bold font-rubik text-gray-600 uppercase tracking-wide mt-2">
                                                NEW RESOURCES OUT
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow" style={{width: '65%'}}>
                            <div className="h-80 flex flex-col ">
                                <div className="communityshortcut flex items-center gap-2 font-rubik text-xl font-extrabold mt-5 ml-5">
                                    <img src={communityshortcut} className="w-10 h-10"/>
                                    <span>WHAT'S HAPPENING IN THE COMMUNITY TODAY?</span>
                                </div>
                                <div className="flex-1 p-5 flex items-center justify-center">
                                    {postsLoading ? (
                                        <div className="text-gray-500 font-poppins">Loading posts...</div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="text-5xl font-bold font-rubik text-blue-600">
                                                {postCount}
                                            </div>
                                            <div className="text-xl font-bold font-rubik text-gray-600 uppercase tracking-wide mt-2">
                                                COMMUNITY POSTS TODAY- CHECK THEM OUT!
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;