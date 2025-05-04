import React, { useContext, useState } from 'react';
import Navbar from '../Layout/Navbar';
import { AuthContext } from '../routes/AuthProviders';
import Swal from 'sweetalert2';
import { useLoaderData } from 'react-router-dom';

const Team = () => {
    const { user, dbUser } = useContext(AuthContext);
    const [teamName, setTeamName] = useState('');
    const [teamMembers, setTeamMembers] = useState([{}]);
    const [privacy, setPrivacy] = useState('public');
    const [teamImageUrl, setTeamImageUrl] = useState('');
    const users = useLoaderData();
    const[datamembers,setdataTeamMembers]=useState(users)

    const handleMemberChange = (index, selectedUser) => {
        const updated = [...teamMembers];
        updated[index] = { uid: selectedUser.uid, uname: selectedUser.uname };
        setTeamMembers(updated);
    };
    
    

    const addMember = () => {
        setTeamMembers([...teamMembers, '']);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validation: check for empty or invalid members
        if (!teamMembers.length || teamMembers.some(m => !m.uid)) {
            return Swal.fire({
                title: "Validation Error",
                text: "Please add at least one valid team member.",
                icon: "warning"
            });
        }

        const teamData = {
            teamName,
            leaderUid: dbUser?.uid || user?.uid,
            members: teamMembers, // no trimming or filtering
            privacy,
            imageUrl: teamImageUrl
        };

        fetch("http://localhost:3000/team", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teamData)
        })
            .then(res => res.json())
            .then(data => {
                console.log('Server response:', data);
                if (data.insertedId || data.acknowledged) {
                    Swal.fire({
                        title: "Success",
                        text: "Team Created Successfully",
                        icon: "success"
                    });
                    setTeamName('');
                    setTeamMembers(['']);
                    setPrivacy('public');
                    setTeamImageUrl('');
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Failed to create team",
                        icon: "error"
                    });
                }
            })
            .catch(err => {
                console.error('Error:', err);
                Swal.fire({
                    title: "Error",
                    text: "Something went wrong",
                    icon: "error"
                });
            });
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-2xl shadow-lg mt-10">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Create Your Project Team</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Team Picture URL</label>
                        <input
                            type="url"
                            value={teamImageUrl}
                            onChange={(e) => setTeamImageUrl(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter image URL"
                        />
                        {teamImageUrl && (
                            <div className="mt-4">
                                <img src={teamImageUrl} alt="Team Preview" className="rounded-xl w-48 h-48 object-cover shadow" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Team Name</label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your team name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Privacy</label>
                        <select
                            value={privacy}
                            onChange={(e) => setPrivacy(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-2">Team Members</label>
                        {teamMembers.map((member, index) => (
                            <select
                            key={index}
                            value={teamMembers[index]?.uid || ''}
                            onChange={(e) => {
                                const selectedUid = e.target.value;
                                const selectedUser = users.find(u => u.uid === selectedUid);
                                handleMemberChange(index, selectedUser);
                            }}
                            className="w-full mb-2 p-2 border border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">
                                {teamMembers[index]?.uname || 'Select member'}
                            </option>
                            {users
                                .filter(user => !teamMembers.some(member => member?.uid === user.uid))
                                .map(user => (
                                    <option key={user.uid} value={user.uid}>
                                        {user.uname} ({user.skills})
                                    </option>
                            ))}

                        </select>
                        
                        ))}
                        <button
                            type="button"
                            onClick={addMember}
                            className="text-blue-600 hover:underline text-sm mt-1"
                        >
                            + Add another member
                        </button>
                    </div>


                    <div>
                        <p className="text-gray-600 font-medium">Total Members: {teamMembers.length}</p>
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
                        >
                            Create Team
                        </button>
                    </div>
                </form>

                {teamName && (
                    <div className="mt-10 border-t pt-6">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Team Dashboard (Preview)</h3>
                        <p><strong>Team Name:</strong> {teamName}</p>
                        <p><strong>Privacy:</strong> {privacy}</p>
                        <p><strong>Members:</strong></p>
                        <ul className="list-disc pl-6 text-gray-700">
                            {teamMembers.map((member, idx) => (
                                <li key={idx}>{member?.uname || '(empty)'}</li>
                            ))}
                        </ul>

                        {teamImageUrl && (
                            <div className="mt-4">
                                <p className="font-medium">Team Picture:</p>
                                <img src={teamImageUrl} alt="Team Preview" className="w-32 h-32 object-cover rounded-md mt-2" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Team;
