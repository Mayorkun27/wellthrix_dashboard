import React, { useEffect, useState } from "react";
import PaginationControls from "../../utilities/PaginationControls";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Ranking = () => {
  const { token, logout } = useUser()
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const [allData, setAllData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchRanking = async () => {
    setIsLoading(true)

    try {
      const response = await axios.get(`${API_URL}/api/rank/all-users`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        params: {
          page: currentPage,
          perPage: perPage
        }
      })

      console.log("response", response)

      if (response.status === 200 && response.data.success) {
        const { data, current_page, last_page, per_page } = response.data.data;
        console.log("response.data.data", response.data.data)
        setAllData(data);
        setCurrentPage(current_page);
        setLastPage(last_page);
        setPerPage(per_page);
      } else {
       throw new Error(response.data.message || "Failed to fetch ranks.");
      }
    } catch (error) {
      if (error.response?.data?.message?.includes("unauthenticated")) {
        logout();
      }
      console.error("API submission error:", error);
      toast.error(error.response?.data?.message || "An error occurred fetching ranks!.");
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRanking()
  }, [token, currentPage])

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full border-collapse text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-5 text-sm font-medium">S/N</th>
              <th className="p-5 text-sm font-medium">Username</th>
              <th className="p-5 text-sm font-medium">Full Name</th>
              <th className="p-5 text-sm font-medium">Rank</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                  <td colSpan="4" className="text-center p-8">Loading...</td>
              </tr>
            ) : allData.length > 0 ? (
              allData.map((data, idx) => {
                const serialNumber = (currentPage - 1) * perPage + (idx + 1);
                return ( 
                  <tr
                    key={idx}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4 text-sm">{String(serialNumber).padStart(3, "0")}</td>
                    <td className="p-4 text-sm">{data.username}</td>
                    <td className="p-4 text-sm">{`${data.first_name} ${data.last_name}`}</td>
                    <td className="p-4 text-sm">{data.rank}</td>
                  </tr>
                )})
            ) : (
              <tr>
                <td colSpan="2" className="text-center p-8">No user with rank found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && allData.length > 0 && (
        <div className="flex justify-center items-center gap-2 p-2">
          <PaginationControls
            currentPage={currentPage}
            totalPages={lastPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default Ranking;
