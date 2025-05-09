import { useState } from 'react';
import { Button } from '@material-tailwind/react';
import TeamModal from './TeamModal'; // Make sure path is correct

const TeamCard = ({ team }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        <Button onClick={handleOpen} className="bg-black text-white">
          Join Team
        </Button>
      </div>

      {open && <TeamModal team={team} closeModal={handleClose} />}
    </div>
  );
};

export default TeamCard;
