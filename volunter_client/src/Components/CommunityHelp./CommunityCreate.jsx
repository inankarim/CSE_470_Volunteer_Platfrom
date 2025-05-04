import React, { useState } from 'react';
import Navbar from '../Layout/Navbar';


const CommunityCreate = ( ) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('medium');
  const [location, setLocation] = useState('');

 
  
 

  return (
    <div> <Navbar></Navbar>
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <form >
          <h2 className="text-2xl font-bold mb-4 text-black">Create a Help Request</h2>

          <div className="form-control mb-4">
            <label className="label" htmlFor="title">
              <span className="label-text">Title</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="What do you need help with?"
              className="input input-bordered w-full"
              value={title}
             
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label" htmlFor="description">
              <span className="label-text">Description</span>
            </label>
            <textarea
              id="description"
              placeholder="Provide details about your request..."
              className="textarea textarea-bordered w-full min-h-[100px]"
              value={description}
              
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label" htmlFor="urgency">
              <span className="label-text">Urgency Level</span>
            </label>
            <select
              id="urgency"
              className="select select-bordered w-full"
              value={urgencyLevel}
            
            >
              <option value="low">Low - Can wait a few days</option>
              <option value="medium">Medium - Need help soon</option>
              <option value="high">High - Urgent assistance needed</option>
            </select>
          </div>

          <div className="form-control mb-4">
            <label className="label" htmlFor="location">
              <span className="label-text">Location (Optional)</span>
            </label>
            <input
              id="location"
              type="text"
              placeholder="Where should the helper meet you?"
              className="input input-bordered w-full"
              value={location}
              
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="btn btn-outline"
              
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Post Request
            </button>
          </div>
        </form>
      </div>
    </div>
 </div>
  );
};

export default CommunityCreate;