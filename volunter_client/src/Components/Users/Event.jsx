import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {AuthContext} from '../routes/AuthProviders';
import {
  Typography,
  Button,
  Card,
  CardBody,
  CardHeader,
  Avatar,
  IconButton,
  Spinner
} from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/solid";

const Event = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Get current user from your auth context
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const url = `/api/event/${id}${currentUser ? `?userUid=${currentUser.uid}` : ''}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Event not found');
        }
        
        const data = await response.json();
        setEvent(data);
        setIsAttending(data.isAttending || false);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, currentUser?.uid]);

  const handleAttendEvent = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch('/api/join-event', {
        method: isAttending ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: id,
          userEmail: currentUser.email,
          userUid: currentUser.uid
        })
      });

      if (response.ok) {
        setIsAttending(!isAttending);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Typography variant="h4" className="mb-4">
          Event not found
        </Typography>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <IconButton variant="text" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeftIcon className="h-5 w-5" />
        </IconButton>
        <Typography variant="h3" className="inline-block">
          {event.title}
        </Typography>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader floated={false} className="h-80">
              <img
                src={event.image || "https://placehold.co/800x400?text=Event+Image"}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                  <Typography>{new Date(event.date).toLocaleDateString()}</Typography>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2 text-blue-500" />
                  <Typography>{event.time} - {event.endTime}</Typography>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />
                  <Typography>{event.location}</Typography>
                </div>
                {event.capacity && (
                  <div className="flex items-center">
                    <UserGroupIcon className="h-5 w-5 mr-2 text-blue-500" />
                    <Typography>
                      {event.joinedUsers?.length || 0}/{event.capacity} attendees
                    </Typography>
                  </div>
                )}
              </div>

              <Typography variant="h5" className="mb-4">
                About This Event
              </Typography>
              <Typography className="whitespace-pre-line">
                {event.description}
              </Typography>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardBody className="flex flex-col items-center">
              {isAttending && (
                <div className="flex items-center mb-4 text-green-500">
                  <CheckBadgeIcon className="h-5 w-5 mr-1" />
                  <Typography variant="small">You're attending</Typography>
                </div>
              )}
              
              <Button 
                fullWidth 
                className="mb-4"
                color={isAttending ? "red" : "blue"}
                onClick={handleAttendEvent}
              >
                {isAttending ? "Cancel Attendance" : "Attend Event"}
              </Button>

              {/* Add other event details as needed */}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Event;