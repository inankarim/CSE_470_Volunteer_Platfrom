import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Typography } from '@material-tailwind/react';

const EventDetailsPage = () => {
  const { eventId } = useParams();  // Get event ID from URL
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // Fetch event details by eventId
    fetch(`/api/events/${eventId}`)
      .then(response => response.json())
      .then(data => setEvent(data))
      .catch((error) => {
        console.error("Error fetching event:", error);
      });
  }, [eventId]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <img className="w-full h-64 object-cover rounded-md" src={event.image} alt={event.title} />
        <div className="mt-4">
          <Typography variant="h5" className="text-xl font-semibold">
            {event.title}
          </Typography>
          <Typography className="mt-2 text-sm">{event.description}</Typography>
          <Typography className="mt-2 text-sm font-medium">Date: {event.date}</Typography>
          <Typography className="mt-1 text-sm font-medium">Time: {event.time}</Typography>
          <Typography className="mt-1 text-sm font-medium">Location: {event.location}</Typography>
        </div>

        <Button className="mt-6 w-full" color="green">
          Join Now
        </Button>
      </div>
    </div>
  );
};

export default EventDetailsPage;
