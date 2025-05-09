import React, { useState, useEffect, useContext } from 'react';
import { Button } from '@material-tailwind/react';
import { AuthContext } from '../routes/AuthProviders';  // Assuming AuthContext holds the user information
import Swal from 'sweetalert2';  // Import SweetAlert2 for popups

const TeamCard = ({ team,setTeams }) => {

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
        <button className='bg-black rounded-sm p-2 text-white'>Join team</button>
      </div>
    </div>
  );
};

export default TeamCard;
