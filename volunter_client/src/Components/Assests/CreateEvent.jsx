import React from "react";
import Swal from "sweetalert2";
import Navbar from "../Layout/Navbar";

const CreateEvent = () => {
  const handleSubmit = e => {
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newEvent)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.insertedId) {
          Swal.fire({
            title: "Success",
            text: "Event Added Successfully",
            icon: "success"
          });
        }
      });
  };
  return (
    <div>
      <Navbar></Navbar>
  
      <div className="min-h-screen w-full flex items-center justify-center bg-neutral px-6 py-10">
      <div className="w-full h-full bg-base-100 shadow-2xl rounded-lg p-10">
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center text-primary-content">Create Volunteer Event</h2>

          <form onSubmit={handleSubmit} className="space-y-6 text-xl text-base-content">
            {/* Title */}
            <div>
              <label className="label">
                <span className="label-text">Event Title</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Beach Cleanup"
                className="input input-bordered w-full text-lg"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                className="textarea textarea-bordered w-full h-28 text-lg"
                placeholder="Describe the purpose and tasks for this event"
                required
              ></textarea>
            </div>

            {/* Date & Time */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Date</span>
                </label>
                <input
                  type="date"
                  name="date"
                  className="input input-bordered w-full text-lg"
                  required
                />
              </div>
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Time</span>
                </label>
                <input
                  type="time"
                  name="time"
                  className="input input-bordered w-full text-lg"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g., Central Park, NY"
                className="input input-bordered w-full text-lg"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="label">
                <span className="label-text">Event Image / Banner</span>
              </label>
              <input
                type="url"
                name="image"
                className="input input-bordered w-full text-lg"
              />
              <p className="text-base text-gray-400 mt-1">Upload a banner or flyer (JPG/PNG)</p>
            </div>

            {/* Category */}
            <div>
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                name="category"
                className="select select-bordered w-full text-lg"
                required
              >
                <option value="" disabled>Select a volunteer category</option>
                <option value="environmental">🌿 Environmental Cleanup</option>
                <option value="education">📚 Tutoring / Education</option>
                <option value="animal">🐾 Animal Shelter Help</option>
                <option value="food">🍱 Food Distribution</option>
                <option value="community">🤝 Community Support</option>
                <option value="health">🏥 Health / Wellness</option>
              </select>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                value="addevent"
                className="btn btn-primary btn-block text-xl tracking-wide"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
};
export default CreateEvent;