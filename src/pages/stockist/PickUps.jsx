import React, { useEffect, useState } from 'react';
import PaginationControls from '../../utilities/PaginationControls';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';
import { formatISODateToCustom } from '../../utilities/Formatterutility';
import { GiCheckMark } from 'react-icons/gi';
import Modal from '../../components/modals/Modal';
import ConfirmationDialog from '../../components/modals/ConfirmationDialog';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const PickUps = () => {
    const { token, logout, user } = useUser();
    const [pickupOrders, setPickupOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [perPage, setPerPage] = useState(5);

    // State for confirmation modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [orderToConfirm, setOrderToConfirm] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false); // To manage loading state during confirmation

    const statusLabels = {
        pending: { text: 'Pending', className: 'bg-yellow-100 text-yellow-600' }, // Corrected for pending
        failed: { text: 'Failed', className: 'bg-[#c51236]/20 text-red-600' },
        picked: { text: 'Picked', className: 'bg-[#dff7ee]/80 text-pryclr' },
        // Add other statuses if necessary, like 'delivered'
    };

    const fetchPickupOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/stockists/${user?.id}/user`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    page: currentPage,
                    perPage: perPage
                }
            });

            console.log('response', response);
            console.log('response data transactions', response.data.transactions);

            if (response.status === 200) {
                const { transactions, current_page, last_page, per_page } = response.data;
                setPickupOrders(transactions);
                setCurrentPage(current_page);
                setLastPage(last_page);
                setPerPage(per_page);
            } else {
                throw new Error(response.data.message || 'Failed to fetch pickup orders.');
            }
        } catch (error) {
            if (error.response?.data?.message?.includes('unauthenticated')) {
                logout();
                toast.error('Session expired. Please login again.');
            }
            console.error('Pickup orders fetch error:', error);
            toast.error(error.response?.data?.message || 'An error occurred fetching pickup orders.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token && user?.id) {
            fetchPickupOrders();
        }
    }, [currentPage, token, user?.id]);

    // Handler to open the confirmation modal
    const handleConfirmPickupClick = (order) => {
        setOrderToConfirm(order);
        setShowConfirmModal(true);
    };

    // Function to perform the actual PUT request
    const performPickupConfirmation = async () => {
        if (!orderToConfirm?.order?.id) return;

        setIsConfirming(true); // Set loading state for the button
        setShowConfirmModal(false); // Close the dialog immediately
        const toastId = toast.loading(`Confirming pickup for ${orderToConfirm.ref_no}...`);

        try {
            const response = await axios.put(
                `${API_URL}/api/orders/${orderToConfirm.order.id}/confirm`,
                {}, // Empty body, as it's typically just a status update
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                toast.success(response.data.message || `Pickup for ${orderToConfirm.ref_no} confirmed!`, { id: toastId });
                fetchPickupOrders();
            } else {
                throw new Error(response.data.message || 'Failed to confirm pickup.');
            }
        } catch (error) {
            if (error.response?.data?.message?.includes('unauthenticated')) {
                logout();
            }
            console.error('Confirm pickup error:', error);
            toast.error(error.response?.data?.message || 'An error occurred confirming pickup.', { id: toastId });
        } finally {
            setIsConfirming(false);
            setOrderToConfirm(null);
        }
    };

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full text-xs whitespace-nowrap">
                    <thead className="text-gray-700 uppercase">
                        <tr>
                            <th className="px-4 text-center">S/N</th>
                            <th className="px-4 text-center">Name</th>
                            <th className="px-4 text-center">Ref ID</th>
                            <th className="px-4 text-center">Product</th>
                            <th className="px-4 text-center">Date</th>
                            <th className="px-4 text-center">Status</th>
                            <th className="px-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="text-center p-8">Loading...</td>
                            </tr>
                        ) : pickupOrders.length > 0 ? (
                            pickupOrders.map((pickupOrder, index) => {
                                const statusKey = pickupOrder?.order?.delivery?.toLowerCase(); // Ensure lowercase for key lookup
                                const { text, className } = statusLabels[statusKey] || { text: statusKey || 'unknown', className: 'bg-gray-200 text-gray-600' };

                                const serialNumber = (currentPage - 1) * perPage + (index + 1);
                                console.log("serialNumber", serialNumber)
                                // Determine if the action button should be enabled based on status
                                const canConfirm = statusKey === "pending"; // Only allow confirming 'pending' orders

                                return (
                                    <tr key={pickupOrder.id} className="border-b border-black/10 text-xs">
                                        <td className="p-3">{String(serialNumber).padStart(3, "0")}</td>
                                        <td className="px-4 py-2 text-center">{`${pickupOrder?.order?.user?.first_name || ''} ${pickupOrder?.order?.user?.last_name || ''}`.trim() || '-'}</td>
                                        <td className="px-4 py-2 text-center">{pickupOrder.ref_no || '-'}</td>
                                        <td className="px-4 py-2 text-center">{pickupOrder?.order?.product?.product_name || '-'}</td>
                                        <td className="px-4 py-2 text-center text-pryClr font-semibold">
                                            {formatISODateToCustom(pickupOrder.created_at).split(" ")[0] || '-'}
                                        </td>
                                        <td className="py-6 text-center">
                                            <div className={`w-[100px] py-2 ${className} rounded-lg text-center font-normal mx-auto border border-pryClr/15`}>
                                                {text}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                type="button"
                                                title={canConfirm ? `Confirm pickup for ${pickupOrder.ref_no}` : `Pickup already ${text}`}
                                                disabled={!canConfirm || isConfirming} // Disable if not pending or if confirming another order
                                                onClick={() => handleConfirmPickupClick(pickupOrder)}
                                                className="text-pryClr text-xl cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-pryClr/10 transition-all duration-300 rounded-lg mx-auto disabled:opacity-25 disabled:cursor-not-allowed"
                                            >
                                                <GiCheckMark />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center p-8">No pickup orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {!isLoading && pickupOrders.length > 0 && (
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={lastPage}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && orderToConfirm && (
                <Modal onClose={() => setShowConfirmModal(false)}>
                    <ConfirmationDialog
                        type='confirm'
                        title='Confirm order pickup?'
                        message={`Are you sure you want to confirm pickup for order #${orderToConfirm.ref_no} by ${orderToConfirm?.order?.user?.first_name || ''} ${orderToConfirm?.order?.user?.last_name || ''}?`}
                        onConfirm={performPickupConfirmation}
                        onCancel={() => {
                            setShowConfirmModal(false);
                            setOrderToConfirm(null);
                        }}
                        confirmButtonText={isConfirming ? "Confirming..." : "Confirm"}
                        cancelButtonText="Cancel"
                        isConfirming={isConfirming}
                    />
                </Modal>
            )}
        </div>
    );
};

export default PickUps;