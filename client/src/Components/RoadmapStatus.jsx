import React from 'react';

const RoadmapStatus = ({ userProgress }) => {
    if (!userProgress) {
        return (
            <div className="w-full h-full border-2 border-black rounded-2xl p-6 flex flex-col items-center justify-start gap-6">
                <h2 className="text-xl font-extrabold font-rubik text-center mb-2">STATUS OF YOUR ROADMAPS</h2>
                <div className="text-gray-500">Loading progress...</div>
            </div>
        );
    }

    const { roadmaps: progressData } = userProgress;
    const completedCount = progressData.filter(p => p.milestones.percentage === 100).length;

    return (
        <div className="w-full h-full border-2 border-black rounded-2xl p-6 flex flex-col items-center justify-start gap-6">
            <h2 className="text-xl font-extrabold font-rubik text-center mb-2">STATUS OF YOUR ROADMAPS</h2>

            <div className="flex items-center w-full mb-4">
                <span className="text-blue-500 text-2xl mr-2">✔️</span>
                <span className="font-extrabold text-lg font-rubik mr-2">COMPLETED ROADMAPS</span>
                <span className="font-extrabold text-lg font-rubik ml-auto">{completedCount}</span>
            </div>

            <div className="w-full flex flex-col gap-4">
                {progressData.map((roadmap, idx) => {
                    const progress = roadmap.milestones;
                    let barColor = 'bg-blue-700';
                    if (progress.percentage === 100) barColor = 'bg-green-500';
                    return (
                        <div key={roadmap.roadmap_id || idx} className="flex items-center w-full gap-4">
                            <div className={`flex-1 rounded-lg px-4 py-2 font-extrabold text-white font-rubik text-base text-center ${barColor}`}>
                                {roadmap.roadmap_name || roadmap.roadmap_id}
                            </div>
                            <div className="w-24 border-2 border-blue-700 rounded-lg text-center font-extrabold text-xl font-rubik ml-2">
                                {progress.percentage}%
                            </div>
                        </div>
                    );
                })}
            </div>
            
        </div>
    );
};

export default RoadmapStatus;