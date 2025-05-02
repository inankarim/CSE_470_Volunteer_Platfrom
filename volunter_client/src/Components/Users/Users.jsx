import React, { useContext } from 'react';
import { AuthContext } from '../routes/AuthProviders';

const Users = () => {
  const { dbUser } = useContext(AuthContext);

  if (!dbUser) {
    return <p>Loading user info...</p>;
  }

  return (
    <div>
      <h1>Hello, {dbUser.fname} {dbUser.lname} 👋</h1>
      <p><strong>Username:</strong> {dbUser.uname}</p>
      <p><strong>Email:</strong> {dbUser.email}</p>
      <p><strong>Skills:</strong> {dbUser.skills}</p>
      <p><strong>Joined:</strong> {dbUser.creationTime}</p>
      
    </div>
  );
};

export default Users;
