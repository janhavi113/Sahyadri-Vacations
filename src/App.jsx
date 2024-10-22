import Home from "./components/Home";
import Login from "./components/Login";
import About from "./components/AboutUs/About";
import CustomisedTour from "./components/CustomiseTour/CustomisedTour";
import AdminLogin from "./components/AdminLogin";
import Dashboard from "./components/AdminDashboard/AdminDashboard";
import AllEvents from  "./components/AllEvents";     
import ScheduledEvents from "./components/Scheduled_Events/ScheduledEvents";
import ScheduledEventsDetails from "./components/Scheduled_Events/ScheduledEventsDetails";
import ScheduleEvents from "./components/ScheduleEvents";
import EventDetails from "./components/EventDetails";
import ShowEventDetails from "./components/ShowEventDetails/ShowEventDetails";
import CreateEvent from "./components/admin-panel/CreateEvent/CreateEvents" ;  
import Events from "./components/ShowAllEvents/Events" ;
import SearchEvent from "./components/SearchEvent/SearchEvent" ;
import UserAgreement from "./components/UserAgreement/UserAgreement";
import CancellationPolicy from "./components/UserAgreement/CancellationPolicy";
import PrivacyPolicy from "./components/UserAgreement/PrivacyPolicy";
import Gallery from "./components/Gallery/PhotoGallery" ;
import ContactUs from "./components/Contact_Us/ContactUs" ;
import Register from './components/Register/Register';
import DirectBookingDashboard from "./components/DirectBookings/DirectBookingDashboard" ;
import DirectBookings from "./components/DirectBookings/DirectBookings" ;
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
      path: "/search-event",
      element: <SearchEvent />,
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
      path: "/events",
      element: <Events />,
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
      path: "/scheduled-events",
      element: <ScheduledEvents />,
    },
    {
      path: "/scheduled-event-details",
      element: <ScheduledEventsDetails />,
    },
    {
      path: "/schedule-event",
      element: <ScheduleEvents />,
    },
    {
      path: "/create-event",
      element: <CreateEvent />,
    },
    {
      path: "/event-details",
      element: <ShowEventDetails />,
    },
    {
      path: "/user-agreement",
      element: <UserAgreement />,
    },{
      path: "/cancellation-policy",
      element: <CancellationPolicy />,
    },{
      path: "/privacy-policy",
      element: <PrivacyPolicy />,
    },
    {
      path: "/create-event/event-details/:eventId",
      element: <EventDetails />,
    },
    {
      path: "/contact-us",
      element: <ContactUs />,
    },
    {
      path: "/customised-tour",
      element: <CustomisedTour />,
    },
    {
      path: "/gallery",
      element: <Gallery />,
    },
    {
      path: "/register",
      element: <Register />,
    }    ,
    {
      path: "/direct-bookings",
      element: <DirectBookings />,
    }
    ,
    {
      path: "/direct-bookings-dashboard",
      element: <DirectBookingDashboard />,
    }
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
