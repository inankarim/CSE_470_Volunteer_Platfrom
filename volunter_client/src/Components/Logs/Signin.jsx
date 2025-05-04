import React, { useContext } from 'react';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
import { AuthContext } from '../routes/AuthProviders';
import Swal from "sweetalert2";
const Signin = () => {
    const { loginuser }=useContext(AuthContext);
    const handleLogin = e =>{
        e.preventDefault()
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        loginuser(email, password)
        .then((result) => {
        const user = result.user;
        console.log("Firebase user:", user);

        // 🔥 Get UID from Firebase
        const uid = user.uid;

        
        fetch(`http://localhost:3000/users/uid/${uid}`)
          .then((res) => res.json())
          .then((data) => {
            console.log("MongoDB user:", data);
            Swal.fire({
              title: "Login Successful",
              text: `Welcome back, ${data.fname}!`,
              icon: "success",
              timer: 2000,
            });

            // ✅ Redirect
            // navigate(location.state || "/");
          })
          .catch((err) => {
            console.error("Mongo fetch error:", err);
            Swal.fire({
              title: "User not found in database",
              text: "You are authenticated with Firebase but not registered in MongoDB.",
              icon: "warning",
            });
          });
      })
      .catch((error) => {
        console.error("Firebase login error:", error);
        setError(error.code);
        Swal.fire({
          title: "Login Failed",
          text: error.message,
          icon: "error",
        });
      });

    
    }
    return (
        <div>
            <div>
            <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-col">
                <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold">Login now!</h1>
                <p className="py-6">
                    Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                    quasi. In deleniti eaque aut repudiandae et a id nisi.
                </p>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
  <div className="card-body">
    <form onSubmit={handleLogin} className="space-y-4">
      <label className="label">Email</label>
      <input type="email" className="input input-bordered w-full" placeholder="Email" name="email" required />

      <label className="label">Password</label>
      <input type="password" className="input input-bordered w-full" placeholder="Password" name="password" required />

      <div>
        <a className="link link-hover text-sm" href="#">Forgot password?</a>
      </div>

      <button type="submit" className="btn btn-neutral mt-4 w-full">Login</button>
    </form>
  </div>
</div>

            </div>
            </div>
            
            
 



            </div>
            <Footer></Footer>
        
        </div>
    );
};

export default Signin;