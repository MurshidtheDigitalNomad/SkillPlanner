import React from 'react';
import './ViewRoadmaps.css';

const ViewRoadmapModal = ({ roadmap, onClose, onDelete }) => {
    if (!roadmap) return null;

    const handleDelete = () => {
        const userRoadmaps = JSON.parse(localStorage.getItem('userRoadmaps') || '[]');
        const filtered = userRoadmaps.filter(rm =>
            !(rm.skill === roadmap.skill && rm.milestones.length === roadmap.milestones.length && rm.milestones.every((m, i) => {
                const rmm = roadmap.milestones[i];
                return m.name === rmm.name && m.deadline === rmm.deadline && m.task === rmm.task && m.notes === rmm.notes;
            }))
        );
        localStorage.setItem('userRoadmaps', JSON.stringify(filtered));
        if (onDelete) onDelete(roadmap);
        setTimeout(onClose, 500); // roadmap deleted after 0.5 seconds
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-[900px] max-w-full border border-black relative max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-2xl font-extrabold font-rubik text-center text-[#2d39e8] mb-8">{roadmap.skill}</h2>
                <div className="w-full overflow-x-auto pb-6 scrollbar-hide">
                    <div className="flex flex-row items-start flex-nowrap gap-6">
                        {roadmap.milestones.map((ms, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center min-w-[220px] relative mx-4"
                            >
                                {idx !== 0 && (
                                    <div
                                        className="absolute left-[-110px] top-6 h-1 bg-blue-200 z-0"
                                        style={{ width: '100px' }}
                                    ></div>
                                )}
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-[#2d39e8] flex items-center justify-center text-white font-bold z-10 mb-2">
                                        {idx + 1}
                                    </div>
                                    <div className="font-bold text-xl whitespace-nowrap font-poppins mb-2">{ms.name}</div>
                                    <div className="text-lg mb-2 mt-2">
                                        <span className="text-xl">❗</span>
                                        <div className="inline-flex items-center bg-gradient-to-r from-red-400 to-red-600 text-white rounded px-3 py-1 font-semibold shadow gap-2">
                                            {ms.deadline}
                                        </div>
                                    </div>
                                    {ms.task && (
                                        <div className="text-sm font-poppins"><span className="font-bold">Tasks: </span>{ms.task}</div>
                                    )}
                                    {ms.notes && (
                                        <div className="text-sm font-poppins"><span className="font-bold">Notes: </span>{ms.notes}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end mt-8">
                    <button
                        className="bg-red-300 hover:bg-red-700 text-white font-bold py-2 px-2 font-rubik rounded shadow"
                        onClick={handleDelete}
                    >
                        Delete Roadmap
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewRoadmapModal;