import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useUser } from "../../../context/UserContext";



const ElectricityRecharges = () => {

  const { user, token, logout } = useUser();
  const [electricityHistory, setElectricityHistory] = useState([])

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(electricityHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = electricityHistory.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    const fetchDataHistory = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/${user?.id}/elec`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        console.log("elec response", response)
  
        if (response.status === 200 && response.data.success) {
          toast.success("elec history fetched successfully!.");
          setElectricityHistory(response.data.data)
        } else {
          throw new Error(response.data.message || "Failed to fetch elec history.");
        }
  
      } catch (error) {
        if (error.response?.data?.message?.includes("unauthenticated")) {
          logout();
        }
        console.error("API submission error:", error);
        toast.error(error.response?.data?.message || "An error occurred fetching elec history!.");
        setIsSubmitting(false);
      }
    }

    fetchDataHistory();
  }, [user?.id, token])

  return (
    <div className="space-y-4">
      <div className="shadow-sm rounded bg-white overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-black/70 text-[12px] uppercase border-b border-black/20 text-center">
              <th className="p-5">ID</th>
              <th className="p-5">Provider</th>
              <th className="p-5">Token</th>
              <th className="p-5">Plan</th>
              <th className="p-5">Amount</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 text-sm border-b border-black/10 text-center"
              >
                <td className="p-4">{String(item.id).padStart(3, "0")}</td>
                <td className="p-4">{item.provider}</td>
                <td className="p-4">{item.token}</td>
                <td className="p-4">{item.plan}</td>
                <td className="p-4 text-sm text-pryClr font-semibold">
                  {item.amount}
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
    </div>
  );
};

export default ElectricityRecharges;
