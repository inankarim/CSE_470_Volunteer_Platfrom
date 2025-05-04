import React, { useContext, useState } from 'react';
import Navbar from '../Layout/Navbar';
import { AuthContext } from '../routes/AuthProviders';
import { auth } from '../../firebase/firebase.init';
import Swal from "sweetalert2";
import { useLoaderData } from 'react-router-dom';
import CommunityCard from './CommunityCard';

const CommunityCreate = () => {
  const { dbUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const loadedrequests = useLoaderData();
  const [requests, setrequests] = useState(loadedrequests);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return alert('You must be logged in');

    const formData = new FormData(e.target);
    const newReq = {
      title: formData.get('title'),
      description: formData.get('description'),
      urgencyLevel: formData.get('urgencyLevel'),
      location: formData.get('location'),
    };

    setLoading(true);

    fetch("http://localhost:3000/request", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...newReq, userId: dbUser.uid, userName: dbUser.uname || 'Anonymous' }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.insertedId) {
          Swal.fire({
            title: "Success",
            text: "Event Added Successfully",
            icon: "success"
          });

          const newRequestCard = {
            _id: data.insertedId,
            ...newReq,
            userName: dbUser.uname || 'Anonymous'
          };
          setrequests(prev => [newRequestCard, ...prev]);

          e.target.reset();
        }
      })
      .catch(err => {
        console.error(err);
        Swal.fire("Error", "Failed to add request", "error");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <Navbar />
      <div className="card bg-base-100 shadow-md w-full max-w-lg mx-auto my-4">
        <div className="card-body">
          <h2 className="card-title text-lg font-semibold">Create a Help Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              id="title"
              type="text"
              placeholder="What do you need help with?"
              className="input input-bordered w-full"
              name="title"
              required
            />

            <textarea
              id="description"
              placeholder="Provide details about your request..."
              className="textarea textarea-bordered w-full min-h-[80px]"
              name="description"
              required
            />

            <div className="flex items-center space-x-2">
              <select
                id="urgency"
                className="select select-bordered flex-1"
                name="urgencyLevel"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <input
                id="location"
                type="text"
                placeholder="Location (optional)"
                className="input input-bordered flex-1"
                name="location"
              />
            </div>

            <div className="card-actions justify-end">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => e.target.reset()}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                {loading ? 'Posting...' : 'Post Request'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {loading && (
        <p className="text-center text-sm text-gray-500 my-2">Posting your request...</p>
      )}

      <div className="grid gap-4 px-4 py-2">
        {requests.map(req => (
          <CommunityCard key={req._id} req={req} setrequests={setrequests} />
        ))}
      </div>
    </div>
  );
};

export default CommunityCreate;
