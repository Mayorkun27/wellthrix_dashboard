import React, { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Inventory = ({ stockistId, refetch }) => {
  const { token, logout, user, refreshUser } = useUser();
  const [availableInventory, setAvailableInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAvailableInventory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/stockists/${stockistId}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("inventory response", response);

      if (response.status === 200) {
        setAvailableInventory(response.data.products);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch inventory."
        );
      }
    } catch (error) {
      if (error.response?.data?.message?.includes("unauthenticated")) {
        logout();
        toast.error("Session expired. Please login again.");
      }
      console.error("inventory fetch error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred fetching inventory."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.id) {
      fetchAvailableInventory();
    }
  }, [token, user?.id, refetch]);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-gray-700 uppercase">
            <tr>
              <th className="p-4 text-center">S/N</th>
              <th className="p-4 text-center">Product Name</th>
              <th className="p-4 text-center">Total left</th>
              <th className="p-4 text-center">Total sold</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center p-8">
                  Loading...
                </td>
              </tr>
            ) : availableInventory.length > 0 ? (
              availableInventory.map((inventory, index) => {

                return (
                  <tr
                    key={index}
                    className="border-b border-black/10 text-xs"
                  >
                    <td className="p-3 text-center">
                      {String(index+1).padStart(3, "0")}
                    </td>
                    <td className="p-4 text-center capitalize">
                      {inventory?.product_name || "-"}
                    </td>
                    <td className="p-4 text-center">
                      {(Number(inventory?.total_in_stock) - Number(inventory?.total_sold)) || "0"}
                    </td>
                    <td className="p-4 text-center">
                      {inventory?.total_sold || "0"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-8">
                  Inventory is empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
