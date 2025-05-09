import React, { useContext, useState, useEffect } from 'react';
import Swal from "sweetalert2";
import { AuthContext } from '../routes/AuthProviders';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { user:authUser, updateAuthuser,updateDbUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [userData, setUserData] = useState({
    uid: '',
    fname: '',
    lname: '',
    uname: '',
    email: '',
    skills: '',
    teams: [],
    imageUrl: ''
  });

  // Fetch complete user data only after authUser is available
  useEffect(() => {
    if (!authUser?.uid) return;

    const fetchUserData = async () => {
      setFetching(true);
      try {
        const response = await fetch(`http://localhost:3000/users/${authUser.uid}`);
        if (!response.ok) throw new Error('Failed to fetch user data');

        const { data } = await response.json();
        setUserData({
          uid: data.uid,
          fname: data.fname || '',
          lname: data.lname || '',
          uname: data.uname || '',
          email: data.email || '',
          skills: data.skills || '',
          teams: data.teams || [],
          imageUrl: data.imageUrl || ''
        });
      } catch (error) {
        console.error("Fetch error:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to load user data",
          icon: "error"
        });
      } finally {
        setFetching(false);
      }
    };

    fetchUserData();
  }, [authUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get values directly from the form
    const newUsername = e.target.uname.value;
    const newSkills = e.target.skills.value;
    
    console.log("Submitting update with username:", newUsername);
    
    const updatedData = {
      uname: newUsername,
      skills: newSkills
    };

    try {
      // First, update the database
      const response = await fetch(
        `http://localhost:3000/users/${authUser.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedData)
        }
      );

      const result = await response.json();
      console.log("Update API response:", result);
      
      if (!result.success) throw new Error(result.error || 'Update failed');

      // Second, fetch the updated user data
      const userResponse = await fetch(`http://localhost:3000/users/${authUser.uid}`);
      const userData = await userResponse.json();
      console.log("Fetched updated user data:", userData);

      if (userData.success && userData.data) {
        // Third, properly update the local state with the structure it expects
        setUserData({
          uid: userData.data.uid,
          fname: userData.data.fname || '',
          lname: userData.data.lname || '',
          uname: userData.data.uname || '',  // This should now have the new username
          email: userData.data.email || '',
          skills: userData.data.skills || '',
          teams: userData.data.teams || [],
          imageUrl: userData.data.imageUrl || ''
        });
        
        // Fourth, update the Firebase auth user profile
        // This is crucial for updating the display name seen in other components
        await updateAuthuser({
          displayName: newUsername,  // Use direct form value to be sure
          photoURL: userData.data.imageUrl || authUser.photoURL
        });
        
        updateDbUser(userData.data);
        console.log("Auth + DB user updated successfully");
      }

      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully",
        icon: "success"
      });
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to update profile",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`http://localhost:3000/users/upload-image/${authUser.uid}`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error('Image upload failed');

      const result = await response.json();
      if (result.imageUrl) {
        setUserData(prev => ({ ...prev, imageUrl: result.imageUrl }));
        setPreviewImage(null);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to upload image",
        icon: "error"
      });
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="text-white">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center text-white min-h-screen bg-base-200">
      <div className="w-full max-w-full p-8 space-y-4 bg-black rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Profile Settings</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="flex flex-col items-center">
            <div className="avatar mb-4">
              <div className="w-28 h-28 rounded-full ring ring-purple-600 ring-offset-base-100 ring-offset-2">
                <img 
                  src={previewImage || userData.imageUrl || "https://via.placeholder.com/150"} 
                  alt="Profile" 
                  className="rounded-full" 
                />
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="file-input file-input-bordered file-input-sm w-full max-w-xs" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered w-full" 
                value={userData.fname}
                readOnly
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered w-full" 
                value={userData.lname}
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input 
              type="email" 
              className="input input-bordered w-full" 
              value={userData.email}
              readOnly
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">User Name</span>
            </label>
            <input 
              type="text" 
              placeholder="User Name" 
              className="input input-bordered w-full" 
              name="uname" 
              defaultValue={userData.uname} 
              required 
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Skills</span>
            </label>
            <textarea 
              placeholder="Your skills" 
              className="textarea textarea-bordered w-full" 
              name="skills" 
              defaultValue={userData.skills}
            />
          </div>

          <div className='flex flex-row justify-between '>
            <button 
              type="submit" 
              className="btn w-6/12 bg-purple-600 hover:bg-purple-700 text-white"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
            <Link to="/users" className='btn bg-white text-black'>Back</Link>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Settings;