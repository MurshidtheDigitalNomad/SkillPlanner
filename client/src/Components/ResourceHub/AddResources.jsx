import React, { useState } from 'react';
import titleicon from '../../assets/RHcontribute-icon.svg';
import AddResourceModal from './AddResourceModal';

const AddResources = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="bg-white h-[35vh] p-8 rounded-2xl shadow-md flex flex-col items-start mb-2 w-full">
            <div className='title flex items-center mb-4'>
                <img src={titleicon} alt='title icon' className='h-12 w-10'/>
                <h1 className='font-rubik text-xl font-extrabold ml-2 mb-2'>CONTRIBUTE A RESOURCE</h1>
            </div>
            <p className='font-poppins text-base text-center text-black-600 mb-4'>
                "Every learner’s journey is unique, and the resources that helped you might be exactly what someone else needs. Share your favorite articles, videos, or tools, and help the SkillPlanner community grow together."
            </p>
            <div className='flex justify-center items-center w-full mt-2'>
                <button
                    className='bg-[#312f84] hover:bg-blue-800 text-white font-rubik text-lg font-bold py-2 px-6 rounded'
                    onClick={() => setShowModal(true)}
                >
                    ADD A RESOURCE
                </button>
            </div>
            {showModal && <AddResourceModal onClose={() => setShowModal(false)} />}
        </div>
    );
}

export default AddResources;