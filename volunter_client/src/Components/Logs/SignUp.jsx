import React, { useContext } from 'react';
import Swal from "sweetalert2";
import { AuthContext } from '../routes/AuthProviders';

const Signup = () => {
  const {createUser} = useContext(AuthContext)
  const handleSignup = e => {
    e.preventDefault();
    const form = e.target;
    const fname = form.fname.value;
    const lname = form.lname.value;
    const uname = form.uname.value;
    const email = form.email.value;
    const password = form.password.value.trim();
    const skills = form.skills.value;
    // const education = form.education.value;
    // const blood_grp = form.blood_grp.value;

  
 
    createUser(email,password)
    .then(result =>{
      const creationTime = result.user?.metadata?.creationTime;
      const uid = result.user.uid;
      console.log(result.user);
      const newUser = {
        uid,
        fname,
        lname,
        uname,
        email,
        skills,
        creationTime,
      };
      
      fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.insertedId) {
            Swal.fire({
              title: "Success",
              text: "User registered successfully",
              icon: "success"
            });
            form.reset(); // Optional: reset form after success
          }
        })
    })
    .catch(err => {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error"
      });
    });
    
    
        
      
  };

  return (
    <div className="flex items-center justify-center text-white min-h-screen bg-base-200">
      <div className="w-full max-w-md p-8 space-y-4 bg-black rounded-lg shadow-md">
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input type="text" placeholder="First Name" className="input input-bordered w-full" name="fname" required />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input type="text" placeholder="Last Name" className="input input-bordered w-full" name="lname" required />
          </div>
          <div>
            <label className="label">
              <span className="label-text">User Name</span>
            </label>
            <input type="text" placeholder="User Name" className="input input-bordered w-full" name="uname" required />
          </div>
          <div>
            <label className="label">
              <span className="label-text">E-Mail</span>
            </label>
            <input type="email" placeholder="E-Mail" className="input input-bordered w-full" name="email" required />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input type="password" placeholder="Password" className="input input-bordered w-full" name="password" required />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Skills</span>
            </label>
            <textarea placeholder="Skills" className="textarea textarea-bordered w-full" name="skills" />
          </div>
          {/* <div>
            <label className="label">
              <span className="label-text">Educational Status</span>
            </label>
            <select className="select select-bordered w-full" name="education" required defaultValue="">
              <option disabled value="">Select your education level</option>
              <option>High School</option>
              <option>Diploma</option>
              <option>Bachelor's</option>
              <option>Master's</option>
              <option>PhD</option>
            </select>
          </div>
          <div>
            <label className="label">
              <span className="label-text">Blood Group</span>
            </label>
            <select className="select select-bordered w-full" name="blood_grp" required defaultValue="">
              <option disabled value="">Select your blood group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </div> */}
          <div>
            <button type="submit" className="btn w-full bg-purple-600 hover:bg-purple-700 text-white">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
