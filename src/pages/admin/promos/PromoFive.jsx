import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';
import { formatISODateToCustom, formatTransactionType } from '../../../utilities/formatterutility';
import PaginationControls from '../../../utilities/PaginationControls';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const PromoFive = () => {
    const { user, token, logout } = useUser();
    const [allQualifiers, setAllQualifiers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const perPage = 5;

    const fetchQualifiers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/car-promo`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    page: currentPage,
                    perPage: perPage
                }
            });

            console.log("promoFive qualifiers Response:", response);

            if (response.status === 200) {
                const { data, last_page } = response.data.data;
                setAllQualifiers(data);
                setLastPage(last_page);
            } else {
                throw new Error(response.data.message || "Failed to fetch qualifiers.");
            }
        } catch (error) {
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            console.error("API submission error:", error);
            toast.error(error.response?.data?.message || "An error occurred fetching qualifiers!.");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchQualifiers();
    }, [user?.id, token, currentPage]);

    return (
        <div className="shadow-sm rounded bg-white overflow-x-auto">
            <div className="flex items-center justify-between md:p-8 p-4">
                <h3 className='text-xl font-semibold'>MEGA DRIVE CAR PROMO</h3>
            </div>
            <table className="min-w-full">
                <thead>
                    <tr className="text-black/70 text-[12px] uppercase text-center border-b border-black/20">
                        <th className="p-5">S/N</th>
                        <th className="p-5">Key</th>
                        <th className="p-5">Username</th>
                        <th className="p-5">Email</th>
                        <th className="p-5">Date Qualified</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="7" className="text-center p-8">Loading...</td>
                        </tr>
                    ) : allQualifiers.length > 0 ? (
                        allQualifiers.map((qualifier, index) => {
                            const serialNumber = (currentPage - 1) * perPage + (index + 1);
                            return (
                                <tr
                                    key={qualifier.id}
                                    className="hover:bg-gray-50 text-sm border-b border-black/10 text-center"
                                >
                                    <td className="p-4">{String(serialNumber).padStart(3, "0")}</td>
                                    <td className="p-4">{qualifier?.key || "-"}</td>
                                    <td className="p-4">{qualifier?.user?.username || "-"}</td>
                                    <td className="p-4">{qualifier?.user?.email || "-"}</td>
                                    <td className="p-4">{formatISODateToCustom(qualifier?.qualified_at) || "-"}</td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center p-8">No qualifiers found.</td>
                        </tr>
                    )}
                </tbody>
                {
                    <PaginationControls 
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={lastPage}
                    />
                }
            </table>
        </div>
    )
}

export default PromoFive
