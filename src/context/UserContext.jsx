import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [hasPendingRank, sethasPendingRank] = useState(null);
  const [miscellaneousDetails, setMiscellaneousDetails] = useState(null);

  // Use a single useEffect to load all persisted data
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRankStatus = localStorage.getItem("rank-status");
    const storedMiscellaneousDetails = localStorage.getItem("miscellaneousDetails");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    if (storedRankStatus) {
      sethasPendingRank(storedRankStatus)
    }
    if (storedMiscellaneousDetails) {
      setMiscellaneousDetails(JSON.parse(storedMiscellaneousDetails));
    }
  }, []);

  const login = async (authToken) => {
    localStorage.setItem("token", authToken);
    setToken(authToken);
    await refreshUser(authToken);
    await checkPendingRanks(authToken);
  };

  const refreshUser = async (authToken = token) => {
    if (!authToken) {
      console.log("No token found");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = response.data.data;
      const updatedUser = data.user;

      // console.log("refresh response data", data)

      const updatedMiscellaneousDetails = {
        planDetails: data.plan_details,
        stockistDetails: data.stockist_details,
        totalPVLeft: data.total_pv_left,
        totalPVRight: data.total_pv_right,
      };

      // Update state
      setUser(updatedUser);
      setMiscellaneousDetails(updatedMiscellaneousDetails);

      // Persist to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("miscellaneousDetails", JSON.stringify(updatedMiscellaneousDetails));
    } catch (err) {
      console.error("Failed to refresh user:", err);
      // Optional: If refresh fails, consider logging out automatically
      // logout();
    }
  };

  const isLoggedIn = !!token;
  const role = user?.role || null;

  const logout = async () => {
    const toastId = toast.loading("Logging Out...");
    try {
      await axios.put(`${API_URL}/api/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Logged out successfully", { id: toastId });
    } catch (err) {
      console.error("API Logout failed, clearing local state anyway:", err);
      toast.error("Logout failed. Please try again.", { id: toastId });
    } finally {
      // // Always clear local state and storage, regardless of API response
      // localStorage.removeItem("token");
      // localStorage.removeItem("user");
      // localStorage.removeItem("miscellaneousDetails");
      // setToken(null);
      // setUser(null);
      // setMiscellaneousDetails(null);

      // // Redirect after a short delay
      // setTimeout(() => {
      //   window.location.href = "https://wellthrixinternational.com/#/login";
      // }, 100);
    }
  };

  const checkPendingRanks = async (authToken = token) => {
    try {
      const response = await axios.get(`${API_URL}/api/rank/pending`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const status = response.data.has_pending
      localStorage.setItem("rank-status", status);
      sethasPendingRank(status)
    } catch (err) {
      console.error("Failed to fetch user rank:", err);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, token, role, miscellaneousDetails, login, logout, isLoggedIn, refreshUser, setUser, setToken, checkPendingRanks, hasPendingRank }}
    >
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