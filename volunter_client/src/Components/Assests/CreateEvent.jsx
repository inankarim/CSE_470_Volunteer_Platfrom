// CreateEvent.jsx
import React from "react";
import Swal from "sweetalert2";
import Navbar from "../Layout/Navbar";

const CreateEvent = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const location = form.location.value;
    const date = form.date.value;
    const time = form.time.value;
    const image = form.image.value;
    const category = form.category.value;

    const newEvent = { title, description, location, date, time, image, category };
    console.log(newEvent);

    fetch("http://localhost:3000/event", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEvent),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.insertedId) {
          Swal.fire({
            title: "Success",
            text: "Event Added Successfully",
            icon: "success",
          });
        }
      });
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-neutral px-4 py-8">
        <div className="card w-full max-w-2xl bg-base-100 shadow-2xl">
          <div className="card-body space-y-6">
            <h2 className="text-3xl font-bold text-center text-primary-content">Create Volunteer Event</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Form fields */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
