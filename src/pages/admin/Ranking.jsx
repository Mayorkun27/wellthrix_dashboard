import React, { useEffect, useState, useCallback } from "react";
import PaginationControls from "../../utilities/PaginationControls";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { toast } from "sonner";
import { FiSearch } from "react-icons/fi";
import { formatDateToStyle, formatterUtility } from "../../utilities/formatterutility";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Ranking = () => {
  const { token, logout } = useUser();
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRank, setSelectedRank] = useState('');
  const [ranks, setRanks] = useState([
    "Bronze Leader",
    "Silver Leader",
    "Gold Leader",
    "Platinum Leader",
    "Diamond Executive",
    "Blue Diamond",
    "Black Diamond",
    "Royal Diamond",
    "Crown Ambassador",
    "Double Crown Ambassador"
  ]);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset page on new search
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch available ranks for the filter dropdown
  // useEffect(() => {
  //   const fetchRanksList = async () => {
  //     try {
  //       const response = await axios.get(`${API_URL}/api/ranks/all`, { // Assuming this endpoint exists
  //         headers: { "Authorization": `Bearer ${token}` },
  //       });
  //       if (response.status === 200 && response.data.success) {
  //         setRanks(response.data.data || []);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch ranks list:", error);
  //       // Not showing a toast here to avoid bothering the user if this minor fetch fails
  //     }
  //   };
  //   if (token) fetchRanksList();
  // }, [token]);

  const fetchRanking = useCallback(async () => {
    setIsLoading(true);
    const params = {
      page: currentPage,
      perPage: perPage,
      ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
      ...(selectedDate && { month: selectedDate }),
      ...(selectedRank && { rank: selectedRank }),
    };

    try {
      const response = await axios.get(`${API_URL}/api/rank/all-users`, {
        headers: { "Authorization": `Bearer ${token}` },
        params,
      });

      // console.log("rank response", response)

      if (response.status === 200 && response.data.success) {
        const { data, current_page, last_page, per_page } = response.data.data;
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
      setIsLoading(false);
    }
  }, [token, currentPage, perPage, debouncedSearchTerm, selectedDate, selectedRank, logout]);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1); // Reset page when any filter changes
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDate('');
    setSelectedRank('');
    setCurrentPage(1);
  };

  const isFiltered = debouncedSearchTerm || selectedDate || selectedRank;

  return (
    <div className="space-y-8">
      {/* Filter Section */}
      <div className="flex md:flex-row flex-col justify-between items-center lg:gap-6 gap-4">
        <div className="relative flex-grow md:w-1/3 w-full">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // className="h-12 w-full pl-10 pr-4 border rounded-lg focus:ring-pryClr focus:border-pryClr"
            className="w-full pl-8 h-[50px] border border-pryClr/30 focus:border-pryClr/80 shadow-md rounded-lg focus:outline-none"
          />
        </div>
        <div className="flex items-center lg:gap-6 gap-4 lg:text-base md:text-xs">
          <div>
            <input 
              type="month"
              value={selectedDate}
              onChange={handleFilterChange(setSelectedDate)}
              max={new Date().toISOString().slice(0, 7)}
              className="h-12 w-full px-4 border border-pryClr/30 shadow-md rounded-lg outline-0 focus:border-pryClr/80"
            />
          </div>
          <div>
            <select 
              value={selectedRank}
              onChange={handleFilterChange(setSelectedRank)}
              className="h-12 w-full px-4 border border-pryClr/30 shadow-md rounded-lg outline-0 focus:border-pryClr/80"
            >
              <option value="">All Ranks</option>
              {ranks.map(rank => (
                <option key={rank} value={rank}>{rank}</option>
              ))}
            </select>
          </div>
          {isFiltered && (
            <button 
              onClick={clearFilters}
              className="md:inline hidden h-[45px] cursor-pointer px-6 bg-accClr text-black rounded-md transition-colors text-sm font-medium"
            >
              Clear
            </button>
          )}
        </div>
        {isFiltered && (
          <button 
            onClick={clearFilters}
            className="md:hidden block h-[45px] w-full cursor-pointer px-6 bg-accClr text-black rounded-md transition-colors text-sm font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full border-collapse text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-5 text-sm font-medium">S/N</th>
              <th className="p-5 text-sm font-medium">Username</th>
              <th className="p-5 text-sm font-medium">Full Name</th>
              <th className="p-5 text-sm font-medium">Rank</th>
              <th className="p-5 text-sm font-medium">Bonus Amount</th>
              <th className="p-5 text-sm font-medium">Extra Reward</th>
              <th className="p-5 text-sm font-medium">Date achieved</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                  <td colSpan="7" className="text-center p-8">Loading...</td>
              </tr>
            ) : allData.length > 0 ? (
              allData.map((data, idx) => {
                const serialNumber = (currentPage - 1) * perPage + (idx + 1);
                return ( 
                  <tr key={data.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-4 text-sm">{String(serialNumber).padStart(3, "0")}</td>
                    <td className="p-4 text-sm">{data.username}</td>
                    <td className="p-4 text-sm capitalize">{`${data.first_name} ${data.last_name}`}</td>
                    <td className="p-4 text-sm capitalize">{data.rank}</td>
                    <td className="p-4 text-sm">{formatterUtility(data?.rank_details?.bonus_amount)}</td>
                    <td className="p-4 text-sm">{data?.rank_details?.extra_reward || "-"}</td>
                    <td className="p-4 text-sm">{formatDateToStyle(data.created_at)}</td>
                  </tr>
                )})
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-8">No users found for the selected filters.</td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td colSpan={7} className="py-2">
                {!isLoading && allData.length > 0 && (
                  <div className="flex justify-center items-center gap-2 p-2">
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={lastPage}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};

export default Ranking;