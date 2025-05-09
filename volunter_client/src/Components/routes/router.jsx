import { createBrowserRouter } from "react-router-dom";
import Signin from "../Logs/Signin";
import App from "../../App";
import CreateEvent from "../Assests/CreateEvent";
import SignUp from "../Logs/SignUp";
import Team from "../Team/Team";
import Users from "../Users/Users";
import Settings from "../Users/Settings";
import AuthLayout from "../Layout/AuthLayout";
import PrivateRoute from "./PrivateRoute";
import TeamDashboard from "../Team/TeamDashboard";
import CommunityCreate from "../CommunityHelp/CommunityCreate";
import Event from "../Users/Event";
import MyEvent from "../Users/MyEvent";
import TeamDetails from "../Team/TeamDetails"; // Import the TeamDetails component

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: () => fetch("http://localhost:3000/event"),
  },
  {
    path: "/event",
    element: (
      <PrivateRoute>
        <CreateEvent />
      </PrivateRoute>
    ),
  },
  {
    path: "/team_crt",
    element: (
      <PrivateRoute>
        <Team />
      </PrivateRoute>
    ),
    loader: () => fetch("http://localhost:3000/users"),
  },
  {
    path: "/teamdash",
    element: (
      <PrivateRoute>
        <TeamDashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/user_update",
    element: <Settings />,
  },
  {
    path: "/myevent",
    element: <MyEvent />,
  },
  {
    path: "/event/:id",
    element: <Event />,
    loader: async ({ params }) => {
      const res = await fetch(`http://localhost:3000/event/${params.id}`);
      if (!res.ok) {
        throw new Response("Event Not Found", { status: 404 });
      }
      return res.json();
    },
  },
  // New route for Team Details page
//   {
//     path: "/team/:id",
//     element: <TeamDetails />,
//     loader: async ({ params }) => {
//       const res = await fetch(`http://localhost:3000/team/${params.id}`);
//       if (!res.ok) {
//         throw new Response("Team Not Found", { status: 404 });
//       }
//       return res.json();
//     },
//   },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "/auth/signin",
        element: <Signin />,
      },
      {
        path: "/auth/signup",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "/comm",
    element: (
      <PrivateRoute>
        <CommunityCreate />
      </PrivateRoute>
    ),
    loader: () => fetch("http://localhost:3000/request"),
  },
  {
    path: "/*",
    element: <h2>Error404</h2>,
  },
  {
    path: "/team/:id",
    element: <TeamDetails />,
    loader: async ({ params }) => {
      const res = await fetch(`http://localhost:3000/team/${params.id}`);
      if (!res.ok) {
        throw new Response("Team Not Found", { status: 404 });
      }
      return res.json();
    },
  }
  
]);

export default router;
