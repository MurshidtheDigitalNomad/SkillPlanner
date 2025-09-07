import React from 'react';

const MilestoneStatus = ({ userProgress }) => {
    if (!userProgress) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4">
                <h2 className={'text-xl font-extrabold mt-4 font-rubik text-center mb-2'}>STATUS OF YOUR MILESTONE GOALS</h2>
                <div className="text-gray-500">Loading progress...</div>
            </div>
        );
    }

    const { roadmaps: progressData, overall } = userProgress;

    return (
        <div className="w-full h-full flex flex-col items-center justify-start gap-4">
            <h2 className={'text-xl font-extrabold mt-4 font-rubik text-center mb-2'}>STATUS OF YOUR MILESTONE GOALS</h2>

            <div className="grid grid-cols-3 w-[600px] mb-2">
                <div className="col-span-1 px-8 py-2 rounded-tl-lg font-extrabold text-sm font-rubik bg-gradient-to-r from-blue-400 to-blue-100 text-black text-center">ROADMAP</div>
                <div className="col-span-1 px-8 py-2 font-extrabold text-sm font-rubik bg-green-500 text-black text-center">COMPLETED MILESTONES</div>
                <div className="col-span-1 px-8 py-2 font-extrabold text-sm font-rubik bg-red-400 text-black text-center">REMAINING MILESTONES</div>
            </div>

            <div className="w-full flex flex-col items-center">
                {progressData.map((roadmap, idx) => {
                    const completed = roadmap.milestones.completed;
                    const remaining = roadmap.milestones.total - completed;
                    return (
                        <div key={roadmap.roadmap_id || idx} className="grid grid-cols-3 w-[600px] border-2 border-black rounded-none mb-1">
                            <div className="col-span-1 flex items-center justify-center font-extrabold text-sm font-rubik py-1 border-r-2 border-black text-center">
                                {roadmap.roadmap_name || roadmap.roadmap_id}
                            </div>
                            <div className="col-span-1 flex items-center justify-center font-extrabold text-sm font-rubik py-1 border-r-2 border-black text-center">
                                {completed}
                            </div>
                            <div className="col-span-1 flex items-center justify-center font-extrabold text-sm font-rubik py-1 text-center">
                                {remaining}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Overall Summary */}
            <div className="w-full flex flex-col items-center mt-4">
                <div className="grid grid-cols-3 w-[600px] border-2 border-black rounded-lg mb-1 bg-blue-100">
                    <div className="col-span-1 flex items-center justify-center font-extrabold text-sm font-rubik py-2 border-r-2 border-black text-center">
                        TOTAL
                    </div>
                    <div className="col-span-1 flex items-center justify-center font-extrabold text-sm font-rubik py-2 border-r-2 border-black text-center">
                        {overall.completed_milestones}
                    </div>
                    <div className="col-span-1 flex items-center justify-center font-extrabold text-sm font-rubik py-2 text-center">
                        {overall.total_milestones - overall.completed_milestones}
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default MilestoneStatus;