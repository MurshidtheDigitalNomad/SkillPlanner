import { useState, useEffect } from 'react';
import axios from 'axios';

export const useResourceCount = () => {
    const [resourceCount, setResourceCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResourceCount = async () => {
            try {
                setLoading(true);
                
                // Fetch all global roadmaps
                const roadmapsResponse = await axios.get('http://localhost:8000/api/resources/global_roadmaps');
                
                if (roadmapsResponse.status === 200 && roadmapsResponse.data.length > 0) {
                    let totalCount = 0;
                    
                    // Count resources for each roadmap
                    for (const roadmap of roadmapsResponse.data) {
                        try {
                            const resourcesResponse = await axios.get(`http://localhost:8000/api/resources/roadmap/${roadmap.global_rm_id}`);
                            if (resourcesResponse.status === 200) {
                                totalCount += resourcesResponse.data.length;
                            }
                        } catch (resourceError) {
                            console.error(`Error fetching resources for roadmap ${roadmap.name}:`, resourceError);
                        }
                    }
                    
                    setResourceCount(totalCount);
                } else {
                    setResourceCount(0);
                }
            } catch (err) {
                console.error('Error fetching resource count:', err);
                setResourceCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchResourceCount();
    }, []);

    return { resourceCount, loading };
};

export const usePostCount = () => {
    const [postCount, setPostCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostCount = async () => {
            try {
                setLoading(true);
                
                const response = await axios.get('http://localhost:8000/api/posts/all');
                
                if (response.status === 200 && response.data.success) {
                    setPostCount(response.data.posts.length);
                } else {
                    setPostCount(0);
                }
            } catch (err) {
                console.error('Error fetching post count:', err);
                setPostCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchPostCount();
    }, []);

    return { postCount, loading };
};
