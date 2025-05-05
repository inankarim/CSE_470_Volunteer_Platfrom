import { useLoaderData } from 'react-router-dom';
import './App.css';
import CardEvent from './Components/Assests/CardEvent';
import HomeLayout from './Components/Layout/HomeLayout';
import Navbar from './Components/Layout/Navbar';
import { useState } from 'react';

function App() {
  const loadedEvents = useLoaderData();
  const [events, setEvents] = useState(loadedEvents);
  const [searchTerm, setSearchTerm] = useState('');

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

        {/* footer */}
      </div>
    </>
  );
}

export default App;
