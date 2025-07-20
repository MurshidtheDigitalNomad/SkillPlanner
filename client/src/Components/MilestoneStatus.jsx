import React, { useEffect, useState } from 'react';

const getMilestoneStats = (roadmap) => {
    const progress = JSON.parse(localStorage.getItem(`progress_${roadmap.skill}`) || '{}');
    const { milestoneCompletion = {} } = progress;
    const total = roadmap.milestones.length;
    const completed = Object.values(milestoneCompletion).filter(Boolean).length;
    const remaining = total - completed;
    return { completed, remaining };
};

const MilestoneStatus = () => {
    const [roadmaps, setRoadmaps] = useState([]);
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('userRoadmaps') || '[]');
        setRoadmaps(stored);
        setStats(stored.map(rm => getMilestoneStats(rm)));
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-start gap-4">
            <h2 className={'text-xl font-extrabold mt-4 font-rubik text-center mb-2'}>STATUS OF YOUR MILESTONE GOALS</h2>
            <div className="grid grid-cols-3 w-[600px] mb-2">
                <div className="col-span-1 px-8 py-2 rounded-tl-lg font-extrabold text-sm font-rubik bg-gradient-to-r from-blue-400 to-blue-100 text-black text-center">ROADMAP</div>
                <div className="col-span-1 px-8 py-2 font-extrabold text-sm font-rubik bg-green-500 text-black text-center">COMPLETED MILESTONES</div>
                <div className="col-span-1 px-8 py-2 font-extrabold text-sm font-rubik bg-red-400 text-black text-center">REMAINING MILESTONES</div>
            </div>
            <div className="w-full flex flex-col items-center">
                {roadmaps.map((rm, idx) => (
                    <div key={rm.skill} className="grid grid-cols-3 w-[600px] border-2 border-black rounded-none mb-1">
                        <div className="col-span-1 flex items-center justify-center font-extrabold text-sm font-rubik py-1 border-r-2 border-black text-center">{rm.skill}</div>
                        <div className="col-span-1 flex items-center justify-center font-extrabold text-sm font-rubik py-1 border-r-2 border-black text-center">{stats[idx]?.completed ?? 0}</div>
                        <div className="col-span-1 flex items-center justify-center font-extrabold text-sm font-rubik py-1 text-center">{stats[idx]?.remaining ?? 0}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MilestoneStatus;