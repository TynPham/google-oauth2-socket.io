import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import PrivateLayout from "../layouts/privateLayout/PrivateLayout";
import AuthLayout from "../layouts/authLayout/AuthLayout";
import Socket from "../pages/socket/Socket";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateLayout>
        <Home />
      </PrivateLayout>
    ),
  },
  {
    path: "/login/google",
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: "/socket",
    element: (
      <PrivateLayout>
        <Socket />
      </PrivateLayout>
    ),
  },
]);

export default router;
