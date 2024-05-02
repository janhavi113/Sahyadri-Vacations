import Home from "./components/Home";
import Login from "./components/Login";
import About from "./components/About";
import AdminLogin from "./components/AdminLogin";
import Dashboard from "./components/AdminDashboard";
import AllEvents from  "./components/AllEvents";     
import ScheduledEvents from "./components/ScheduledEvents";
import EventDetails from "./components/EventDetails";
import CreateEvent from "./components/CreateEvents" ;  
import ScheduleEvents from "./components/ScheduleEvents" ;
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  console.log("inapp", import.meta.env.VITE_SOME_KEY);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/admin-login",
      element: <AdminLogin />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/all-events",
      element: <AllEvents />,
    },
    {
      path: "/scheduled-event",
      element: <ScheduledEvents />,
    },
    {
      path: "/create-event",
      element: <CreateEvent />,
    },
    {
      path: "/schedule-event",
      element: <ScheduleEvents />,
    },
    {
      path: "/create-event/event-details/:eventId",
      element: <EventDetails />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
