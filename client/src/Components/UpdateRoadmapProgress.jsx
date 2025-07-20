import React, { useEffect, useState } from 'react';

const UpdateRoadmapProgress = ({ roadmapSkill }) => {
    const [roadmap, setRoadmap] = useState(null);
    const [taskCompletion, setTaskCompletion] = useState({}); 
    const [milestoneCompletion, setMilestoneCompletion] = useState({}); 

    useEffect(() => {
        const userRoadmaps = JSON.parse(localStorage.getItem('userRoadmaps') || '[]');
        const found = userRoadmaps.find(rm => rm.skill === roadmapSkill);
        setRoadmap(found || null);
        // Load progress from localStorage if exists
        const progress = JSON.parse(localStorage.getItem(`progress_${roadmapSkill}`) || '{}');
        setTaskCompletion(progress.taskCompletion || {});
        setMilestoneCompletion(progress.milestoneCompletion || {});
    }, [roadmapSkill]);

    const handleTaskCheck = (milestoneIdx, taskIdx) => {
        setTaskCompletion(prev => {
            const updated = {
                ...prev,
                [milestoneIdx]: {
                    ...prev[milestoneIdx],
                    [taskIdx]: !prev[milestoneIdx]?.[taskIdx]
                }
            };
            saveProgress(updated, milestoneCompletion);
            return updated;
        });
    };

    const handleMilestoneCheck = (milestoneIdx) => {
        setMilestoneCompletion(prev => {
            const updated = {
                ...prev,
                [milestoneIdx]: !prev[milestoneIdx]
            };
            saveProgress(taskCompletion, updated);
            return updated;
        });
    };

    const saveProgress = (taskComp, milestoneComp) => {
        localStorage.setItem(
            `progress_${roadmapSkill}`,
            JSON.stringify({ taskCompletion: taskComp, milestoneCompletion: milestoneComp })
        );
    };

    if (!roadmap) return (
        <div className="text-center text-gray-500">No roadmap found.</div>
    );

    // Count completed tasks and milestones
    let completedTasks = 0;
    let totalTasks = 0;
    let completedMilestones = 0;
    let totalMilestones = roadmap.milestones.length;
    roadmap.milestones.forEach((ms, msIdx) => {
        if (milestoneCompletion[msIdx]) completedMilestones++;
        if (ms.task) {
            const tasks = Array.isArray(ms.task) ? ms.task : ms.task.split(',').map(t => t.trim()).filter(Boolean);
            totalTasks += tasks.length;
            tasks.forEach((_, tIdx) => {
                if (taskCompletion[msIdx]?.[tIdx]) completedTasks++;
            });
        }
    });

    return (
        <div className="bg-white rounded-2xl shadow-lg p-12 w-[1100px] max-w-full border border-black relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-extrabold font-rubik text-center text-[#2d39e8] mb-8">{roadmap.skill}</h2>
            <div className="mb-4 flex gap-8 justify-center">
                <div className="font-bold text-base">Tasks Completed: {completedTasks} / {totalTasks}</div>
                <div className="font-bold text-base">Milestones Completed: {completedMilestones} / {totalMilestones}</div>
            </div>
            <div className="w-full overflow-x-auto pb-6 scrollbar-hide">
                <div className="flex flex-row items-start flex-nowrap gap-8">
                    {roadmap.milestones.map((ms, idx) => {
                        const tasks = ms.task
                            ? (Array.isArray(ms.task) ? ms.task : ms.task.split(',').map(t => t.trim()).filter(Boolean))
                            : [];
                        return (
                            <div
                                key={idx}
                                className="flex flex-col items-center min-w-[260px] relative mx-4 bg-white p-4 rounded-xl shadow-sm"
                            >
                                {idx !== 0 && (
                                    <div
                                        className="absolute left-[-110px] top-6 h-1 bg-blue-200 z-0"
                                        style={{ width: '100px' }}
                                    ></div>
                                )}
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-[#2d39e8] flex items-center justify-center text-white font-bold z-10 mb-2 text-base">
                                        {idx + 1}
                                    </div>
                                    <div className="font-extrabold text-xl whitespace-nowrap font-rubik mb-2">{ms.name}</div>
                                    <div className="text-base mb-2 mt-2">
                                        <span className="text-lg">❗</span>
                                        <div className="inline-flex items-center bg-gradient-to-r from-red-400 to-red-600 text-white rounded px-3 py-1 font-semibold shadow gap-2 text-base">
                                            {ms.deadline}
                                        </div>
                                    </div>
                                    {tasks.length > 0 && (
                                        <div className="flex flex-col gap-2 w-full mt-2">
                                            {tasks.map((task, tIdx) => (
                                                <label key={tIdx} className="flex items-center gap-2 text-base font-poppins">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!taskCompletion[idx]?.[tIdx]}
                                                        onChange={() => handleTaskCheck(idx, tIdx)}
                                                        className="accent-blue-500 w-4 h-4"
                                                    />
                                                    <span>{task}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                    {ms.notes && (
                                        <div className="text-base font-poppins mt-2"><span className="font-bold">Notes: </span>{ms.notes}</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
               
                <div className="mt-8">
                    <div className="font-extrabold text-xl font-rubik mb-2">Update your milestone goals:</div>
                    <div className="flex flex-row flex-wrap gap-10 justify-center items-center">
                        {roadmap.milestones.map((ms, idx) => (
                            <label key={idx} className="flex items-center gap-2 text-base font-poppins">
                                <input
                                    type="checkbox"
                                    checked={!!milestoneCompletion[idx]}
                                    onChange={() => handleMilestoneCheck(idx)}
                                    className="accent-green-600 w-5 h-5"
                                />
                                <span>{ms.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateRoadmapProgress;