import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../routes/AuthProviders';

const Navbar = () => {
    const {user, logOut} = useContext(AuthContext)
    const handleLogout = () =>{
        console.log("user trying to logout");
        logOut()
        .then(() =>{
            alert("You Logged Out Successfullu=y")
        })
        .catch((error) =>{
            console.log(error)
        });
    }
    const items = <>
                    <li className='ml-2'><Link to='/'>Home</Link> </li>
                    {!user && (<li className='ml-2'><Link to='/auth/signup'>Register</Link></li>)}        
                    {/* <li className='ml-2'><Link>Volunteer</Link> </li> */}
                    <li className='ml-2'><Link to='/event'>Volunteer Events</Link> </li>
                    <li className='ml-2'><Link to='/team_crt'> Team</Link> </li>


    </>
    return (
        <div>
            <div className="navbar bg-base-100">
                    <div className="navbar-start">
                        <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {items}
                        </ul>
                        </div>
                        <a className="btn btn-ghost normal-case text-xl">Home of Volunteer</a>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">
                        {items}
                        </ul>
                    </div>
                    <div className="navbar-end flex gap-4 items-center">
                            {user ? (
                                <>
                                <NavLink to="/users">
                                    <button className="btn">Profile</button>
                                </NavLink>
                                <button onClick={handleLogout} className="btn btn-error">
                                    Logout
                                </button>
                                </>
                            ) : (
                                <NavLink to="/auth/signin">
                                <button className="btn btn-primary">SignIn</button>
                                </NavLink>
                            )}
                            </div>
                </div>
            
        </div>
    );
};

export default Navbar;