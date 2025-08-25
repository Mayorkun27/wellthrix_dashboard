import React, { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";
import PaginationControls from "../../../utilities/PaginationControls";
import { formatISODateToCustom, formatterUtility } from "../../../utilities/Formatterutility";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const DirectRefsTable = () => {
    const { user, token, logout } = useUser();
    const [directlySponsored, setDirectlySponsored] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [perPage, setPerPage] = useState(5);

    const fetchirectlySponsoredlist = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/referrals/sponsoredDownlines`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    page: currentPage,
                    perPage: perPage
                }
            });

            console.log("user directly sponsored list:", response);

            if (response.status === 200 && response.data.success) {
                const { downlines, current_page, last_page, per_page } = response.data.data;
                setDirectlySponsored(downlines);
                setCurrentPage(current_page);
                setLastPage(last_page);
                setPerPage(per_page);
            } else {
                throw new Error(response.data.message || "Failed to fetch user directly sponsored list.");
            }
        } catch (error) {
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            console.error("API submission error:", error);
            toast.error(error.response?.data?.message || "An error occurred fetching user directly sponsored list!.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchirectlySponsoredlist();
    }, [user?.id, token, currentPage]);


    const filteredData = directlySponsored.filter(direct => direct.relationship_type === "sponsored")

    return (
        <div className="shadow-sm rounded bg-white overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="text-black/70 text-[12px] uppercase text-center border-b border-black/20">
                        <th className="p-5">S/N</th>
                        {/* <th className="p-5">Order id</th> */}
                        <th className="p-5">Full name</th>
                        <th className="p-5">username</th>
                        <th className="p-5">package</th>
                        <th className="p-5">rank</th>
                        <th className="p-5">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="7" className="text-center p-8">Loading...</td>
                        </tr>
                    ) : filteredData.length > 0 ? (
                        filteredData.map((item, index) => {
                            const serialNumber = (currentPage - 1) * perPage + (index + 1);
                            return (
                                <tr
                                    key={item?.user?.id}
                                    className="hover:bg-gray-50 text-sm border-b border-black/10 text-center capitalize"
                                >
                                    <td className="p-3">{String(index+1).padStart(3, "0")}</td>
                                    {/* <td className="p-4">{`REG-${item?.user?.id}` || "-"}</td> */}
                                    <td className="p-4">{item?.user?.fullname || "-"}</td>
                                    <td className="p-4">{item?.user?.username || "-"}</td>
                                    <td className="p-4 capitalize">{item?.user?.plan?.name || "-"}</td>
                                    <td className="p-4">{item?.user?.rank ? item?.user?.rank : "No rank" || "-"}</td>
                                    <td className="p-4 text-sm text-pryClr font-semibold">
                                        {formatISODateToCustom(item.created_at)}
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center p-8">Directly sponsored list is empty.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {!isLoading && directlySponsored.length > 0 && (
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

export default DirectRefsTable;