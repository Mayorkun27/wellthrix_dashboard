import React, { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";
import PaginationControls from "../../../utilities/PaginationControls";
import { formatISODateToCustom, formatterUtility, formatTransactionType } from "../../../utilities/Formatterutility";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const EwalletHistory = () => {
    const { user, token, logout } = useUser();
    const [ewalletHistory, setEwalletHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [perPage, setPerPage] = useState(5);

    const fetchEwalletHistory = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/users/${user?.id}/fund-e-wallets`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    page: currentPage,
                    perPage: perPage
                }
            });

            // console.log("Ewallet History Response:", response.data);

            if (response.status === 200 && response.data.ok) {
                const { data, current_page, last_page, per_page } = response.data.data;
                setEwalletHistory(data);
                setCurrentPage(current_page);
                setLastPage(last_page);
                setPerPage(per_page);
            } else {
                throw new Error(response.data.message || "Failed to fetch E-wallet history.");
            }
        } catch (error) {
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            console.error("API submission error:", error);
            toast.error(error.response?.data?.message || "An error occurred fetching E-wallet history!.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEwalletHistory();
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
                    ) : ewalletHistory.length > 0 ? (
                        ewalletHistory.map((item, index) => {
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
                            <td colSpan="7" className="text-center p-8">No e-wallet history found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {!isLoading && ewalletHistory.length > 0 && (
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

export default EwalletHistory;