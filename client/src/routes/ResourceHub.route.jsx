import React from 'react';
import title from "../assets/RHmain-title.svg";
import welcomemessage from '../assets/RHmain-message.svg';
import ResourceLibrary from '../Components/ResourceHub/ResourceLibrary';
import RecommendedResources from '../Components/ResourceHub/RecommendedResources';
import AddResources from '../Components/ResourceHub/AddResources';

const ResourceHub = () => {
    return(
        <div className='flex flex-col w-[100vw] max-w-[1300px]'>
            <div className='title flex flex-col items-center justify-center ml-10 '>
                <img src={title} alt='title' className='h-16'/>
                <img src={welcomemessage} alt='welcome message' className='h-14'/>
            </div> 
            <div className=''>
                <ResourceLibrary />
                <RecommendedResources />
                <AddResources />
            </div>        
        </div>
        

    )
}

export default ResourceHub;