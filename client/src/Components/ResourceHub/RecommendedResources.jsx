import React, { useState, useEffect } from 'react';
import axios from 'axios';
import titleicon from '../../assets/RHrecommended-icon.svg';

const RecommendedResources = () => {

  return (
    <div className="bg-white h-auto p-8 rounded-2xl shadow-md flex flex-col items-start mb-2 w-full">
      <div className="title flex items-center mb-4">
        <img src={titleicon} alt="title icon" className="h-8" />
        <h2 className="font-rubik text-xl font-extrabold ml-2 mb-2">
          RECOMMENDED RESOURCES BASED ON YOUR ROADMAPS
        </h2>
      </div>
      <div>
        <h3 className="text-lg font-poppins text-gray-600 italic mb-4">
            Ask our AI mentor to get a personalized list of resources based on your roadmap!
        </h3>
      </div>

    </div>
  );
};

export default RecommendedResources;
