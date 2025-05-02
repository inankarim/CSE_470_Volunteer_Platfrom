// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFtyueem6vtxmM_NTbJ8GCL_oivcCJRJQ",
  authDomain: "homevolunteer-259f2.firebaseapp.com",
  projectId: "homevolunteer-259f2",
  storageBucket: "homevolunteer-259f2.firebasestorage.app",
  messagingSenderId: "455355285832",
  appId: "1:455355285832:web:c8131d040218a846ee337d",
  measurementId: "G-0EMHTG2YX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
export  const auth = getAuth(app);
