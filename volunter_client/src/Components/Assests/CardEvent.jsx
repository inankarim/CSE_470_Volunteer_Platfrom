import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
    Tooltip,
    IconButton,
  } from "@material-tailwind/react";
  
  const CardEvent = ({ event, setEvents }) => {
    const { title, description, location, date, time, image, category } = event;
  
    return (
      <Card className="flex flex-col justify-between w-full max-w-[26rem] min-h-[500px] shadow-lg p-4 text-black">
        {/* Image Section */}
        <CardHeader floated={false} color="blue-gray" className="relative h-32">
          <img
            className="w-full h-full object-cover"
            src={image}
            alt={title}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-black/60" />
          <IconButton
            size="sm"
            color="red"
            variant="text"
            className="!absolute top-2 right-2 rounded-full"
          >
            {/* Bookmark icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M6.75 3A2.25 2.25 0 004.5 5.25v15.086a.75.75 0 001.2.6l6.3-4.725 6.3 4.725a.75.75 0 001.2-.6V5.25A2.25 2.25 0 0017.25 3H6.75z" />
            </svg>
          </IconButton>
        </CardHeader>
  
        {/* Body Section */}
        <CardBody className="flex flex-col flex-grow gap-3">
          <div className="flex items-center justify-between">
            <Typography variant="h6" className="text-sm font-semibold">
              {title}
            </Typography>
            <Typography className="text-xs px-2 py-1 rounded-full bg-green-100 font-medium">
              {category}
            </Typography>
          </div>
  
          <Typography className="text-sm leading-snug">
            {description}
          </Typography>
  
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <Tooltip content={`Date: ${date}`}>
              <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                📅 {date}
              </span>
            </Tooltip>
            <Tooltip content={`Time: ${time}`}>
              <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                ⏰ {time}
              </span>
            </Tooltip>
            <Tooltip content={`Location: ${location}`}>
              <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                📍 {location}
              </span>
            </Tooltip>
          </div>
        </CardBody>
  
        {/* Footer Section */}
        <CardFooter className="pt-3 bg-black text-white mt-auto">
          <Button size="sm" fullWidth>
            Join Now
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  export default CardEvent;
  