import React, { useState, useEffect } from 'react';
import axios from 'axios';
import titleicon from '../../assets/RHlibrary-icon.svg';

const Dropdown = ({ options, width, onSelect, label, isObject = false }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(isObject ? (options[0]?.name || label) : (options[0] || label));

    useEffect(() => {
        // Reset selected if options change
        setSelected(isObject ? (options[0]?.name || label) : (options[0] || label));
    }, [options, label, isObject]);

    return (
        <div className={`relative ${width}`}>
            <button
                className="w-full flex justify-between items-center bg-[#edf0f2] border border-gray-400 rounded-lg px-5 py-3 text-lg font-poppins text-[#666666]"
                onClick={() => setOpen(!open)}
                type="button"
            >
                {selected}
                <span className="ml-2">&#9660;</span>
            </button>
            {open && (
                <div className="absolute left-0 top-full w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {options.map((option, idx) => {
                        const displayText = isObject ? option.name : option;
                        const key = isObject ? option.global_RM_id || option.global_MS_id || `${displayText}-${idx}` : `${displayText}-${idx}`;
                        
                        return (
                            <div
                                key={key}
                                className="px-5 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setSelected(displayText);
                                    setOpen(false);
                                    if (onSelect) {
                                        onSelect(option);
                                    }
                                }}
                            >
                                {displayText}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const ResourceLibrary = () => {
    const [roadmapOptions, setRoadmapOptions] = useState([]);
    const [selectedRoadmap, setSelectedRoadmap] = useState('');
    const [milestoneOptions, setMilestoneOptions] = useState([]);
    const [selectedMileStoneGoal, setSelectedMilestoneGoal]= useState('');
    const [roadmapResources, setRoadmapResources] = useState([]);
    const [milestoneResources, setMilestoneResources] = useState([]);
   

        useEffect(() => {
        const fetchRoadmaps = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/resources/global_roadmaps')
                if (response.status === 200) {
                    // Store the full roadmap objects to preserve IDs
                    setRoadmapOptions(response.data);
                }
            } catch (err) {
                console.error('Error fetching roadmaps:', err);
                if (err.response) {
                    console.error('Response error:', err.response.data);
                }
                setRoadmapOptions([{name: 'Roadmaps' }]);
            }
        }
        // Fetch roadmap names from server
        fetchRoadmaps();
    }, []);

    // Fetch milestones when a roadmap is selected
    useEffect(() => {
        const fetchMileStones = async () => {
            if (selectedRoadmap && selectedRoadmap.global_rm_id && selectedRoadmap.global_rm_id !== 'loading') {
                try {
                    const response = await axios.get(`http://localhost:8000/api/resources/global_milestones/${selectedRoadmap.global_rm_id}`)
                    if (response.status === 200) {
                        // Store the full milestone objects to preserve IDs
                        setMilestoneOptions(response.data);
                    }
                } catch (err) {
                    console.log('Error fetching milestones:', err);
                    setMilestoneOptions([{name: 'No milestones found' }]);
                }
            } else {
                // Clear milestones if no roadmap is selected
                setMilestoneOptions([{name: 'Select a roadmap first' }]);
            }
            // Clear selected milestone when roadmap changes
            setSelectedMilestoneGoal('');
        }
        fetchMileStones();
    }, [selectedRoadmap]);

    // Fetch resources when roadmap is selected
    useEffect(() => {
        const fetchRoadmapResources = async () => {
            // Only fetch if we have a valid selectedRoadmap with an ID
            if (selectedRoadmap && selectedRoadmap.global_rm_id && selectedRoadmap.global_rm_id !== 'default') {
                try {
                    console.log(selectedRoadmap.global_RM_id)
                    const response = await axios.get(`http://localhost:8000/api/resources/roadmap/${selectedRoadmap.global_rm_id}`);
                    if (response.status === 200) {
                        console.log(response.data)
                        setRoadmapResources(response.data);
                    }else{
                        console.log('Resources not fetched from database')
                    }
                } catch (err) {
                    console.error('Error fetching roadmap resources:', err);
                    setRoadmapResources([]);
                }
            } else {
                // Clear resources if no valid selection
                setRoadmapResources([]);
            }
        };
        fetchRoadmapResources();
    }, [selectedRoadmap]);

    // Fetch resources when milestone is selected
    useEffect(() => {
        const fetchMilestoneResources = async () => {
            // Only fetch if we have a valid selectedMileStoneGoal with an ID
            if (selectedMileStoneGoal && selectedMileStoneGoal.global_ms_id && selectedMileStoneGoal.global_ms_id !== 'default') {
                try {
                    const response = await axios.get(`http://localhost:8000/api/resources/milestone/${selectedMileStoneGoal.global_ms_id}`);
                    if (response.status === 200) {
                        setMilestoneResources(response.data);
                    }
                } catch (err) {
                    console.error('Error fetching milestone resources:', err);
                    setMilestoneResources([]);
                }
            } else {
                // Clear resources if no valid selection
                setMilestoneResources([]);
            }
        };
        fetchMilestoneResources();
    }, [selectedMileStoneGoal]);

    return (
        <div className="bg-white min-h-[70vh] p-8 rounded-2xl shadow-md flex flex-col items-start mb-4 gap-4 w-full">
            <div className='title flex items-center mb-4'>
                <img src={titleicon} alt='title icon' className='h-8'/>
                <h2 className='font-rubik text-xl font-extrabold ml-2 mb-2'>ACCESS ALL RESOURCES HERE</h2>
            </div>

            <div className="searchbars flex gap-6 mb-2">
                <Dropdown
                    label="Roadmap Resources"
                    options={roadmapOptions.length ? roadmapOptions : [{ global_RM_id: 'loading', name: 'Loading Roadmap Options...' }]}
                    width='w-[30vw]'
                    onSelect={setSelectedRoadmap}
                    isObject={true}
                />
                <Dropdown 
                    label="Milestone Goal Resources"
                    options={milestoneOptions.length ? milestoneOptions : [{ global_ms_id: 'loading', name: 'Loading Milestone Goals...' }]}
                    width='w-[30vw]'
                    onSelect={setSelectedMilestoneGoal}
                    isObject={true}
                 />
            </div>

            <div className="search-results flex-1">
                {(selectedRoadmap?.global_rm_id !== 'default' || selectedMileStoneGoal?.global_ms_id !== 'default') && (
                    <div className="mt-1">
                    <h3 className="text-lg font-poppins text-gray-600 italic mb-4">
                        Check out some amazing resources to help you in your learning journey!
                    </h3>

                    {/* Grid Layout for Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {(() => {
                            // Combine and deduplicate resources
                            const allResources = [];
                            const seenResourceIds = new Set();
                            
                            // Add roadmap resources if roadmap is selected
                            if (selectedRoadmap?.global_rm_id !== 'default') {
                                roadmapResources.forEach(resource => {
                                    if (!seenResourceIds.has(resource.resource_id)) {
                                        allResources.push(resource);
                                        seenResourceIds.add(resource.resource_id);
                                    }
                                });
                            }
                            
                            // Add milestone resources if milestone is selected (skip duplicates)
                            if (selectedMileStoneGoal?.global_ms_id !== 'default') {
                                milestoneResources.forEach(resource => {
                                    if (!seenResourceIds.has(resource.resource_id)) {
                                        allResources.push(resource);
                                        seenResourceIds.add(resource.resource_id);
                                    }
                                });
                            }
                            
                            return allResources.map((resource) => (
                                <div
                                key={resource.resource_id}
                                style={{ background: 'linear-gradient(to right, #85b4fa, #e8f2f8)' }}
                                className="w-[20vw] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                                onClick={() => window.open(resource.url, '_blank')}
                                >
                                    {/* Thumbnail/Icon Section */}
                                    <div className="bg-white rounded-xl mb-3 h-28 flex items-center justify-center relative overflow-hidden">
                                        {resource.type === 'youtube' ? (
                                            <div className="bg-gray-800 w-full h-full flex items-center justify-center">
                                                <div className="bg-white rounded-full p-3">
                                                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        ) : resource.type === 'Article' ? (
                                            <div className="bg-white w-full h-full flex items-center justify-center p-4">
                                                <div className="text-center">
                                                    <svg className="w-12 h-12 text-gray-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                                    </svg>
                                                    <div className="text-xs text-gray-500 font-semibold">ARTICLE</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                                                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Resource Info */}
                                    <div className="space-y-1">
                                        <div className="text-base font-semibold text-gray-700">
                                            <span className="font-bold">Type:</span> {resource.type || 'Resource'}
                                        </div>
                                        <div className="text-base font-semibold text-gray-700">
                                            <span className="font-bold">Skill:</span> {selectedRoadmap?.name || 'General'}
                                        </div>
                                        <div className="text-base font-semibold text-gray-700">
                                            <span className="font-bold">Milestone Goal:</span> {resource.milestone_name || 'General'}
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <button
                                        className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent card click
                                            e.currentTarget.classList.toggle('bg-green-600');
                                            e.currentTarget.textContent = e.currentTarget.textContent === 'SAVE' ? 'SAVED' : 'SAVE';
                                        }}
                                    >
                                        SAVE
                                    </button>

                                </div>
                            ));
                        })()}
                    </div>

                    {/* No results case */}
                    {roadmapResources.length === 0 && milestoneResources.length === 0 && (
                        <p className="text-gray-500">No resources found for the selected roadmap/milestone.</p>
                    )}
                    </div>
                )}
            </div>

        </div>
    );
};

export default ResourceLibrary;
