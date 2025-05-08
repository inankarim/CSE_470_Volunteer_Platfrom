import React, { useState, useEffect } from 'react';
import { Button } from '@material-tailwind/react';

const TeamCard = ({ team }) => {
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    const joinedTeams = JSON.parse(localStorage.getItem('joinedTeams')) || [];
    if (joinedTeams.includes(team._id)) {
      setHasJoined(true);
    }
  }, [team._id]);

  if (team.privacy !== "public") {
    return null;
  }

  const handleJoin = () => {
    const joinedTeams = JSON.parse(localStorage.getItem('joinedTeams')) || [];
    if (!joinedTeams.includes(team._id)) {
      joinedTeams.push(team._id);
      localStorage.setItem('joinedTeams', JSON.stringify(joinedTeams));
    }
    
    setHasJoined(true);
  };

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

      <div className="flex justify-center mt-4">
        <Button
          className="bg-black text-white hover:bg-gray-800"
          onClick={handleJoin}
          disabled={hasJoined}
        >
          {hasJoined ? "You've Joined" : "Join Team"}
        </Button>
      </div>
    </div>
  );
};

export default TeamCard;
