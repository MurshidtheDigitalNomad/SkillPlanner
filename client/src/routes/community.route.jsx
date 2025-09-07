import React, { useState } from 'react';
import titlemessage from '../assets/CommunityMessage.svg'
import CommunityNavButtons from '../Components/Community/NavButtons';
import ShowPost from '../Components/Community/ShowPost';
import CommunityProfile from '../Components/Community/CommunityProfile';

const Community = ()=>{
    const [activeView, setActiveView] = useState('home'); // 'home' or 'profile'
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleHomeClick = () => {
        setActiveView('home');
    };

    const handleProfileClick = () => {
        setActiveView('profile');
    };

    const handlePostCreated = () => {
        // Trigger a refresh of posts by incrementing the refresh trigger
        setRefreshTrigger(prev => prev + 1);
    };

    return(
        <div className="bg-gray-50 w-[100vw] max-w-[1300px] ">
            {/* Title*/}
           <div className='title flex flex-col items-center justify-center ml-10 '>
                <img src={titlemessage} />
            </div>

            {/* Navigation Buttons */}
            <CommunityNavButtons onHomeClick={handleHomeClick} onProfileClick={handleProfileClick} onPostCreated={handlePostCreated}/>

            {/* Content based on active view */}
            {activeView === 'home' && (
                <ShowPost shouldFetchPosts={true} refreshTrigger={refreshTrigger} />
            )}
            
            {activeView === 'profile' && (
                <CommunityProfile />
            )}
        </div>
    )
}

export default Community;