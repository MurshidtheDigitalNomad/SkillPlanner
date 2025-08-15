import React, { useState, useEffect } from 'react';
import axios from 'axios';
import titleicon from '../../assets/RHlibrary-icon.svg';


const options3 = ["Resource Type", "Youtube Videos And Playlists", "PDF", "Research Paper", "External Tutorials"];

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

        useEffect(() => {
        const fetchMileStones = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/resources/global_milestones')
                if (response.status === 200) {
                    // Store the full milestone objects to preserve IDs
                    setMilestoneOptions(response.data);
                }
            } catch (err) {
                console.log('Error fetching milestones:', err);
                setMilestoneOptions([{name: 'Milestone Goals' }]);
            }
        }
        fetchMileStones();
    }, []);

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
        <div className="bg-white h-[60vh] p-8 rounded-2xl shadow-md flex flex-col items-start mb-2 w-full">
            <div className='title flex items-center mb-4'>
                <img src={titleicon} alt='title icon' className='h-8'/>
                <h2 className='font-rubik text-xl font-extrabold ml-2 mb-2'>ACCESS ALL RESOURCES HERE</h2>
            </div>

            <div className="searchbars flex gap-6 mb-6">
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
                <Dropdown label="Resource Type" options={options3} width='w-[10vw]' />
                <button 
                    className='bg-[#2d39e8] hover:bg-blue-800 text-white font-rubik text-base font-bold py-2 px-4 rounded'
                    onClick={() => {
                        // The search is already triggered by useEffect when selections change
                    }}
                >
                    Search
                </button>
            </div>

            <div className="search-results flex-1 overflow-x-auto scrollbar:hidden">
                {(selectedRoadmap?.global_rm_id !== 'default' || selectedMileStoneGoal?.global_ms_id !== 'default') && (
                    <div className="mt-4 min-w-max">
                    <h3 className="text-lg font-bold font-poppins mb-3">
                        Resources for:
                        {selectedRoadmap?.global_rm_id !== 'default' && (
                        <span className="text-blue-600"> {selectedRoadmap.name} </span>
                        )}
                        {selectedMileStoneGoal?.global_ms_id !== 'default' && (
                        <span className="text-blue-600">
                            {selectedRoadmap?.global_rm_id !== 'default' && ' & '}
                            {selectedMileStoneGoal.name}
                        </span>
                        )}
                    </h3>

                    {/* Combined Horizontal Scroll */}
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {/* Roadmap Resources */}
                        {selectedRoadmap?.global_rm_id !== 'default' &&
                        roadmapResources.map((resource) => (
                            <div
                            key={`rm-${resource.resource_id}`}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 min-w-[300px] max-w-[350px] flex-shrink-0"
                            >
                                <h4 className="font-semibold text-lg mb-2">{resource.title || 'Untitled Resource'}</h4>
                                {resource.description && (
                                    <p className="text-gray-600 mb-2 text-sm line-clamp-3">{resource.description}</p>
                                )}
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline break-all text-sm"
                                >
                                    {resource.url}
                                </a>
                                {resource.resource_type && (
                                    <span className="ml-2 px-2 py-1 bg-gray-200 rounded text-sm">{resource.resource_type}</span>
                                )}
                                <button
                                className="mt-2 px-4 py-1 ml-2 rounded bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors duration-200"
                                onClick={(e) => e.currentTarget.classList.toggle('bg-red-500')}
                                >
                                    SAVE
                                </button>
                            </div>
                        ))}

                        {/* Milestone Resources */}
                        {selectedMileStoneGoal?.global_ms_id !== 'default' &&
                        milestoneResources.map((resource) => (
                            <div
                            key={`ms-${resource.resource_id}`}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 min-w-[300px] max-w-[350px] flex-shrink-0"
                                >
                                <h4 className="font-semibold text-lg mb-2">{resource.title || 'Untitled Resource'}</h4>
                                {resource.description && (
                                    <p className="text-gray-600 mb-2 text-sm line-clamp-3">{resource.description}</p>
                                )}
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline break-all text-sm"
                                >
                                    {resource.url}
                                </a>
                                {resource.resource_type && (
                                    <span className="ml-2 px-2 py-1 bg-gray-200 rounded text-sm">{resource.resource_type}</span>
                                )}
                                <button
                                className="mt-2 px-4 py-1 ml-2 rounded bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors duration-200"
                                onClick={(e) => e.currentTarget.classList.toggle('bg-red-500')}
                                >
                                    SAVE
                                </button>                       
                            </div>

                        ))}
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
