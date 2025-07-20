import React, { useEffect, useState } from 'react';

const getProgressForRoadmap = (roadmap) => {
    const progress = JSON.parse(localStorage.getItem(`progress_${roadmap.skill}`) || '{}');
    const { milestoneCompletion = {} } = progress;
    const total = roadmap.milestones.length;
    const completed = Object.values(milestoneCompletion).filter(Boolean).length;
    return {
        completed,
        total,
        percent: total === 0 ? 0 : Math.round((completed / total) * 100)
    };
};

const RoadmapStatus = ({ progressUpdated }) => {
    const [roadmaps, setRoadmaps] = useState([]);
    const [progresses, setProgresses] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('userRoadmaps') || '[]');
        setRoadmaps(stored);
        setProgresses(stored.map(rm => getProgressForRoadmap(rm)));
    }, [progressUpdated]);

    const completedCount = progresses.filter(p => p.total > 0 && p.completed === p.total).length;

    return (
        <div className="w-full h-full border-2 border-black rounded-2xl p-6 flex flex-col items-center justify-start gap-6">
            <h2 className="text-xl font-extrabold font-rubik text-center mb-2">STATUS OF YOUR ROADMAPS</h2>
            <div className="flex items-center w-full mb-4">
                <span className="text-blue-500 text-2xl mr-2">✔️</span>
                <span className="font-extrabold text-lg font-rubik mr-2">COMPLETED ROADMAPS</span>
                <span className="font-extrabold text-lg font-rubik ml-auto">{completedCount}</span>
            </div>
            <div className="w-full flex flex-col gap-4">
                {roadmaps.map((rm, idx) => {
                    const progress = progresses[idx] || { percent: 0 };
                    let barColor = 'bg-blue-700';
                    if (progress.percent === 100) barColor = 'bg-green-500';
                    return (
                        <div key={rm.skill} className="flex items-center w-full gap-4">
                            <div className={`flex-1 rounded-lg px-4 py-2 font-extrabold text-white font-rubik text-base text-center ${barColor}`}>{rm.skill}</div>
                            <div className="w-24 border-2 border-blue-700 rounded-lg text-center font-extrabold text-xl font-rubik ml-2">{progress.percent}%</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RoadmapStatus;