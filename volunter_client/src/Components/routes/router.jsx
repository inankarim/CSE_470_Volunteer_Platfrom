import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Signin from '../Logs/Signin';
import App from '../../App';
import CreateEvent from '../Assests/CreateEvent';
import SignUp from '../Logs/SignUp';
import Team from '../Team/Team';
import Users from '../Users/Users';

import Settings from '../Users/Settings';
import AuthLayout from '../Layout/AuthLayout';
import PrivateRoute from './PrivateRoute';
import TeamDashboard from '../Team/TeamDashboard';
import CommunityCreate from '../CommunityHelp/CommunityCreate';
import Event from '../Users/Event';

const router = createBrowserRouter([
    {
        path:"/",
        element: <App></App>,
        loader: () => fetch("http://localhost:3000/event")

    },
    // {
    //     path:'/signin',
    //     element:<Signin></Signin>
    // },
    {
        path:'/event',
        element:(
            <PrivateRoute>
                 <CreateEvent></CreateEvent>
            </PrivateRoute>
                
        ),
    },
    // {
    //     path:'/signup',
    //     element: <SignUp></SignUp>
    // },
    {
        path:'/team_crt',
        element:(
            <PrivateRoute>
                 <Team></Team> 
            </PrivateRoute>
                
        ),
        loader: ()=>fetch("http://localhost:3000/users")
    },
    {
        path:'/teamdash',
        element:(
            <PrivateRoute>
                <TeamDashboard></TeamDashboard>
            </PrivateRoute>
        )
    },
    {
        path:'/users',
        element:<Users></Users>,
        
    },
    {
        path:'/user_update',
        element: <Settings></Settings>
          
        
    },
    {
        path: '/event/:id',
        element: <Event></Event>,
        loader: async ({ params }) => {
          const res = await fetch(`http://localhost:3000/event/${params.id}`);
          if (!res.ok) {
            throw new Response("Event Not Found", { status: 404 });
          }
          return res.json();
        }
    },
      
    {
        path:"auth",
        element:<AuthLayout></AuthLayout>,
        children:[
            {
                path:"/auth/signin",
                element:<Signin></Signin>
            },
            {
                path:"/auth/signup",
                element:<SignUp></SignUp>
            }
        ]

    },
    {
        path:'/comm',
        element:(<PrivateRoute>
            <CommunityCreate></CommunityCreate>
        </PrivateRoute>),
        loader:()=>fetch("http://localhost:3000/request")
    },
    {
        path: "/*",
        element: <h2>Error404</h2>,
      },
])

export default router;