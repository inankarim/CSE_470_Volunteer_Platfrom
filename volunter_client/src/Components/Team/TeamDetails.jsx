import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../routes/AuthProviders';  // Access user data
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';

const TeamDetails = () => {
  const { id } = useParams(); // Get the team ID from the URL
  const { dbUser } = useContext(AuthContext); // Get the logged-in user
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch team data from the backend
  useEffect(() => {
    fetch(`http://localhost:3000/team/${id}`)  // Check if the correct team ID is passed in `id`
      .then(res => res.json())
      .then(data => {
        setTeam(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching team:", err);
        setLoading(false);
      });
  }, [id]);  // Depend on the team ID
  

  const handleJoin = async () => {
    try {
      if (dbUser) {
        // Sending POST request to the backend to join the team
        const response = await fetch('http://localhost:3000/join-team', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            teamId: team._id,
            userEmail: dbUser.email, // Send the user email
            userId: dbUser.uid, // Send the user ID
            userName: dbUser.uname, // Send the user name
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Show success message using SweetAlert
          Swal.fire({
            title: 'Success',
            text: 'Successfully joined the team!',
            icon: 'success',
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: data.message || 'Failed to join the team.',
            icon: 'error',
          });
        }
      } else {
        alert('Please log in first.');
      }
    } catch (error) {
      console.error("Error joining team:", error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while joining the team.',
        icon: 'error',
      });
    }
  };

  if (loading) return <div>Loading team...</div>;

  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <img
          src={team.imageUrl || 'https://via.placeholder.com/150'}
          alt={team.teamName}
          className="w-full h-64 object-cover rounded-t-lg"
        />
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center">{team.teamName}</h2>
          <p className="text-lg">{team.description}</p>
          <p><strong>Privacy:</strong> {team.privacy}</p>
          <p><strong>Members:</strong> {team.members.map(member => member.uname).join(', ')}</p>

          <div className="flex justify-center mt-4">
            <button
              className="btn btn-primary"
              onClick={handleJoin}
            >
              Join Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
