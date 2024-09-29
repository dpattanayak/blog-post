import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthGuard, FallBackPage } from "./components";
import "./index.css";
import { AddPost, EditPost, Home, Login, Post, Profile, Signup } from "./pages";
import store from "./store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthGuard authentication={false}>
            <Login />
          </AuthGuard>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthGuard authentication={false}>
            <Signup />
          </AuthGuard>
        ),
      },
      {
        path: "/add-post",
        element: (
          <AuthGuard authentication>
            <AddPost />
          </AuthGuard>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <AuthGuard authentication>
            <EditPost />
          </AuthGuard>
        ),
      },
      {
        path: "/post/:slug",
        element: <Post />,
      },
      {
        path: "/profile",
        element: (
          <AuthGuard authentication>
            <Profile />
          </AuthGuard>
        ),
      },
      {
        path: "*",
        element: (
          <FallBackPage title="404" subtitle="Page Not Found" redirect="home" />
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
