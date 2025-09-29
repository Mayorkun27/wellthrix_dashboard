// src/hooks/useUsersData.js
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllUsers } from "../services/userService";
import { handleAuthError } from "../utilities/handleAuthError";

export const useUsersData = ({ token, logout, initialPage = 1, initialPerPage = 5 }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAllUsers(token, currentPage, perPage);
      if (res.status === 200 && res.data.success) {
        const { data, current_page, last_page, per_page } = res.data.data;
        console.log("data", data)
        setUsers(data);
        setCurrentPage(current_page);
        setLastPage(last_page);
        setPerPage(per_page);
      } else {
        throw new Error(res.data.message || "Failed to fetch users.");
      }
    } catch (err) {
      handleAuthError(err, logout);
      console.error("Fetch users error:", err);
      toast.error(err?.response?.data?.message || "An error occurred fetching users.");
    } finally {
      setIsLoading(false);
    }
  }, [token, logout, currentPage, perPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    refetch: fetchUsers,
  };
};
