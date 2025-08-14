import React, { useEffect, useState } from "react";
import { useUser } from "../../../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";
import PaginationControls from "../../../../utilities/PaginationControls";
import { formatISODateToCustom, formatterUtility } from "../../../../utilities/Formatterutility";
import { GiCheckMark } from "react-icons/gi";
import Modal from "../../../../components/modals/Modal";
import ConfirmationDialog from "../../../../components/modals/ConfirmationDialog";
import { TbCancel } from "react-icons/tb";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ManualWithdraw = () => {
    const { token, logout } = useUser();
    const [manualWithdraws, setManualWithdraws] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [perPage] = useState(5);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [trnxToConfirm, setTrnxToConfirm] = useState(null);
    const [modalType, setModalType] = useState('confirm');

    const statusLabels = {
        success: { text: "Successful", className: "bg-[#dff7ee]/80 text-pryclr" },
        failed: { text: "Failed", className: "bg-[#c51236]/20 text-red-600" },
        pending: { text: "Pending", className: "bg-yellow-100 text-yellow-600" }
    };

    const fetchManualWithdrawals = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/withdraw-wallets`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    page: currentPage,
                    perPage: perPage
                }
            });

            if (response.status === 200) {
                const { data, current_page, last_page, per_page } = response.data.data;
                setManualWithdraws(data);
                setCurrentPage(current_page);
                setLastPage(last_page);
            } else {
                throw new Error(response.data.message || "Failed to fetch manual withdraws.");
            }
        } catch (error) {
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            toast.error(error.response?.data?.message || "An error occurred fetching manual withdraws!.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchManualWithdrawals();
    }, [token, currentPage, perPage]);

    // 
    // This useEffect hook is no longer needed since you are not using listOfBanks
    // useEffect(() => {
    //     // ... bank fetching logic
    // }, []);

    const handleAction = async (actionType) => {
        if (!trnxToConfirm?.ref_no) return;

        const endpoint = actionType === 'confirm' ? `${API_URL}/api/confirm/withdraw` : `${API_URL}/api/decline/withdraw`;
        const actionText = actionType === 'confirm' ? "Confirming" : "Declining";
        const successText = actionType === 'confirm' ? "confirmed" : "declined";

        const payLoad = { ref_no: trnxToConfirm.ref_no };
        const toastId = toast.loading(`${actionText} withdrawal...`);
        
        try {
            const response = await axios.post(endpoint, payLoad, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message || `Withdrawal ${successText} successfully`, { id: toastId });
                fetchManualWithdrawals(); // Refresh the list
            } else {
                throw new Error(response.data.message || `Failed to ${actionText.toLowerCase()} withdrawal.`);
            }
        } catch (error) {
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            console.error(`Request ${actionText.toLowerCase()} error:`, error);
            toast.error(error.response?.data?.message || `An error occurred ${actionText.toLowerCase()} the request.`, { id: toastId });
        } finally {
            setShowConfirmModal(false);
            setTrnxToConfirm(null);
            setModalType(null);
        }
    };

    // The function to pass to the ConfirmationDialog
    const onConfirmAction = () => handleAction('confirm');
    const onDeclineAction = () => handleAction('decline');

    return (
        <div className="shadow-sm rounded bg-white overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="text-black/70 text-[12px] whitespace-nowrap uppercase text-center border-b border-black/20">
                        <th className="p-5">S/N</th>
                        <th className="p-5">Username</th>
                        <th className="p-5">Email</th>
                        <th className="p-5">Type</th>
                        <th className="p-5">Amount</th>
                        <th className="p-5">Bank Name</th>
                        <th className="p-5">Account Number</th>
                        <th className="p-5">Account Name</th>
                        <th className="p-5">Order Status</th>
                        <th className="p-5">Date</th>
                        <th className="p-5">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="11" className="text-center p-8">Loading...</td>
                        </tr>
                    ) : manualWithdraws.length > 0 ? (
                        manualWithdraws.map((item, index) => {
                            const serialNumber = (currentPage - 1) * perPage + (index + 1);
                            const { text, className } = statusLabels[item.status] || { text: item.status, className: "bg-gray-200 text-gray-600" };
                            const isPending = item.status === "pending";

                            return (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 text-sm border-b border-black/10 text-center whitespace-nowrap"
                                >
                                    <td className="p-3">{String(serialNumber).padStart(3, "0")}</td>
                                    <td className="p-4">{item.user?.username || "-"}</td>
                                    <td className="p-4">{item.user?.email || "-"}</td>
                                    <td className="p-4 capitalize text-xs">{item.transaction_type === "paystack_withdraw" ? "withdraw via paystack" : item.transaction_type === "manual_withdraw" ? "Manual withdraw" : "" || "-"}</td>
                                    <td className="p-4">{formatterUtility(Number(item.amount)) || "-"}</td>
                                    <td className="p-4">{item.user?.bank_name || "-"}</td>
                                    <td className="p-4">{item.user?.account_number || "-"}</td>
                                    <td className="p-4">{item.user?.account_name || "-"}</td>
                                    <td className="p-4 capitalize">
                                        <div className={`w-[100px] py-2 ${className} rounded-lg text-center font-normal mx-auto border border-pryClr/15`}>
                                            {text}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-pryClr font-semibold">
                                        {formatISODateToCustom(item.created_at)}
                                    </td>
                                    <td className="p-4 text-sm text-pryClr font-semibold flex gap-2 items-center">
                                        <button
                                            type="button"
                                            title={`Cancel withdraw request`}
                                            disabled={!isPending}
                                            onClick={() => {
                                                setTrnxToConfirm(item);
                                                setModalType('decline');
                                                setShowConfirmModal(true);
                                            }}
                                            className="text-red-600 text-xl cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-red-600/10 transition-all duration-300 rounded-lg mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <TbCancel />
                                        </button>
                                        <button
                                            type="button"
                                            title={`Confirm withdraw request`}
                                            disabled={!isPending}
                                            onClick={() => {
                                                setTrnxToConfirm(item);
                                                setModalType('confirm');
                                                setShowConfirmModal(true);
                                            }}
                                            className="text-pryClr text-xl cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-pryClr/10 transition-all duration-300 rounded-lg mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <GiCheckMark />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="11" className="text-center p-8">No withdrawal request found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {!isLoading && manualWithdraws.length > 0 && (
                <div className="flex justify-center items-center gap-2 p-4">
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={lastPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            )}

            {showConfirmModal && trnxToConfirm && (
                <Modal onClose={() => setShowConfirmModal(false)}>
                    <ConfirmationDialog 
                        title={modalType === 'confirm' ? "Confirm Withdrawal" : "Decline Withdrawal"}
                        message={`Are you sure you want to ${modalType === 'confirm' ? 'confirm' : 'decline'} this withdrawal request of ${formatterUtility(Number(trnxToConfirm?.amount))} initiated by ${trnxToConfirm?.user?.username}? This action cannot be undone.`}
                        onConfirm={modalType === 'confirm' ? onConfirmAction : onDeclineAction}
                        onCancel={() => {
                          setShowConfirmModal(false);
                          setTrnxToConfirm(null);
                          setModalType(null);
                        }}
                        type={modalType}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ManualWithdraw;