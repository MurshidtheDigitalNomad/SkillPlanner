import React, { useState } from 'react';
import { useAuth } from '../Contexts/authContext';
import axios from 'axios';

const MakePostModal = ({ onClose, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { authUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!content.trim()) {
            alert('Please enter some content for your post');
            return;
        }

        if (!authUser || !authUser.id) {
            alert('You must be logged in to create a post');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                `http://localhost:8000/api/posts/upload/${authUser.id}`,
                { content: content.trim() }
            );

            if (response.data.success) {
                alert('Post created successfully!');
                setContent(''); // Clear the form
                onClose(); // Close the modal
                // Trigger post refresh
                if (onPostCreated) {
                    onPostCreated();
                }
            } else {
                alert('Failed to create post: ' + (response.data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error creating post:', error);
            if (error.response && error.response.data && error.response.data.error) {
                alert('Error: ' + error.response.data.error);
            } else {
                alert('Failed to create post. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-12 w-[700px] max-w-full border border-black relative max-h-[90vh] overflow-y-auto flex flex-col items-center">
                <h2 className="text-2xl font-extrabold font-rubik text-center text-[#2d39e8] mb-6">
                    CREATE POST
                </h2>

                <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
                    {/* User Profile Section */}
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 font-rubik">{authUser.name}</h3>
                            <p className="text-sm text-gray-500 font-poppins">What's on your mind?</p>
                        </div>
                    </div>

                    {/* Text Area */}
                    <div>
                        <label className="block text-xs font-poppins font-semibold mb-1">Post Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your thoughts, experiences, or ask questions..."
                            className="w-full h-40 p-4 border border-gray-400 font-poppins rounded resize-none focus:ring-2 focus:ring-[#2d39e8] focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    {/* Character Count */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 font-poppins">
                            {content.length} characters
                        </span>
                        <span className="text-sm text-gray-500 font-poppins">
                            {content.length > 0 ? Math.ceil(content.length / 280) : 0} of unlimited posts
                        </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex w-full justify-between mt-8 gap-4">
                        <button
                            type="button"
                            className="bg-red-400 hover:bg-red-500 text-white text-xs font-rubik font-bold py-2 px-4 rounded"
                            onClick={onClose}
                        >
                            GO BACK
                        </button>
                        <button
                            type="submit"
                            disabled={!content.trim() || isLoading}
                            className={`text-xs font-rubik font-bold py-2 px-4 rounded ${
                                content.trim() && !isLoading
                                    ? 'bg-gradient-to-r from-[#85b4fa] to-[#e8f2f8] hover:from-blue-400 hover:to-blue-200 text-blue-900'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {isLoading ? 'POSTING...' : 'POST'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MakePostModal;