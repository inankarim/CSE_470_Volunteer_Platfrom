import { useLoaderData } from 'react-router-dom';
import './App.css';
import CardEvent from './Components/Assests/CardEvent';
import HomeLayout from './Components/Layout/HomeLayout';
import Navbar from './Components/Layout/Navbar';
import { useEffect, useState } from 'react';
import TeamCard from './Components/Team/TeamCard';


function App() {
  const loadedEvents = useLoaderData();
  const [events, setEvents] = useState(loadedEvents);
  const [searchTerm, setSearchTerm] = useState('');
  //write a fetch code for teams here then
  const [teams, setTeams] = useState([]); // State to store the list of teams
  const [loading, setLoading] = useState(true); // State to handle loading state

  // Fetch teams from the backend API
  useEffect(() => {
    fetch('http://localhost:3000/teams') // Replace with the appropriate API URL
      .then((response) => response.json())
      .then((data) => {
        setTeams(data); // Store teams data in state
        setLoading(false); // Set loading to false after fetching data
      })
      .catch((error) => {
        console.error('Error fetching teams:', error);
        setLoading(false); // Set loading to false even if there's an error
      });
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Loading state
  if (loading) {
    return <p>Loading teams...</p>;
  }

  // If no teams are found
  if (teams.length === 0) {
    return <p>No teams available.</p>;
  }

  return (
    <>
      <div className='bg-whites'>
        {/* navbar */}
        <Navbar />
        <HomeLayout />

        {/* header */}
        {/* search bar */}
        <div className='flex justify-center my-6'>
          <input
            type="text"
            placeholder="Search by event name or category..."
            className="border border-gray-300 rounded-md p-2 w-full max-w-md shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* content */}
        <div className='grid md:grid-cols-3 gap-4 m-2'>
          {
            events
              .filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.category?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(event => (
                <CardEvent key={event._id} event={event} setEvents={setEvents} />
              ))
          }
        </div>

        <div className='grid grid-cols-3 gap-4 '>
        {
            teams
              .map(team => (
                <TeamCard key={team._id} team={team} setTeams={setTeams} />
              ))
          } 

        </div>


        {/* footer */}
      </div>
    </>
  );
}
export default App;

