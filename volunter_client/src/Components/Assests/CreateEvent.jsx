import React, { useState } from "react";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Created:", { ...formData, image });
    alert("🎉 Volunteer event created successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral px-4 py-8">
      <div className="card w-full max-w-2xl bg-base-100 shadow-2xl">
        <div className="card-body space-y-6">
          <h2 className="text-3xl font-bold text-center text-primary-content">Create Volunteer Event</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="label">
                <span className="label-text text-lg text-base-content">Event Title</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Beach Cleanup"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="label">
                <span className="label-text text-lg text-base-content">Description</span>
              </label>
              <textarea
                name="description"
                className="textarea textarea-bordered w-full h-24"
                placeholder="Describe the purpose and tasks for this event"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Date & Time */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label className="label">
                  <span className="label-text text-lg text-base-content">Date</span>
                </label>
                <input
                  type="date"
                  name="date"
                  className="input input-bordered w-full"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="w-full">
                <label className="label">
                  <span className="label-text text-lg text-base-content">Time</span>
                </label>
                <input
                  type="time"
                  name="time"
                  className="input input-bordered w-full"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="label">
                <span className="label-text text-lg text-base-content">Location</span>
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g., Central Park, NY"
                className="input input-bordered w-full"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="label">
                <span className="label-text text-lg text-base-content">Event Image / Banner</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded-lg w-full max-h-64 object-cover border border-base-300"
                  />
                </div>
              )}
              <p className="text-sm text-gray-400 mt-1">Upload a banner or flyer (JPG/PNG)</p>
            </div>

            {/* Category */}
            <div>
              <label className="label">
                <span className="label-text text-lg text-base-content">Category</span>
              </label>
              <select
                name="category"
                className="select select-bordered w-full"
                value={formData.category}
                onChange={handleChange}
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
            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-primary btn-block text-lg tracking-wide"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
