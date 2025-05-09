import { Button, Typography } from '@material-tailwind/react';
import { useContext } from 'react';
import { AuthContext } from '../routes/AuthProviders';
import Swal from 'sweetalert2';

const TeamModal = ({ team, closeModal }) => {
  const { dbUser } = useContext(AuthContext);

  const handleJoin = async () => {
    try {
      if (!dbUser) return alert("Please log in first.");

      const response = await fetch('http://localhost:3000/join-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: team._id,
          userEmail: dbUser.email,
          userId: dbUser.uid,
          userName: dbUser.uname,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        Swal.fire('Success', 'Successfully joined the team!', 'success');
        closeModal();
      } else {
        Swal.fire(' Join Error', result.error || 'Could not join team', 'error');
      }
    } catch (error) {
      console.error("Join error:", error);
      Swal.fire('Error', 'An error occurred.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-6 py-10">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-auto shadow-2xl">
        <img
          src={team.imageUrl || 'https://via.placeholder.com/150'}
          alt={team.teamName}
          className="w-full max-h-[450px] object-cover rounded-t-2xl"
        />

        <div className="p-10 text-center">
          <Typography variant="h3" className="font-bold mb-4 text-black">
            {team.teamName}
          </Typography>

          <Typography className="text-gray-700 text-lg mb-2">
            <strong>Privacy:</strong> {team.privacy}
          </Typography>
          <Typography className="text-gray-700 text-lg mb-6">
            <strong>Members:</strong> {team.members.map(m => m.uname).join(', ')}
          </Typography>

          <div className="flex flex-col gap-3 max-w-sm mx-auto">
            <Button onClick={handleJoin} className="bg-black text-white text-lg py-2">
              JOIN TEAM
            </Button>
            <Button variant="outlined" onClick={closeModal} className="text-lg py-2">
              CANCEL
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;
