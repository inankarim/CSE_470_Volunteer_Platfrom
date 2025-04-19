import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Signin from '../Logs/Signin';
import App from '../../App';
import CreateEvent from '../Assests/CreateEvent';

const router = createBrowserRouter([
    {
        path:"/",
        element: <App></App>,
        errorElement:<Error></Error>

    },
    {
        path:'/signin',
        element:<Signin></Signin>
    },
    {
        path:'/event',
        element:<CreateEvent></CreateEvent>
    }
])

export default router;