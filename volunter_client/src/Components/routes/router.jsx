import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../../App';
import CreateEvent from '../Assests/CreateEvent';
import Team from '../Team/Team';

const router = createBrowserRouter([
    {
        path:"/",
        element: <App></App>,
        errorElement:<Error></Error>

    },
    {
        path:'/team',
        element:<Team></Team>
    },
    {
        path:'/event',
        element:<CreateEvent></CreateEvent>
    }
])

export default router;