import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const isAuth: boolean = Boolean(localStorage.getItem("access_token"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/login/google");
    }
  }, [isAuth]);
  return <>{children}</>;
}
