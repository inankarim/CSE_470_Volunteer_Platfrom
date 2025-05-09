import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../routes/AuthProviders";
import Swal from "sweetalert2";
import Navbar from "../Layout/Navbar";

const Teamdashboard = () => {
  const { dbUser } = useContext(AuthContext);
  const [team, setTeam] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dbUser?.uid) return;

    Promise.all([
      fetch(`http://localhost:3000/team/leader/${dbUser.uid}`).then(res => res.json()),
      fetch(`http://localhost:3000/users`).then(res => res.json())
    ])
      .then(([teamData, usersData]) => {
        setTeam(teamData);
        setUsers(usersData);
        setLoading(false);
      })
    
      .catch(err => {
        console.error("Failed to load data:", err);
        setLoading(false);
      });
  }, [dbUser]);

  const handleSave = () => {
    fetch(`http://localhost:3000/team/leader/${dbUser.uid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(team)
    })
      .then(res => res.json())
      .then(() => Swal.fire("Success", "Team updated", "success"))
      .catch(() => Swal.fire("Error", "Failed to update team", "error"));
  };

  const handleSaveToBackend = (updatedTeam) => {
    fetch(`http://localhost:3000/team/leader/${dbUser.uid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTeam)
    })
      .then(res => res.json())
      .then(() => {
        Swal.fire("Success", "Team updated", "success");
        setTeam(updatedTeam);
      })
      .catch(() => Swal.fire("Error", "Failed to update team", "error"));
  };

  const handleRemoveMember = (uid) => {
    const updatedMembers = team.members.filter(m => m.uid !== uid);
    const updatedTeam = { ...team, members: updatedMembers };
    setTeam(updatedTeam);
    handleSaveToBackend(updatedTeam);
  };

  const handleAddMember = (uid) => {
    const user = users.find(u => u.uid === uid);
    if (user) {
      const updatedTeam = {
        ...team,
        members: [...team.members, { uid: user.uid, uname: user.uname }]
      };
      setTeam(updatedTeam);
      handleSaveToBackend(updatedTeam);
    }
  };

  if (loading) return <p>Loading team...</p>;
  if (!team) return <p>You are not a team leader.</p>;

  const availableUsers = users.filter(
    u => !team.members.some(m => m.uid === u.uid)
  );

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-2xl shadow-lg mt-10">
        <h2 className="text-3xl font-bold mb-4">{team.teamName}</h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">Team Name</label>
          <input
            type="text"
            value={team.teamName}
            onChange={e => setTeam({ ...team, teamName: e.target.value })}
            className="w-full p-2 border bg-gray-700 text-white rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Team Image URL</label>
          <input
            type="text"
            value={team.imageUrl}
            onChange={e => setTeam({ ...team, imageUrl: e.target.value })}
            className="w-full p-2 border bg-gray-700 text-white rounded"
          />
          {team.imageUrl && <img src={team.imageUrl} alt="Team" className="mt-2 w-40 h-40 object-cover rounded" />}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Current Members</h3>
          {team.members.length === 0 ? (
            <p className="text-gray-400">No members in the team yet.</p>
          ) : (
            <ul>
              {team.members.map((m) => (
                <li key={m.uid} className="flex justify-between items-center mb-1">
                  {m.uname}
                  <button
                    onClick={() => handleRemoveMember(m.uid)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Add New Member</h3>
          {availableUsers.length === 0 ? (
            <p className="text-gray-400">All users are already in the team.</p>
          ) : (
            <select
              onChange={(e) => {
                handleAddMember(e.target.value);
                e.target.value = "";
              }}
              className="w-full p-2 bg-gray-700 text-white border rounded"
              defaultValue=""
            >
              <option value="">Select member to add</option>
              {availableUsers.map(u => (
                <option key={u.uid} value={u.uid}>
                  {u.uname} ({u.skills})
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Teamdashboard;
