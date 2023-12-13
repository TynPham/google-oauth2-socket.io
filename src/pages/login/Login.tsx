/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { createSearchParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export interface LoginProps {}

const getGoogleAuthUrl = () => {
  const query = {
    redirect_uri: import.meta.env.VITE_REDIRECT_URI,
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(" "),
  };

  const querystring = createSearchParams(query);
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${querystring.toString()}`;
  return url;
};

const googleAuthUrl = getGoogleAuthUrl();

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.get("access_token") && params.get("refresh_token")) {
      localStorage.setItem("access_token", params.get("access_token") as string);
      localStorage.setItem("refresh_token", params.get("refresh_token") as string);
      navigate("/");
    }
  }, [params]);

  return (
    <div>
      {/* <video controls src="http://localhost:3000/media/video/d2033cb78ec941cbacd91f800.mp4"></video> */}
      <button>
        <Link to={googleAuthUrl}>Login</Link>
      </button>
    </div>
  );
}
