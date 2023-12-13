import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const isAuth: boolean = Boolean(localStorage.getItem("access_token"));
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth]);
  return <>{children}</>;
}
