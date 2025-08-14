import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  const [miscellanousDetails, setMiscellanousDetails] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedMiscellanousDetails = localStorage.getItem("miscellanousDetails");
      // console.log("storedToken", storedToken)
    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setToken(storedToken);
      setUser(parsedUser);
      setRole(parsedUser?.role || null);
    }

    if (storedMiscellanousDetails) {
      setMiscellanousDetails(JSON.parse(storedMiscellanousDetails));
    }
  }, []);

  const login = async (authToken) => {
    localStorage.setItem("token", authToken);
    setToken(authToken);

    await refreshUser(authToken);
  };

  const refreshUser = async (authToken = token) => {
    if (!authToken) {
      console.log("No token found")
      return;
    };

    try {
      const response = await axios.get(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      console.log("response", response)

      const updatedUser = response.data.data.user;
      const updatedPlanDetails = response.data.data.plan_details || null;
      const updatedStockistDetails = response.data.data.stockist_details || null;

      const miscDetails = [
        { planDetails: updatedPlanDetails },
        { stockistDetails: updatedStockistDetails },
      ];

      // Update state
      setUser(updatedUser);
      setRole(updatedUser?.role || null);
      setMiscellanousDetails(miscDetails);

      // Persist
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("miscellanousDetails", JSON.stringify(miscDetails));

    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  const isLoggedIn = !!token;

  const logout = async () => {
    console.log("logging out")
    try {
      const response = await axios.put(`${API_URL}/api/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("logout response", response)

      localStorage.removeItem("token");
      setToken(null);
      localStorage.removeItem("user");
      setUser(null);
      localStorage.removeItem("miscellanousDetails");
      setMiscellanousDetails([]);
      toast.success("Logged out successfully")
      setTimeout(() => {
        // window.location.href = "/#/login";
        window.location.href = "https://wellthrixinternational.com/#/login";
      }, 500)
      
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };


  return (
    <UserContext.Provider value={{ user, token, role, setToken, setUser, login, logout, isLoggedIn, refreshUser, miscellanousDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within an UserProvider");
  }
  return context;
};
