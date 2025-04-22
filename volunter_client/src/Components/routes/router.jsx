import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Signin from '../Logs/Signin';
import App from '../../App';
import CreateEvent from '../Assests/CreateEvent';
import SignUp from '../Logs/SignUp';
import Team from '../Team/Team';

const router = createBrowserRouter([
    {
        path:"/",
        element: <App></App>,
        loader: () => fetch("http://localhost:3000/event")

    },
    {
        path:'/signin',
        element:<Signin></Signin>
    },
    {
        path:'/event',
        element:<CreateEvent></CreateEvent>
    },
    {
        path:'/signup',
        element: <SignUp></SignUp>
    },
    {
        path:'/team_crt',
        element:<Team></Team>
    }
])

export default router;