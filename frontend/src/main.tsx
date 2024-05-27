import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Home from "./routes/Home";
import { Login } from "./routes/Login";
import { Admin } from "./routes/Admin";
import { Dashboard } from "./routes/Dashboard";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/admin", element: <Admin /> },
  { path: "/login", element: <Login /> },
  { path: "/dashboard", element: <Dashboard /> },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen w-screen flex-col">
        <RouterProvider router={router} />
        {/* <footer className="bg-primary-light p-2 text-white">
          <p>Author: Straw</p>
          <p>
            <a href="mailto:mail@example.com">mail@example.com</a>
          </p>
        </footer> */}
      </div>
    </QueryClientProvider>
  </StrictMode>,
);
