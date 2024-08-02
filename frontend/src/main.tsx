import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Home from "./routes/Home";
import { Login } from "./routes/Login";
import { Admin } from "./routes/Admin";
import { Dashboard } from "./routes/Dashboard";
import { MainLayout } from "./layouts/Main";
import UserManagement from "./routes/UserManagement";

const generateRoute = (element: React.ReactNode) => {
  return (
    <MainLayout>
      {element}
    </MainLayout>
  )
}

const router = createBrowserRouter([
  { path: "/", element: generateRoute(<Home />) },
  { path: "/admin", element: generateRoute(<Admin />) },
  { path: "/login", element: generateRoute(<Login />) },
  { path: "/dashboard", element: generateRoute(<Dashboard />) },
  { path:'/usermanagement', element: generateRoute(<UserManagement />)}
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
        <div className="flex h-screen w-screen flex-col">
          <RouterProvider router={router} />
        </div>
      </QueryClientProvider>
  </StrictMode>,
);
