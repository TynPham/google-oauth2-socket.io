import * as React from "react";
import { useNavigate } from "react-router-dom";

export interface HomeProps {}

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login/google");
  };

  return (
    <div>
      You have logged in <button onClick={handleLogout}>Log out</button>
    </div>
  );
}
