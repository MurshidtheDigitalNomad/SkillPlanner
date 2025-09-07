import React, { useState } from 'react';
import homeicon from '../../assets/comhomeicon.svg'
import posticon from '../../assets/composticon.svg'
import profileicon from '../../assets/comprofileicon.svg'
import MakePostModal from './MakePostModal';

const CommunityNavButtons = ({ onHomeClick, onProfileClick, onPostCreated })=>{
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePostClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleHomeClick = () => {
        if (onHomeClick) {
            onHomeClick();
        }
    };

    const handleProfileClick = () => {
        if (onProfileClick) {
            onProfileClick();
        }
    };

    const handlePostCreated = () => {
        if (onPostCreated) {
            onPostCreated();
        }
    };

    return(
        <div className="bg-white mx-8 my-6 rounded-lg p-2">
            <div className="flex justify-center align-items-center space-x-16">
                <div className="home flex flex-col items-center space-y-2">
                    <button onClick={handleHomeClick}>
                        <img src={homeicon} alt="Home" className="w-8 h-8" />
                        <span className="text-sm font-rubik text-gray-600">Home</span>
                    </button>
                </div>
                <div className="post flex flex-col items-center space-y-2">
                    <button onClick={handlePostClick}>
                        <img src={posticon} alt="Create Post" className="w-8 h-8 ml-4" />
                        <span className="text-sm font-rubik text-gray-600">Create Post</span>
                    </button>
                </div>
                <div className="profile flex flex-col items-center space-y-2 ">
                    <button onClick={handleProfileClick}>
                        <img src={profileicon} alt="Profile" className="w-8 h-8" />
                        <span className="text-sm font-rubik text-gray-600 font-medium">Profile</span>
                    </button>
                </div>
            </div>
            
            {isModalOpen && (
                <MakePostModal onClose={handleCloseModal} onPostCreated={handlePostCreated} />
            )}
        </div>
    )
}

export default CommunityNavButtons;