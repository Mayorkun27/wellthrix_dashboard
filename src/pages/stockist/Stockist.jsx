import React, { useState, useEffect } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';
import { useUser } from '../../context/UserContext';
import PaginationControls from '../../utilities/PaginationControls';
import { formatISODateToCustom } from '../../utilities/Formatterutility';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

const Stockist = () => {
    const { token, logout, user } = useUser();
    const stockistId = user?.id || 1;
    const [pickupOrders, setPickupOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pickupPage, setPickupPage] = useState(1);
    const [totalPickupPages, setTotalPickupPages] = useState(1);
    const perPage = 5;

    // Corrected statusLabels object with unique keys
    const statusLabels = {
        pending: { text: "Pending", className: "bg-yellow-100 text-yellow-600" },
        failed: { text: "Failed", className: "bg-[#c51236]/20 text-red-600" },
        delivered: { text: "Delivered", className: "bg-[#dff7ee]/80 text-pryclr" },
        // Add other possible statuses here, e.g., 'completed', 'cancelled'
    };

    const fetchPickupOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${API_URL}/api/stockists/${stockistId}/user`,
                { page: pickupPage, perPage: perPage },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log("response", response);
            console.log("response", response.data.transactions);

            if (response.status === 200) {
                const { transactions, current_page, last_page } = response.data;
                setPickupOrders(transactions);
                setPickupPage(current_page);
                setTotalPickupPages(last_page);
                toast.success('Pickup orders fetched successfully');
            } else {
                throw new Error(response.data.message || 'Failed to fetch pickup orders.');
            }
        } catch (error) {
            if (error.response?.data?.message?.includes('unauthenticated')) {
                logout();
                toast.error("Session expired. Please login again.");
            }
            console.error('Pickup orders fetch error:', error);
            toast.error(error.response?.data?.message || 'An error occurred fetching pickup orders.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token && stockistId) {
            fetchPickupOrders();
        }
    }, [pickupPage, token, stockistId]);

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-sm flex flex-col gap-2">
            <div className="overflow-x-auto">
                <table className="w-full text-base whitespace-nowrap">
                    <thead className="text-gray-700 uppercase">
                        <tr>
                            <th className="px-4 py-4 text-center">S/N</th>
                            <th className="px-4 py-4 text-center">Name</th>
                            <th className="px-4 py-4 text-center">Ref ID</th>
                            <th className="px-4 py-4 text-center">Product</th>
                            <th className="px-4 py-4 text-center">Date</th>
                            <th className="px-4 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="text-center p-8">Loading...</td>
                            </tr>
                        ) : pickupOrders.length > 0 ? (
                            pickupOrders.map((pickupOrder, index) => {
                                // Fallback to an object with default values if status is not found
                                const status = pickupOrder?.order?.delivery || '';
                                console.log(status)
                                const { text, className } = statusLabels[status] || { text: status || "unknown", className: "bg-gray-200 text-gray-600" };
                                console.log(text, className)
                                return (
                                    <tr key={pickupOrder.id} className="border-b border-black/10 text-xs">
                                        <td className="px-4 py-6 text-center">{index + 1}</td>
                                        <td className="px-4 py-6 text-center">{`${pickupOrder?.order?.user?.first_name || ''} ${pickupOrder?.order?.user?.last_name || ''}`.trim() || '-'}</td>
                                        <td className="px-4 py-6 text-center">{pickupOrder.ref_no || '-'}</td>
                                        <td className="px-4 py-6 text-center">{pickupOrder?.order?.product?.product_name || '-'}</td>
                                        <td className="px-4 py-6 text-center text-pryClr font-semibold">{formatISODateToCustom(pickupOrder.created_at).split(" ")[0] || '-'}</td>
                                        <td className="px-4 py-6 text-center">
                                            <span className={`px-2 py-2 rounded-lg text-center font-normal mx-auto border border-pryClr/15 text-xs ${className}`}>
                                                {text || '-'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center p-8">No pickup orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {!isLoading && pickupOrders.length > 0 && (
                    <PaginationControls
                        currentPage={pickupPage}
                        totalPages={totalPickupPages}
                        setCurrentPage={setPickupPage}
                    />
                )}
            </div>
        </div>
    );
};

export default Stockist;