import React, { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";
import PaginationControls from "../../../utilities/PaginationControls";
import { formatISODateToCustom, formatterUtility, formatTransactionType } from "../../../utilities/Formatterutility";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const P2PHistory = () => {
    const { user, token, logout } = useUser();
    const [p2PHistory, setP2PHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [perPage, setPerPage] = useState(5);

    const fetchP2PHistory = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/user/p2p/${user?.id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    page: currentPage,
                    perPage: perPage
                }
            });

            console.log("ewallet transfer History Response:", response.data);

            if (response.status === 200 && response.data.ok) {
                // const { transaction, current_page, last_page, per_page } = response.data.data;
                setP2PHistory(response.data.transactions);
                // setCurrentPage(current_page);
                // setLastPage(last_page);
                // setPerPage(per_page);
            } else {
                throw new Error(response.data.message || "Failed to fetch ewallet transfer history.");
            }
        } catch (error) {
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            console.error("API submission error:", error);
            toast.error(error.response?.data?.message || "An error occurred fetching ewallet transfer history!.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchP2PHistory();
    }, [user?.id, token, currentPage]);

    return (
        <div className="shadow-sm rounded bg-white overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="text-black/70 text-[12px] uppercase text-center border-b border-black/20">
                        <th className="p-5">ID</th>
                        <th className="p-5">Type</th>
                        <th className="p-5">Amount</th>
                        <th className="p-5">Trnx Status</th>
                        <th className="p-5">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="7" className="text-center p-8">Loading...</td>
                        </tr>
                    ) : p2PHistory.length > 0 ? (
                        p2PHistory.map((item, index) => {
                            const serialNumber = (currentPage - 1) * perPage + (index + 1);
                            return (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 text-sm border-b border-black/10 text-center"
                                >
                                    <td className="p-3">{String(serialNumber).padStart(3, "0")}</td>
                                    <td className="p-4 capitalize">{formatTransactionType(item.transaction_type)}</td>
                                    <td className="p-4">{formatterUtility(item.amount) || "-"}</td>
                                    <td className="p-4 capitalize">
                                        <div className={`w-[100px] py-2 ${item.status === "success" ? "bg-[#dff7ee]/80 text-pryclr" : item.status === "declined" ? "bg-[#c51236]/20 text-red-600" : "bg-yellow-100 text-yellow-600"} rounded-lg text-center font-normal mx-auto border border-pryClr/15`}>
                                            {item.status === "success" ? "Successful" : item.status === "declined" ? item.status : "Pending"}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-pryClr font-semibold">
                                        {formatISODateToCustom(item.created_at)}
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center p-8">No ewallet transfer history found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* {!isLoading && p2PHistory.length > 0 && (
                <div className="flex justify-center items-center gap-2 p-4">
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={lastPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            )} */}
        </div>
    );
};

export default P2PHistory;