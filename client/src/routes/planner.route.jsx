import React, { useState, useEffect } from 'react';
import plannermessage from '../assets/plannermessage.svg';
import { FiSearch } from 'react-icons/fi';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import roadmaps from '../datasets/roadmaps';
import MilestoneModal from '../Components/MilestonePlannerModal';
import ViewRoadmapModal from '../Components/ViewRoadmaps/ViewRoadmaps.jsx';
import SearchMilestonePlanner from '../Components/SearchMilestonePlanner.jsx';
import viewicon from '../assets/viewicon.svg'

const Planner = () => {
    const [MilestonePlannermodalOpen, setMilestonePlannermodalOpen] = useState(false);
    const [userRoadmaps, setUserRoadmaps] = useState([]);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedRoadmap, setSelectedRoadmap] = useState(null);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [searchSelectedRoadmap, setSearchSelectedRoadmap] = useState(null);

    useEffect(() => {
    
        const stored = JSON.parse(localStorage.getItem('userRoadmaps') || '[]');
        setUserRoadmaps(stored);
    }, [MilestonePlannermodalOpen]);

    const openModal = () => setMilestonePlannermodalOpen(true);
    const closeModal = () => setMilestonePlannermodalOpen(false);

    const openViewModal = (roadmap) => {
        setSelectedRoadmap(roadmap);
        setViewModalOpen(true);
    };
    const closeViewModal = () => {
        setSelectedRoadmap(null);
        setViewModalOpen(false);
    };

    const handleDeleteRoadmap = (roadmapToDelete) => {
        setUserRoadmaps(prev =>
            prev.filter(rm =>
                !(
                    rm.skill === roadmapToDelete.skill &&
                    rm.milestones.length === roadmapToDelete.milestones.length &&
                    rm.milestones.every((m, i) => {
                        const rmm = roadmapToDelete.milestones[i];
                        return m.name === rmm.name && m.deadline === rmm.deadline && m.task === rmm.task && m.notes === rmm.notes;
                    })
                )
            )
        );
    };

    // Search logic
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        if (value.trim() === '') {
            setSearchResults([]);
            return;
        }
        const results = roadmaps.filter(rm =>
            rm.skill.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(results);
    };

    const handleSkillClick = (roadmap) => {
        setSearchSelectedRoadmap(roadmap);
        setSearchModalOpen(true);
        setSearch('');
        setSearchResults([]);
    };
    const closeSearchModal = () => {
        setSearchModalOpen(false);
        setSearchSelectedRoadmap(null);
    };

    return (
        <div>
            {/* Render modal when modalOpen is true */}
            {MilestonePlannermodalOpen && <MilestoneModal onClose={closeModal} />}
            {/* Render ViewRoadmapModal when viewModalOpen is true */}
            {viewModalOpen && selectedRoadmap && (
                <ViewRoadmapModal
                    roadmap={selectedRoadmap}
                    onClose={closeViewModal}
                    onDelete={handleDeleteRoadmap}
                />
            )}
            {/* Render SearchMilestonePlanner modal when searchModalOpen is true */}
            {searchModalOpen && searchSelectedRoadmap && (
                <SearchMilestonePlanner roadmap={searchSelectedRoadmap} onClose={closeSearchModal} />
            )}
            <div className="w-full flex justify-center items-start ml-[3vw]">
                <img src={plannermessage} alt='planner'/>
            </div>
            <div className="w-full flex flex-col gap-6 mt-8 mb-10">
               
                <div className="bg-white rounded-xl shadow w-[85vw] h-[30vh] flex flex-col px-10 py-8 mr-5">
                    <div className="relative mb-2">
                        <div className="flex items-center">
                            <FiSearch className="text-3xl mr-3" />
                            <input
                                type="text"
                                placeholder="What do you want to learn today?"
                                className="text-xl font-extrabold font-rubik w-full outline-none border-none focus:ring-0 placeholder-black bg-transparent"
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </div>
                        {searchResults.length > 0 && (
                            <div className="flex flex-col items-start gap-6 py-4 px-2 absolute left-12 top-12 bg-white border border-gray-200 rounded shadow w-[80%] z-20">
                                {searchResults.map((rm, idx) => (
                                    <div
                                        key={idx}
                                        className="text-gray-500 text-lg font-poppins hover:bg-blue-100 transition-colors duration-200 px-2 py-1 rounded"
                                        onClick={() => handleSkillClick(rm)}
                                    >
                                        {rm.skill}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="border-b-2 border-black w-full mb-6" />
                </div>
                
                <div className="bg-white rounded-xl shadow w-[85vw] h-95 flex flex-col px-10 py-8 mr-5">
                    <h1 className="text-xl font-extrabold text-center mb-4 font-rubik">Want to add your new goal? Click here.</h1>
                    <div className="flex justify-center mb-6">
                        <button 
                            className="bg-[#2d39e8] hover:bg-blue-800 text-white font-bold py-2 px-6 rounded text-lg font-rubik shadow"
                            onClick={openModal}
                        >
                            Add your goal
                        </button>
                    </div>
                </div>

              
                
                <div className=" view-roadmaps bg-white rounded-xl shadow w-[85vw] flex flex-col px-8 py-6 mr-5">
                    <div className="flex items-center gap-2 mb-3">
                        <img src={viewicon} className='h-12 w-12'/>
                        <span className="font-extrabold text-xl font-poppins">VIEW YOUR ROADMAPS</span>
                    </div>
                    <div className="flex gap-8 w-full flex-wrap">
                        {userRoadmaps.length === 0 ? (
                            <span className="text-gray-400 font-poppins">No roadmaps yet. Make your first roadmap!</span>
                        ) : (
                            userRoadmaps.map((rm, idx) => (
                                <button
                                    key={idx}
                                    className="flex-1 h-20 rounded-xl font-extrabold text-lg font-poppins bg-gradient-to-r from-blue-300 to-blue-100 flex items-center justify-center mb-4 min-w-[180px]"
                                    onClick={() => openViewModal(rm)}
                                >
                                    {rm.skill}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Planner;
