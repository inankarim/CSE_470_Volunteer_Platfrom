import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
  } from 'firebase/auth';
  import React, { useEffect, useState, createContext } from 'react';
  import { auth } from '../../firebase/firebase.init';
  
  export const AuthContext = createContext(null);
  export const useAuthContext = () => React.useContext(AuthContext);
  
  const AuthProviders = ({ children }) => {
    const [user, setUser] = useState(null); // Firebase user
    const [dbUser, setDbUser] = useState(null); // MongoDB user
    const [loading, setLoading] = useState(true);
  
    // Create user in Firebase
    const createUser = (email, password) => {
      setLoading(true);
      return createUserWithEmailAndPassword(auth, email, password);
    };
  
    // Sign in user
    const loginuser = (email, password) => {
      setLoading(true);
      return signInWithEmailAndPassword(auth, email, password);
    };
    //Logout
    const logOut = () =>{
        return signOut(auth)
    }
    // ////////////////////////////////In AuthProvider.jsx////////////
    const updateAuthuser = (newData) => {

      setUser(prev => ({ ...prev, ...newData }));
    };
  // ADD THIS: Update MongoDB user (dbUser) state
    const updateDbUser = (newDbUserData) => {
      setDbUser(prev => ({ ...prev, ...newDbUserData }));
    };
////////////////////////////////////////////////

    // Monitor auth state changes
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, currentUser => {
        setUser(currentUser);
        setLoading(false);
  
        if (currentUser?.uid) {
          fetch(`http://localhost:3000/users/uid/${currentUser.uid}`)
            .then(res => res.json())
            .then(data => {
              setDbUser(data); // Store MongoDB user data
            })
            .catch(err => {
              console.error("Failed to load MongoDB user:", err);
              setDbUser(null);
            });
        } else {
          setDbUser(null);
        }
      });
  
      return () => unsubscribe();
    }, []);
  
    const userInfo = {
      user,       // Firebase user
      dbUser,     // MongoDB user
      loading,
      createUser,
      loginuser,
      logOut,
      updateAuthuser,
      updateDbUser
    };
  
    return (
      <AuthContext.Provider value={userInfo}>
        {children}
      </AuthContext.Provider>
    );
  };
  
 
  export default AuthProviders;
  
  