import { Button, Typography } from '@material-tailwind/react';
import Swal from 'sweetalert2'; 
const NewModal = ({ event, closeModal }) => {
  const { _id, title, description, location, date, time, image, category } = event;
  // Get user data from AuthContext
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
              variant="outlined"
              className="text-black border-gray-500"
              onClick={closeModal}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewModal;
