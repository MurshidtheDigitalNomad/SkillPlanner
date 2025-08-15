import React, { useState, useEffect } from 'react';
import axios from 'axios';
import titleicon from '../../assets/RHrecommended-icon.svg';

const RecommendedResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch resources for roadmap GRM001 (web development)
    const fetchResources = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/resources/roadmap/GRM001');
        setResources(res.data); 
      } catch (err) {
        console.error('Error fetching recommended resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []); // empty dependency ensures it runs on page reload

  return (
    <div className="bg-white h-auto p-8 rounded-2xl shadow-md flex flex-col items-start mb-2 w-full">
      <div className="title flex items-center mb-4">
        <img src={titleicon} alt="title icon" className="h-8" />
        <h2 className="font-rubik text-xl font-extrabold ml-2 mb-2">
          RECOMMENDED RESOURCES BASED ON YOUR ROADMAPS
        </h2>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading resources...</p>
      ) : resources.length === 0 ? (
        <p className="text-gray-500">No recommended resources found.</p>
      ) : (
        <ul className="w-full flex flex-col gap-3">
          {resources.map((r) => (
            <li key={r.resource_id} className="border p-3 rounded-md hover:shadow-sm w-full">
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                {r.title} ({r.type})
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecommendedResources;
