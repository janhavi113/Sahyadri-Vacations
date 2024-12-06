import Home from "./components/Home";
import Login from "./components/Login";
import About from "./components/User-Panel/AboutUs/About";
import CustomisedTour from "./components/User-Panel/CustomiseTour/CustomisedTour";
import AdminLogin from "./components/admin-panel/Admin-Login/AdminLogin";
import Dashboard from "./components/admin-panel/AdminDashboard/AdminDashboard";
import AllEvents from  "./components/admin-panel/All-Events/AllEvents";     
import ScheduledEvents from "./components/admin-panel/Scheduled_Events/ScheduledEvents";
import ScheduledEventsDetails from "./components/admin-panel/Scheduled_Events/ScheduledEventsDetails";
import ScheduleEvents from "./components/admin-panel/Schedule-Events/ScheduleEvents";
import UpdateScheduleEvents from "./components/admin-panel/Schedule-Events/UpdateScheduleEvents";
import CouponCode from "./components/admin-panel/CouponCode/CouponForm";
import EventDetails from "./components/EventDetails";
import ShowEventDetails from "./components/User-Panel/ShowEventDetails/ShowEventDetails";
import CreateEvent from "./components/admin-panel/CreateEvent/CreateEvents" ;  
import Events from "./components/User-Panel/ShowAllEvents/Events" ;
import CampingEvent from "./components/User-Panel/ShowAllEvents/Camping_Event"
import TrekingEvents from "./components/User-Panel/ShowAllEvents/Treking_Events"
import BackPackingEvent from "./components/User-Panel/ShowAllEvents/BackPacking_Event"
import SearchEvent from "./components/User-Panel/SearchEvent/SearchEvent" ;
import UserAgreement from "./components/User-Panel/UserAgreement/UserAgreement";
import CancellationPolicy from "./components/User-Panel/UserAgreement/CancellationPolicy";
import PrivacyPolicy from "./components/User-Panel/UserAgreement/PrivacyPolicy";
import Gallery from "./components/User-Panel/Gallery/PhotoGallery" ;
import ContactUs from "./components/User-Panel/Contact_Us/ContactUs" ;
import Register from './components/Register/Register';
import DirectBookingDashboard from "./components/admin-panel/DirectBookings/DirectBookingDashboard" ;
import DirectBookings from "./components/admin-panel/DirectBookings/ConfirmDirectBooking" ;
import AddSpecialOfferEvents from "./components/admin-panel/SpecialOfferEvents/AddSpecialOfferEvents" ;
import DirectBookingConfirmationPannel from "./components/admin-panel/DirectBookings/DirectBookingConfirmationPannel" ;
import Confirmation from "./components/User-Panel/Confirmation/Confirmation";
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
      path: "/add-special-offer-events",
      element: <AddSpecialOfferEvents />,
    },
     {
      path: "/events",
      element: <Events />,
    },
     {
      path: "/camping-events",
      element: <CampingEvent/> },
     {
      path: "/treking-events",
      element: <TrekingEvents/> },
     {
      path: "/backpacking-events",
      element: <BackPackingEvent/> },
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
      path: "/update-schedule-events",
      element: <UpdateScheduleEvents />,
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
      path: "/CouponCode",
      element: <CouponCode />,
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
    ,
    {
      path: "/direct-booking-confirmation",
      element: <DirectBookingConfirmationPannel />,
    },
    {
      path: "/confirmation", // New confirmation route
      element: <Confirmation />,
    }
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
