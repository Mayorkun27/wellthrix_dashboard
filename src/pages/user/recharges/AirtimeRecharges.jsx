import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useUser } from "../../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL

const AirtimeRecharges = () => {

  const { user, token } = useUser();
  const [airtimeHistory, setAirtimeHistory] = useState([])

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(rechargeHistory.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = rechargeHistory.slice(startIndex, startIndex + itemsPerPage);
  
  useEffect(() => {
    const fetchAirtimeHistory = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/${user?.id}/airtime`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        console.log("airtime response", response)
  
        if (response.status === 200 && response.data.success) {
          toast.success("Airtime history fetched successfully!.");
          setAirtimeHistory(response.data.data)
        } else {
          throw new Error(response.data.message || "Failed to fetch airtime history.");
        }
  
      } catch (error) {
        if (error.response?.data?.message?.includes("unauthenticated")) {
          logout();
        }
        console.error("API submission error:", error);
        toast.error(error.response?.data?.message || "An error occurred fetching airtime history!.");
        setIsSubmitting(false);
      }
    }

    fetchAirtimeHistory();
  }, [user?.id, token])
  

  return (
    <div className="shadow-sm rounded bg-white overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-black/70 text-[12px] uppercase text-center border-b border-black/20">
            <th className="p-5">ID</th>
            <th className="p-5">Phone</th>
            <th className="p-5">Network</th>
            <th className="p-5">Type</th>
            <th className="p-5">Amount</th>
            <th className="p-5">Order ID</th>
            <th className="p-5">Date</th>
          </tr>
        </thead>
        <tbody>
          {airtimeHistory.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 text-sm border-b border-black/10 text-center"
            >
              <td className="p-3">{String(item.id).padStart(3, "0")}</td>
              <td className="p-4">{item.phone}</td>
              <td className="p-4">{item.network}</td>
              <td className="p-4">{item.type}</td>
              <td className="p-4">{item.amount}</td>
              <td className="p-4">{item.orderId}</td>
              <td className="p-4 text-sm text-pryClr font-semibold">
                {item.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
      <div className="flex items-center justify-center space-x-2 p-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="text-gray-600 disabled:opacity-30"
        >
          <FaChevronLeft />
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${
                currentPage === page
                  ? "bg-pryClr text-white font-bold"
                  : "text-gray-800"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="text-gray-600 disabled:opacity-30"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default AirtimeRecharges;
