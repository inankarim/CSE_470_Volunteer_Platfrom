import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../../App';
import CreateEvent from '../Assests/CreateEvent';

const router = createBrowserRouter([
    {
        path:"/",
        element: <App></App>,
        errorElement:<Error></Error>

    },
   
    {
        path:'/event',
        element:<CreateEvent></CreateEvent>
    }
])

export default router;