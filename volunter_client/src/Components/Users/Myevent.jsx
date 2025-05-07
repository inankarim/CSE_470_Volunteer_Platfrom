import React, { useContext, useEffect, useState } from 'react';
import CardEvent from '../Assests/CardEvent';
import { AuthContext } from '../routes/AuthProviders';
import Navbar from '../Layout/Navbar';
import UserEventCard from './UserEventCard';

const MyEvent = () => {
  const { dbUser } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/event/user-events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventIds: dbUser?.events || [] }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching user events:', error);
      } finally {
        setLoading(false);
      }
    };

    if (dbUser?.events?.length) {
      fetchJoinedEvents();
    } else {
      setLoading(false);
    }
  }, [dbUser]);

  return (
    <div className="min-h-screen bg-gray-100 text-black">
     <div className='text-white'><Navbar /></div>
      

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">My Joined Events</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading your events...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500">You have not joined any events yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <UserEventCard key={event._id} event={event} hasJoined={true} setEvents={setEvents} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvent;
