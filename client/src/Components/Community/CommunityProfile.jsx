import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Contexts/authContext';
import commenticon from '../../assets/commenticon.svg'
import likeicon from '../../assets/likeicon.svg'
import saveicon from '../../assets/saveicon.svg'

const CommunityProfile = ()=>{
    const { authUser } = useAuth();
    const [userPosts, setUserPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userLikes, setUserLikes] = useState({});
    const [showComments, setShowComments] = useState({});
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState({});

    const fetchUserPosts = async () => {
        if (!authUser || !authUser.id) {
            setError('User not authenticated');
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(`http://localhost:8000/api/posts/user/${authUser.id}`);
            
            if (response.data.success) {
                setUserPosts(response.data.posts);
            } else {
                setError('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching user posts:', error);
            setError('Failed to load posts. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPosts();
    }, [authUser]);

    const handleLike = async (postId) => {
        if (!authUser || !authUser.id) {
            alert('You must be logged in to like posts');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/likes/toggle', {
                userId: authUser.id,
                postId: postId
            });

            if (response.data.success) {
                setUserPosts(prevPosts => 
                    prevPosts.map(post => 
                        post.post_id === postId 
                            ? { ...post, like_count: response.data.likeCount }
                            : post
                    )
                );

                setUserLikes(prev => ({
                    ...prev,
                    [postId]: response.data.action === 'liked'
                }));
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            alert('Failed to like/unlike post');
        }
    };

    const handleCommentClick = async (postId) => {
        const isShowing = showComments[postId];
        
        if (!isShowing) {
            try {
                const response = await axios.get(`http://localhost:8000/api/comments/post/${postId}`);
                if (response.data.success) {
                    setComments(prev => ({
                        ...prev,
                        [postId]: response.data.comments
                    }));
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        }
        
        setShowComments(prev => ({
            ...prev,
            [postId]: !isShowing
        }));
    };

    const handleAddComment = async (postId) => {
        if (!authUser || !authUser.id) {
            alert('You must be logged in to comment');
            return;
        }

        const commentText = newComment[postId];
        if (!commentText || commentText.trim().length === 0) {
            alert('Please enter a comment');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/comments/add', {
                userId: authUser.id,
                postId: postId,
                content: commentText.trim()
            });

            if (response.data.success) {
                setUserPosts(prevPosts => 
                    prevPosts.map(post => 
                        post.post_id === postId 
                            ? { ...post, comment_count: response.data.commentCount }
                            : post
                    )
                );

                setComments(prev => ({
                    ...prev,
                    [postId]: [...(prev[postId] || []), response.data.comment]
                }));

                setNewComment(prev => ({
                    ...prev,
                    [postId]: ''
                }));
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        }
    };

    const handleDeleteComment = async (commentId, postId) => {
        if (!authUser || !authUser.id) {
            alert('You must be logged in to delete comments');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:8000/api/comments/delete/${commentId}`, {
                data: { userId: authUser.id }
            });

            if (response.data.success) {
                setComments(prev => ({
                    ...prev,
                    [postId]: prev[postId].filter(comment => comment.comment_id !== commentId)
                }));

                setUserPosts(prevPosts => 
                    prevPosts.map(post => 
                        post.post_id === postId 
                            ? { ...post, comment_count: post.comment_count - 1 }
                            : post
                    )
                );

                alert('Comment deleted successfully');
            } else {
                alert('Failed to delete comment: ' + (response.data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            if (error.response && error.response.data && error.response.data.error) {
                alert('Error: ' + error.response.data.error);
            } else {
                alert('Failed to delete comment');
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="px-8 pb-8">
                <div className="bg-white rounded-lg shadow-md p-6 w-4xl mx-auto">
                    <div className="flex items-center justify-center">
                        <div className="text-gray-500">Loading your posts...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-8 pb-8">
                <div className="bg-white rounded-lg shadow-md p-6 w-4xl mx-auto">
                    <div className="flex items-center justify-center">
                        <div className="text-red-500">{error}</div>
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div className="bg-[#e0effe] p-8">
            {/* Profile Header */}
            <div className="rounded-lg p-6 w-4xl mx-auto">
                <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gray-400 rounded-full"></div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-rubik">
                            {authUser ? authUser.name : 'User Name'}
                        </h1>
                        <p className="text-gray-600 font-poppins">Total Number of Posts: {userPosts.length}</p>
                    </div>
                </div>
                <h1 className='text-2xl font-bold mt-4 text-gray-900 font-rubik'>Posts</h1>
                <hr style={{ borderColor: 'black', borderWidth: '2px', margin: '20px 0' }} />
            </div>

            {/* User Posts */}
            {userPosts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 w-4xl mx-auto">
                    <div className="flex items-center justify-center">
                        <div className="text-gray-500">You haven't made any posts yet. Create your first post!</div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {userPosts.map((post) => (
                        <div key={post.post_id} className="bg-white rounded-lg shadow-md p-6 w-4xl mx-auto">
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-lg">{post.user_name}</h3>
                                    <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
                                </div>
                            </div>
                            <p className="text-gray-900 text-xl mb-6 leading-relaxed">
                                {post.content}
                            </p>
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex items-center justify-center space-x-8">
                                    <div 
                                        className={`flex items-center space-x-2 cursor-pointer ${
                                            userLikes[post.post_id] 
                                                ? 'text-red-500 hover:text-red-600' 
                                                : 'text-blue-500 hover:text-blue-600'
                                        }`}
                                        onClick={() => handleLike(post.post_id)}
                                    >
                                        <img src={likeicon} alt="Like" className="w-6 h-6" />
                                        <span className="text-base">
                                            {userLikes[post.post_id] ? 'Unlike' : 'Like'} ({post.like_count})
                                        </span>
                                    </div>
                                    <div 
                                        className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 cursor-pointer"
                                        onClick={() => handleCommentClick(post.post_id)}
                                    >
                                        <img src={commenticon} alt="Comment" className="w-6 h-6" />
                                        <span className="text-base">Comment ({post.comment_count})</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 cursor-pointer">
                                        <img src={saveicon} alt="Share" className="w-6 h-6" />
                                        <span className="text-base">Share</span>
                                    </div>
                                </div>
                                
                                {/* Comments Section */}
                                {showComments[post.post_id] && (
                                    <div className="mt-4 border-t border-gray-100 pt-4">
                                        {/* Existing Comments */}
                                        {comments[post.post_id] && comments[post.post_id].length > 0 && (
                                            <div className="space-y-3 mb-4">
                                                {comments[post.post_id].map((comment) => (
                                                    <div key={comment.comment_id} className="flex items-start space-x-3">
                                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="bg-gray-50 rounded-lg p-3">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="font-medium text-sm text-gray-900">{comment.user_name}</h4>
                                                                    {authUser && authUser.id === comment.user_id && (
                                                                        <button
                                                                            onClick={() => handleDeleteComment(comment.comment_id, post.post_id)}
                                                                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                                                                            title="Delete comment"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <p className="text-gray-800 text-sm mt-1">{comment.content}</p>
                                                                <p className="text-xs text-gray-500 mt-1">{formatDate(comment.created_at)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {/* Add Comment Form */}
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                                            </div>
                                            <div className="flex-1 flex space-x-2">
                                                <input
                                                    type="text"
                                                    placeholder="Write a comment..."
                                                    value={newComment[post.post_id] || ''}
                                                    onChange={(e) => setNewComment(prev => ({
                                                        ...prev,
                                                        [post.post_id]: e.target.value
                                                    }))}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleAddComment(post.post_id);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleAddComment(post.post_id)}
                                                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    Post
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CommunityProfile;