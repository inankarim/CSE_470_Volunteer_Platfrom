import React, { useState } from 'react';

const Team = () => {
    const [teamName, setTeamName] = useState('');
    const [teamMembers, setTeamMembers] = useState(['']);
    const [privacy, setPrivacy] = useState('public');
    const [teamImage, setTeamImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const handleMemberChange = (index, value) => {
        const updated = [...teamMembers];
        updated[index] = value;
        setTeamMembers(updated);
    };

    const addMember = () => {
        setTeamMembers([...teamMembers, '']);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTeamImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const teamData = {
            teamName,
            members: teamMembers,
            memberCount: teamMembers.length,
            privacy,
            teamImage
        };
        console.log('Team Created:', teamData);
        // Handle API integration here
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-2xl shadow-lg mt-10">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Create Your Project Team</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Team Image Upload */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Team Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 border rounded-md bg-white"
                    />
                    {previewImage && (
                        <div className="mt-4">
                            <img src={previewImage} alt="Team Preview" className="rounded-xl w-48 h-48 object-cover shadow" />
                        </div>
                    )}
                </div>

                {/* Team Name */}
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

                {/* Privacy */}
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

                {/* Team Members */}
                <div>
                    <label className="block font-medium text-gray-700 mb-2">Team Members</label>
                    {teamMembers.map((member, index) => (
                        <input
                            key={index}
                            type="text"
                            placeholder={`Member ${index + 1} Name`}
                            value={member}
                            onChange={(e) => handleMemberChange(index, e.target.value)}
                            className="w-full mb-2 p-2 border border-gray-300 rounded-md shadow-sm"
                            required
                        />
                    ))}
                    <button
                        type="button"
                        onClick={addMember}
                        className="text-blue-600 hover:underline text-sm mt-1"
                    >
                        + Add another member
                    </button>
                </div>

                {/* Member Count */}
                <div>
                    <p className="text-gray-600 font-medium">Total Members: {teamMembers.length}</p>
                </div>

                {/* Submit */}
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                        Create Team
                    </button>
                </div>
            </form>

            {/* Preview Section */}
            {teamName && (
                <div className="mt-10 border-t pt-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Team Dashboard (Preview)</h3>
                    <p><strong>Team Name:</strong> {teamName}</p>
                    <p><strong>Privacy:</strong> {privacy}</p>
                    <p><strong>Members:</strong></p>
                    <ul className="list-disc pl-6 text-gray-700">
                        {teamMembers.map((member, idx) => (
                            <li key={idx}>{member}</li>
                        ))}
                    </ul>
                    {previewImage && (
                        <div className="mt-4">
                            <p className="font-medium">Team Picture:</p>
                            <img src={previewImage} alt="Team Preview" className="w-32 h-32 object-cover rounded-md mt-2" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Team;
