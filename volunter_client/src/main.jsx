import React from 'react'; 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import router from './Components/routes/router.jsx';
import AuthProviders from './Components/routes/AuthProviders.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProviders>
   <RouterProvider router={router}/>
   </AuthProviders>
  </StrictMode>,
)
