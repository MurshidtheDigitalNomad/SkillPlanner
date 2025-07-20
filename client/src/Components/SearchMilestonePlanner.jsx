import React, { useState } from 'react';
import milestonemessage from '../assets/milestonemessage.svg'

const SearchMilestonePlanner = ({ roadmap, onClose }) => {
  
    const [skill, setSkill] = useState(roadmap.skill || '');
    const [milestones, setMilestones] = useState(
        roadmap.milestones.map(m => ({ ...m }))
    );

    const handleChange = (idx, field, value) => {
        const newMilestones = [...milestones];
        newMilestones[idx][field] = value;
        setMilestones(newMilestones);
    };

    const addMilestone = () => {
        setMilestones([...milestones, { name: '', deadline: '', task: '', notes: '' }]);
    };

    const handleStartLearning = () => {
       
        if (!skill.trim()) return;
        const userRoadmaps = JSON.parse(localStorage.getItem('userRoadmaps') || '[]');
        userRoadmaps.push({ skill, milestones });
        localStorage.setItem('userRoadmaps', JSON.stringify(userRoadmaps));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-12 w-[700px] max-w-full border border-black relative max-h-[90vh] overflow-y-auto flex flex-col items-center">
                <input
                    className="text-xl font-extrabold font-rubik text-center text-[#2d39e8] font-poppins mb-2 tracking-wide w-full outline-none border-b-2 border-[#2d39e8] bg-transparent placeholder-[#2d39e8]"
                    type="text"
                    placeholder="Enter your goal/skill"
                    value={skill}
                    onChange={e => setSkill(e.target.value)}
                />
                <div> <img src={milestonemessage} /></div>
                <div className="bg-[#f8fcff] rounded-xl w-full px-8 py-10 flex flex-col items-center gap-2">
                    {milestones.map((milestone, idx) => (
                        <div key={idx} className="w-full mb-8 last:mb-0">
                            <h2 className="text-lg font-semibold font-rubik mb-6 text-center">Milestone goal {idx + 1}</h2>
                            <form className="w-full flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-poppins font-semibold mb-1">Name</label>
                                    <input
                                        className="w-full border border-gray-400 font-poppins rounded px-2 py-1 text-sm"
                                        type="text"
                                        placeholder="Milestone name"
                                        value={milestone.name}
                                        onChange={e => handleChange(idx, 'name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-poppins font-semibold mb-1">Deadline</label>
                                    <input
                                        className="w-full border font-poppins border-gray-400 rounded px-2 py-1 text-sm"
                                        type="date"
                                        value={milestone.deadline}
                                        onChange={e => handleChange(idx, 'deadline', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-poppins font-semibold mb-1">Tasks (optional)</label>
                                    <textarea
                                        className="w-full border font-poppins border-gray-400 rounded px-2 py-1 min-h-[80px] text-sm resize-y"
                                        placeholder="Tasks"
                                        value={milestone.task}
                                        onChange={e => handleChange(idx, 'task', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-poppins font-semibold mb-1">Notes (optional)</label>
                                    <input
                                        className="w-full border font-poppins border-gray-400 rounded px-2 py-1 text-sm"
                                        type="text"
                                        placeholder="Notes"
                                        value={milestone.notes}
                                        onChange={e => handleChange(idx, 'notes', e.target.value)}
                                    />
                                </div>
                            </form>
                        </div>
                    ))}
                </div>
                <div className="flex w-full justify-between mt-8 gap-4">
                    <button className="bg-red-400 hover:bg-red-500 text-white text-xs font-rubik font-bold py-2 px-4 rounded" onClick={onClose}>GO BACK</button>
                    <button className="bg-[#2d39e8] hover:bg-blue-800 text-white font-rubik text-xs font-bold py-2 px-4 rounded" onClick={addMilestone}>ADD ANOTHER MILESTONE</button>
                    <button className="bg-gradient-to-r from-[#85b4fa] to-[#e8f2f8] text-xs hover:from-blue-400 hover:to-blue-200 font-rubik text-blue-900 font-bold py-2 px-4 rounded" onClick={handleStartLearning}>START LEARNING!</button>
                </div>
            </div>
        </div>
    );
};

export default SearchMilestonePlanner;