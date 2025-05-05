import React from 'react';

const TeamCard = ({ team }) => {
  // Only render the card if the team is public
  if (team.privacy !== "public") {
    return null; // Don't render anything for private teams
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-2 text-black">
      <img
        src={team.imageUrl || 'https://via.placeholder.com/150'}
        alt={team.teamName}
        className="w-full h-32 object-cover rounded-lg"
      />
      <h3 className="text-xl font-semibold mt-4">{team.teamName}</h3>

      <p><strong>Members:</strong> {team.members.map(member => member.uname).join(', ')}</p>
      <p><strong>Privacy:</strong> {team.privacy}</p>
    </div>
  );
};

export default TeamCard;
