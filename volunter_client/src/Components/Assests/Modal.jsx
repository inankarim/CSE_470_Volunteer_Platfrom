import { Button, Typography } from '@material-tailwind/react';
import { useContext } from 'react';
import { AuthContext } from '../routes/AuthProviders';  // Import AuthContext
import { useState } from 'react';
import Swal from 'sweetalert2'; 
const Modal = ({ event, closeModal }) => {
  const { _id, title, description, location, date, time, image, category } = event;
  
  // Get user data from AuthContext
  const { user, dbUser } = useContext(AuthContext);

  const handleJoin = async () => {
    try {
      if (user && dbUser) {
        const userEmail = dbUser.email; // MongoDB user email
        const userUid = user.uid;       // Firebase user UID
  
        // Sending POST request to the backend to join the event
        const response = await fetch('http://localhost:3000/join-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventId: _id,
            userEmail,
            userUid,
          }),
        });
  
        const data = await response.json(); // Parsing response from backend
        console.log(data);  // Log the response data from the server
  
        if (response.ok) {
          // Show success alert using SweetAlert
          Swal.fire({
            title: "Success",
            text: "Successfully joined the event!",
            icon: "success",
          });
        } else {
          // Show error if something went wrong
          Swal.fire({
            title: "Error",
            text: data.error || "Failed to join event.",
            icon: "error",
          });
        }
  
        closeModal();
      } else {
        alert("Please log in first.");
      }
    } catch (error) {
      console.error("Error joining event:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while joining the event.",
        icon: "error",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full h-full max-w-[90%] md:max-w-[80%] lg:max-w-[60%] overflow-auto">
        <div className="flex flex-col items-center gap-4">
          <img
            src={image}
            alt={title}
            className="w-full max-h-[450px] object-cover rounded-xl shadow-md"
          />
          <Typography variant="h5" className="font-semibold text-lg text-center text-black">
            {title}
          </Typography>
          <Typography className="text-sm text-gray-600 text-center">
            {description}
          </Typography>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-4">
            <div>📅 {date}</div>
            <div>⏰ {time}</div>
            <div>📍 {location}</div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 mt-6 w-full max-w-xs">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800"
              onClick={handleJoin}
            >
              Confirm Join
            </Button>
            <Button
              size="lg"
              variant="outlined"
              className="text-black border-gray-500"
              onClick={closeModal}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;