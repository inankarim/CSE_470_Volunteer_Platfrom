import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../routes/AuthProviders';
import Swal from "sweetalert2";

const CommunityCard = ({ req }) => {
    const { dbUser } = useContext(AuthContext);
    const [messageText, setMessageText] = useState('');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(true);

    const fetchComments = async () => {
        setCommentsLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/messages/${req._id}`);
            const data = await res.json();
            const normalized = data.map(comment => ({
                ...comment,
                _id: comment._id?.$oid || comment._id,
                timestamp: comment.timestamp?.$date || comment.timestamp,
            }));
            setComments(normalized);
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        } finally {
            setCommentsLoading(false);
        }
    };
    

    useEffect(() => {
        fetchComments();
    }, [req._id]);

    const handleSend = () => {
        if (!messageText.trim()) return;

        const newMessage = {
            messageText: messageText.trim(),
            userId: dbUser.uid,
            userName: dbUser.uname || 'Anonymous',
            postId: req._id,
            timestamp: new Date().toISOString()
        };

        setLoading(true);
        setMessageText('');

        fetch("http://localhost:3000/messages", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMessage),
        })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) {
                    Swal.fire({
                        title: "Success",
                        text: "Message sent successfully!",
                        icon: "success"
                    });
                    fetchComments(); // Refresh messages
                } else {
                    Swal.fire("Error", "Message send failed", "error");
                }
            })
            .catch(err => {
                console.error(err);
                Swal.fire("Error", "Failed to send message", "error");
            })
            .finally(() => setLoading(false));
    };

    const { title, description, urgencyLevel, location, userName } = req;

    return (
        <div className="w-full p-6 bg-black text-white space-y-6">
            {/* Post Title */}
            <h2 className="text-2xl font-bold">{title}</h2>

            {/* Post Description */}
            <p className="text-gray-300">{description}</p>

            {/* Metadata */}
            <div className="text-sm text-gray-500 space-y-1">
                <p>Urgency: {urgencyLevel}</p>
                {location && <p>Location: {location}</p>}
                <p>Posted by: {userName || 'Anonymous'}</p>
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-700 pt-4">
                <p className="text-lg font-semibold mb-3">Replies</p>

                {/* Comments Loader */}
                {commentsLoading ? (
                    <p className="text-gray-500 italic">Loading replies...</p>
                ) : comments.length === 0 ? (
                    <p className="text-gray-500 italic">No replies yet.</p>
                ) : (
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {comments.map((comment, index) => (
                            <div key={comment._id || index} className="flex items-start space-x-3">
                                <img
                                    className="w-9 h-9 rounded-full"
                                    src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                                    alt="avatar"
                                />
                                <div>
                                    <div className="text-sm text-gray-400">
                                        {comment.userName}
                                        <span className="ml-2 text-xs opacity-50">
                                            {new Date(comment.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="bg-gray-800 text-white px-4 py-2 rounded-lg mt-1 inline-block">
                                        {comment.messageText}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Reply Input */}
                <div className="flex items-center mt-5">
                    <input
                        type="text"
                        placeholder="Write a reply..."
                        value={messageText}
                        onChange={e => setMessageText(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={loading}
                        className="ml-3 px-4 py-2 rounded-md bg-gray-700 text-white"
                    >
                        {loading ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommunityCard;
