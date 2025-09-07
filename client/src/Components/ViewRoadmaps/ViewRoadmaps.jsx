import React from 'react';
import './ViewRoadmaps.css';
import {useAuth} from '../Contexts/authContext.jsx';
import { useUserRoadmaps, useDeleteRoadmapMutation } from '../Contexts/useRoadmaps.js';

const ViewRoadmapModal = ({ onClose }) => {
    const {authUser} = useAuth();
    const userId = authUser?.id;
    console.log(userId) //test case
    const { data: roadmaps, isLoading, error } = useUserRoadmaps(userId);
    const { mutate: deleteRoadmap, isPending: isDeleting } = useDeleteRoadmapMutation(userId);
    console.log('userId:', userId, 'roadmaps:', roadmaps, 'error:', error);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-[900px] max-w-full border border-black relative">
                    <div className="text-center">Loading roadmaps...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-[900px] max-w-full border border-black relative">
                    <div className="text-center text-red-600">Failed to load roadmaps</div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-[900px] max-w-full border border-black relative max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>

                {(roadmaps || []).length === 0 ? (
                    <h2 className="text-2xl font-extrabold font-rubik text-center text-[#2d39e8] mb-8">No roadmaps yet</h2>
                ) : (
                    (roadmaps || []).map((roadmap, rIdx) => (
                        <div key={roadmap.roadmap_id || rIdx} className="mb-10">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-extrabold font-rubik text-[#2d39e8]">{roadmap.name}</h2>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                                    disabled={isDeleting}
                                    onClick={() => {
                                        const confirmText = `Delete roadmap "${roadmap.name}"? This cannot be undone.`;
                                        if (window.confirm(confirmText)) {
                                            deleteRoadmap({ roadmapId: roadmap.roadmap_id });
                                        }
                                    }}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                            <div className="w-full overflow-x-auto pb-6 scrollbar-hide">
                                <div className="flex flex-row items-start flex-nowrap gap-6">
                                    {(roadmap.milestones || []).map((ms, idx) => {
                                        const tasksText = (ms.tasks || []).map(t => t.description).filter(Boolean).join(', ');
                                        return (
                                            <div
                                                key={ms.milestone_id || idx}
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
                                                        <span className="text-xl">❗ Deadline: </span>
                                                  
                                                        <div className="inline-flex items-center bg-gradient-to-r from-red-400 to-red-600 text-white rounded px-3 py-1 font-semibold shadow gap-2">
                                                            {new Date(ms.deadline).toLocaleDateString('en-US', { 
                                                                year: 'numeric', 
                                                                month: 'short', 
                                                                day: 'numeric' 
                                                            })}
                                                        </div>
                                                    </div>
                                                    {tasksText && (
                                                        <div className="text-sm font-poppins"><span className="font-bold">Tasks: </span>{tasksText}</div>
                                                    )}
                                                    {ms.notes && (
                                                        <div className="text-sm font-poppins"><span className="font-bold">Notes: </span>{ms.notes}</div>
                                                    )}
                                                </div>
                                            
                                            </div>
                                           
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ViewRoadmapModal;