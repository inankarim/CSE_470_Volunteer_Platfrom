import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import Modal from "./Modal"; // Adjust path if needed (this assumes it's in the same folder)

const CardEvent = ({ event, setEvents }) => {
  const { title, description, location, date, time, image, category } = event;
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <Card className="flex flex-col justify-between w-full max-w-[26rem] min-h-[20rem] shadow-lg">
        {/* Image and Content */}
        <CardHeader color="blue-gray" className="relative h-56">
          <img src={image} alt={title} className="h-full w-full object-cover" />
        </CardHeader>

        <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              {title}
            </Typography>
            <Typography className="text-sm text-black-500 italic mb-1">
              Category: {category || 'N/A'}
            </Typography>
            <Typography className="line-clamp-3">{description}</Typography>
        </CardBody>

        {/* Centered Join Button */}
        <CardFooter className="pt-4 flex justify-center">
          <Button onClick={handleOpen} className="bg-black text-white">
            Join Event
          </Button>
        </CardFooter>
      </Card>

      {/* Show Modal on Click */}
      {open && <Modal event={event} closeModal={handleOpen} />}
    </>
  );
};

export default CardEvent;
