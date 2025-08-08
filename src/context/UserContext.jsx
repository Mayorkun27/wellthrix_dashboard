import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  const [dashboardMetrics, setDashboardMetrics] = useState({
    no_properties: 0,
    no_purchases: 0,
    no_users: 0,
    total_balance: "0.00",
    total_bonus: "0.00",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedMetrics = localStorage.getItem("dashboardMetrics");
      // console.log("storedToken", storedToken)
    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(parsedUser);
      setRole(parsedUser?.role || null);
    }

    if (storedMetrics) { // Parse and set stored metrics
      setDashboardMetrics(JSON.parse(storedMetrics));
    }
  }, []);

  const login = (token, user, metrics) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    setRole(user?.role || null);

    if (metrics) {
      localStorage.setItem("dashboardMetrics", JSON.stringify(metrics));
      setDashboardMetrics(metrics);
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
      toast.success("Logged out successfully")
      setTimeout(() => {
        window.location.href = "https://wellthrixinternational.com/#/login";
      }, 500)
      
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  const refreshUser = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("refresh response", response)

      const updatedUser = response.data.data;

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setRole(updatedUser?.role || null);

    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, token, role, setToken, setUser, login, logout, isLoggedIn, refreshUser, dashboardMetrics }}>
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
