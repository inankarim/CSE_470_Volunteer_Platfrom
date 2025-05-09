import React, { useContext, useRef, useState, useEffect } from 'react';
import { AuthContext } from '../routes/AuthProviders';
import {
  FaTachometerAlt,
  FaUsers,
  FaHistory,
  FaCertificate,
  FaCog
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Users = () => {
  const { dbUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userEvents, setUserEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    if (dbUser) {
      console.log('dbUser:', dbUser);
      setIsLoading(false);

      if (dbUser.events && dbUser.events.length > 0) {
        fetchEvents(dbUser.events);
      } else {
        setEventsLoading(false);
      }
    }
  }, [dbUser]);

  const fetchEvents = async (eventIds) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventIds }),
      });
      const data = await response.json();
      setUserEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#0f172a] min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Loading user info...</p>
      </div>
    );
  }

  const firstName = dbUser?.fname || dbUser?.first_name || 'First';
  const lastName = dbUser?.lname || dbUser?.last_name || 'Last';
  const username = dbUser?.uname || dbUser?.user_name ||  'anonymous';
  const joinedDate = dbUser?.createdAt || dbUser?.created_at || dbUser?.creationTime || 'Unknown';
  const eventCount = dbUser?.events?.length || 0;
  const totalHours = eventCount * 6;
  const totalPoints = eventCount * 3;

  return (
    <div className="min-h-screen bg-[#0f172a] flex text-[18px] sm:text-[20px]">
      {/* Sidebar */}
      <div className="w-72 bg-[#1e293b] text-white p-6 space-y-6">
        <div className="font-bold text-2xl mb-6">Dashboard</div>
        <ul className="space-y-5 text-lg">
          <li className="flex items-center space-x-3 hover:text-blue-400 cursor-pointer">
            <FaTachometerAlt />
            <span><Link to='/myevent'>Joined Events</Link></span>
          </li>
          <li className="flex items-center space-x-3 hover:text-blue-400 cursor-pointer">
            <FaUsers />
            <span><Link to='/team_crt'> Team</Link></span>
          </li>
          <li className="flex items-center space-x-3 hover:text-blue-400 cursor-pointer">
            <FaHistory />
            <span>Certificates</span>
          </li>
          <li className="flex items-center space-x-3 hover:text-blue-400 cursor-pointer">
            <FaCog />


          
            <span><Link to='/user_update'>Settings</Link></span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start py-12 px-8">
        <div className="bg-[#1e293b] rounded-xl shadow-lg p-10 w-full max-w-4xl text-white">
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={profileImage || '/default-avatar.png'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border object-cover bg-gray-600"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 left-0 text-sm text-blue-400 hover:underline"
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div>
                <div className="text-3xl font-bold">{firstName} {lastName}</div>
              </div>
            </div>
            <div className="flex space-x-12 text-center">
              <div>
                <div className="text-blue-400 text-3xl font-bold">{totalHours}</div>
                <div className="text-gray-400 text-base">Hours</div>
              </div>
              <div>
                <div className="text-green-400 text-3xl font-bold">{totalPoints}</div>
                <div className="text-gray-400 text-base">Points</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <div className="text-gray-400">Username:</div>
              <div className="font-semibold text-lg">{username}</div>
            </div>
            <div>
              <div className="text-gray-400">Email:</div>
              <div className="font-semibold text-lg">{dbUser?.email || 'N/A'}</div>
            </div>
            <div>
              <div className="text-gray-400">Skills:</div>
              <div className="font-semibold text-lg">{dbUser?.skills || 'None listed'}</div>
            </div>
            <div>
              <div className="text-gray-400">Joined:</div>
              <div className="font-medium text-lg">{joinedDate}</div>
            </div>
          </div>

          {/* Events Section */}
          <div className="mt-12">
            <h2 className="font-semibold text-xl mb-4">Your Events ({eventCount})</h2>
            {eventsLoading ? (
              <div className="bg-[#334155] rounded-lg p-6 text-white">
                <div className="text-gray-300">Loading events...</div>
              </div>
            ) : eventCount > 0 ? (
              <div className="space-y-4">
                {userEvents.map((event, index) => (
                  <div key={index} className="bg-[#334155] rounded-lg p-6 text-white">
                    <div className="font-semibold text-lg">{event.title}</div>
                    <div className="text-gray-300 text-base mt-2">{event.description}</div>
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="text-gray-300 text-base">
                        <span className="font-medium">Location:</span> {event.location}
                      </div>
                      <div className="text-gray-300 text-base">
                        <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()} at {event.time}
                      </div>
                      <div className="text-gray-300 text-base">
                        <span className="font-medium">Category:</span> {event.category}
                      </div>
                    </div>
                    {event.image && (
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="mt-4 rounded-lg max-w-full h-auto max-h-40 object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#334155] rounded-lg p-6 text-white">
                <div className="text-gray-300">No events registered yet</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
