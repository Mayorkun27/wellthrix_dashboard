import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import PaginationControls from "../../../utilities/PaginationControls";
import { useUser } from "../../../context/UserContext";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ManageMilestones = () => {
  const { token, logout } = useUser();
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // State for filtering
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchEligibleUsers = useCallback(async () => {
    setIsLoading(true);
    const params = {
      page: currentPage,
      perPage: perPage,
      ...(startDate && { 'start': startDate }),
      ...(endDate && { 'end': endDate }),
    };

    try {
      const response = await axios.get(`${API_URL}/api/milestones`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      console.log("milestaone res", response)

      if (response.status === 200 && response.data.success) {
        // const { data, current_page, last_page, per_page } = response.data.data;
        setEligibleUsers(response?.data.data);
        // setCurrentPage(current_page);
        // setLastPage(last_page);
        // setPerPage(per_page);
      } else {
        throw new Error(response.data.message || "Failed to fetch eligible users.");
      }
    } catch (error) {
      if (error.response?.data?.message?.includes("unauthenticated")) {
        logout();
      }
      console.error("API error:", error);
      toast.error(error.response?.data?.message || "An error occurred fetching eligible users.");
    } finally {
      setIsLoading(false);
    }
  }, [token, currentPage, perPage, startDate, endDate, logout]);

  useEffect(() => {
    fetchEligibleUsers();
  }, [fetchEligibleUsers]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1); // Reset to first page when a filter changes
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const today = new Date().toISOString().split('T')[0];
  const isFiltered = startDate || endDate;

  return (
    <div className="space-y-8">
        {/* Filter Section */}
        <div className="flex md:flex-row flex-col items-end md:gap-6 gap-4">
            <div className="flex flex-col w-full">
              <label htmlFor="start-date" className="text-sm font-medium text-gray-600 mb-1">Start Date</label>
              <input 
                type="date"
                id="start-date"
                value={startDate}
                onChange={handleFilterChange(setStartDate)}
                max={endDate || today} 
                className="h-12 w-full px-4 border border-pryClr/30 shadow-md rounded-lg outline-0 focus:border-pryClr/80"
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="end-date" className="text-sm font-medium text-gray-600 mb-1">End Date</label>
              <input 
                type="date"
                id="end-date"
                value={endDate}
                onChange={handleFilterChange(setEndDate)}
                min={startDate}
                max={today}
                className="h-12 w-full px-4 border border-pryClr/30 shadow-md rounded-lg outline-0 focus:border-pryClr/80"
              />
            </div>
            {isFiltered && (
                <button 
                    onClick={clearFilters}
                    className="md:w-max w-full h-[45px] cursor-pointer px-6 bg-accClr text-black rounded-md transition-colors text-sm font-medium"
                >
                    Clear
                </button>
            )}
        </div>

        <div className="shadow-sm rounded bg-white overflow-x-auto">
            <table className="min-w-full">
                <thead>
                <tr className="text-black/70 text-[12px] uppercase text-center border-b border-black/20">
                    <th className="p-5">S/N</th>
                    <th className="p-5">Full Name</th>
                    {/* <th className="p-5">Email</th> */}
                    <th className="p-5">Username</th>
                    <th className="p-5">Direct PV <br /> accumulated</th>
                    <th className="p-5">480's Blocks</th>
                    <th className="p-5">Position</th>
                </tr>
                </thead>
                <tbody>
                {isLoading ? (
                    <tr>
                    <td colSpan="6" className="text-center p-8">Loading...</td>
                    </tr>
                ) : eligibleUsers.length > 0 ? (
                    eligibleUsers.map((item, index) => {
                    const serialNumber = (currentPage - 1) * perPage + (index + 1);
                    return (
                        <tr key={item.id} className="hover:bg-gray-50 text-sm border-b border-black/10 text-center">
                        <td className="p-3">{String(serialNumber).padStart(3, "0")}</td>
                        <td className="p-4 capitalize">{item.fullname || "-"}</td>
                        {/* <td className="p-4">{item.email || "-"}</td> */}
                        <td className="p-4">{item.username || "-"}</td>
                        <td className="p-4 capitalize">{item.direct_pv || "-"}</td>
                        <td className="p-4 capitalize">{item.blocks_480pv || "-"}</td>
                        <td className="p-4 capitalize">{item.position || "-"}</td>
                        </tr>
                    );
                    })
                ) : (
                    <tr>
                    <td colSpan="6" className="text-center p-8">No users found for the selected filters.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>

        {!isLoading && eligibleUsers.length > 0 && (
            <div className="flex justify-center items-center gap-2 p-4">
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

export default ManageMilestones;