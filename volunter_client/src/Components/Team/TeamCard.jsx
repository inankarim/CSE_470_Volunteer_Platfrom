import React, { useState, useEffect, useContext } from 'react';
import { Button } from '@material-tailwind/react';
import { AuthContext } from '../routes/AuthProviders';  // Assuming AuthContext holds the user information
import Swal from 'sweetalert2';  // Import SweetAlert2 for popups

const TeamCard = ({ team }) => {
  const [hasJoined, setHasJoined] = useState(false);
  const { dbUser } = useContext(AuthContext); // Get logged-in user's info (e.g., UID)

  // Fetch the user's teams from the backend
  useEffect(() => {
    if (dbUser?.uid) {
      fetch(`/api/user/${dbUser.uid}/teams`)
        .then(response => response.json())
        .then(data => {
          if (data.includes(team._id)) {
            setHasJoined(true);  // Set the state to 'true' if the user has already joined this team
          }
        })
        .catch((error) => {
          console.error("Error fetching user's teams:", error);
        });
    }
  }, [team._id, dbUser?.uid]);

  // Handle team join
  const handleJoin = () => {
    if (dbUser?.uid) {
      const body = {
        userId: dbUser.uid,
        teamId: team._id,
        uname: dbUser.uname // Assuming user object has a username field
      };

      // Send a POST request to join the team
      fetch('/api/join-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'User joined the team successfully') {
          setHasJoined(true);  // Update UI to reflect that the user has joined the team
          // Show the success popup
          Swal.fire({
            title: 'Success!',
            text: 'You have successfully joined the team.',
            icon: 'success',
            confirmButtonText: 'Awesome!'
          });
        }
      })
      .catch(error => {
        console.error("Error joining team:", error);
      });
    }
  };

  if (team.privacy !== "public") {
    return null;  // Don't render the team card if it's not public
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

      <div className="flex justify-center mt-4">
        <Button
          className="bg-black text-white hover:bg-gray-800"
          onClick={handleJoin}
          disabled={hasJoined}  // Disable the button if the user has already joined
        >
          {hasJoined ? "You've Joined" : "Join Team"}
        </Button>
      </div>
    </div>
  );
};

export default TeamCard;
