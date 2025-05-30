import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { RouterProvider } from "react-router-dom";

//Routing configuration
const HomePage = lazy(() => import("./components/HomePage.jsx"));
const PageNotFound = lazy(() => import("./components/PageNotFound.jsx"));
const SignIn = lazy(() => import("./components/SignIn.jsx"));
const VideoPlayer = lazy(() => import("./components/VideoPlayer.jsx"));
const ChannelPage = lazy(() => import("./components/ChannelPage.jsx"));

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "/signin",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SignIn />
          </Suspense>
        ),
      },
      {
        path: "/video/:videoId",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <VideoPlayer />
          </Suspense>
        ),
      },
      {
        path: "/channel/:handle",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ChannelPage />
          </Suspense>
        ),
      },
    ],
    errorElement: (
      <Suspense fallback={<div>Loading...</div>}>
        <PageNotFound />
      </Suspense>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={appRouter} />
  </StrictMode>
);
