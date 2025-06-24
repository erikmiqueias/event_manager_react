import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Home from "./pages/Home.tsx";
import NotFound from "./pages/NotFound.tsx";
import MyEvents from "./pages/MyEvents.tsx";
import ParticipatedEvents from "./pages/ParticipatedEvents.tsx";
import CreateEvent from "./pages/CreateEvent.tsx";
import About from "./pages/About.tsx";
import Profile from "./pages/Profile.tsx";
import MainComponent from "./components/MainComponent.tsx";
import PrivateRoute from "./routes/PrivateRoute.tsx";
import PublicRoute from "./routes/PublicRoute.tsx";
import EventDetails from "./pages/EventDetails.tsx";
import EventRegistration from "./pages/EventRegistration.tsx";
import RegisterUser from "./pages/RegisterUser.tsx";
import EditEvent from "./pages/EditEvent.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainComponent />,
    errorElement: <NotFound />,
    children: [
      {
        path: "login",
        element: <PublicRoute element={<Login />} />,
      },
      {
        index: true,
        element: <PrivateRoute element={<Home />} />,
      },
      {
        path: "my-events",
        element: <PrivateRoute element={<MyEvents />} />,
      },
      {
        path: "participated-events",
        element: <PrivateRoute element={<ParticipatedEvents />} />,
      },
      {
        path: "create-event",
        element: <PrivateRoute element={<CreateEvent />} />,
      },
      {
        path: "about",
        element: <PrivateRoute element={<About />} />,
      },
      {
        path: "profile",
        element: <PrivateRoute element={<Profile />} />,
      },
      {
        path: "home",
        element: <PrivateRoute element={<Home />} />,
      },
      {
        path: "event/:eventId",
        element: <PrivateRoute element={<EventDetails />} />,
      },
      {
        path: "event/:eventId/register",
        element: <PrivateRoute element={<EventRegistration />} />,
      },
      {
        path: "register",
        element: <PublicRoute element={<RegisterUser />} />,
      },
      {
        path: "event/:eventId/edit",
        element: <PrivateRoute element={<EditEvent />} />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>
);
