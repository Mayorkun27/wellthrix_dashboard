import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { decryptToken } from "../../helpers/tokenHelper";
import assets from "../../assets/assests";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const AuthRedirect = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(useLocation().search);
  const { setToken, setUser } = useUser();

  const [loadingMessage, setLoadingMessage] = useState("Verifying token...");

  useEffect(() => {
    const encryptedToken = urlParams.get("token");

    const verifyAndRedirect = async () => {
      if (!encryptedToken) {
        // window.location.href = "http://localhost:5174/#/login";
        return;
      }

      const token = decryptToken(decodeURIComponent(encryptedToken));
      if (!token) {
        // window.location.href = "http://localhost:5174/#/login";
        return;
      }

      try {
        // Save token early
        localStorage.setItem("token", token);

        // Get user
        const res = await axios.get(`${API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("res on auth", res)
        console.log("token on auth", token)

        const user = res.data.data.user;

        // Save to localStorage & context
        localStorage.setItem("user", JSON.stringify(user));
        setToken(token);
        setUser(user);

        // Redirect
        // setLoadingMessage("Login successful, redirecting...");
        setTimeout(() => {
          navigate(user?.role === "admin" ? "/admin/overview" : "/user/overview");
        }, 1000);
      } catch (error) {
        console.error("Verification failed", error);
        // window.location.href = "http://localhost:5174/#/login";
      }
    };

    verifyAndRedirect();
  }, []);

  return (
    <div className="bg-pryClr/20 w-screen h-dvh flex gap-4 justify-center items-center">
      <div className="relative md:w-24 w-20 md:h-24 h-20 flex items-center justify-center p-4">
        <span className="absolute top-0 left-0 w-full h-full border-[10px] border-pryClr border-t-transparent animate-spin rounded-full" />
        <img src={assets.logo} alt="Wellthrix logo" />
      </div>
      <h3 className="text-xl font-bold">Verifying connection...</h3>
    </div>
  );
};

export default AuthRedirect;