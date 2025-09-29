import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { decryptToken } from "../../helpers/tokenHelper";
import assets from "../../assets/assests";
import { motion, AnimatePresence } from 'framer-motion';

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
        window.location.href = "https://wellthrixinternational.com/#/login";
        return;
      }

      const token = decryptToken(decodeURIComponent(encryptedToken));
      if (!token) {
        window.location.href = "https://wellthrixinternational.com/#/login";
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
        window.location.href = "https://wellthrixinternational.com/#/login";
      }
    };

    verifyAndRedirect();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-pryClr via-pryClr/70 to-accClr/80 p-6">
      <motion.div
        className="bg-pryClr bg-opacity-80 backdrop-blur-lg rounded-2xl p-8 md:p-12 max-w-md w-full text-center shadow-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="">
          <img src={assets.logo} alt="Wellthrix international logo" className="w-2/6 mx-auto" />
        </div>
        <motion.h1
          className="text-2xl md:text-4xl font-bold text-white my-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Redirecting You...
        </motion.h1>
        <div className="flex justify-center mb-6">
          <svg
            className="animate-spin h-12 w-12 text-accClr"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
            />
          </svg>
        </div>
       
      </motion.div>
    </div>
  );
};

export default AuthRedirect;