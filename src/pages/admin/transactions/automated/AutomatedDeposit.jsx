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

const AutomatedDeposit = () => {
    const { token, logout } = useUser();
    const [automatedDeposits, setAutomatedDeposits] = useState([]);
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
        pending_manual: { text: "Pending", className: "bg-yellow-100 text-yellow-600" }
    };

    const fetchAutomatedDeposits = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/deposit-wallets`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    page: currentPage,
                    perPage: perPage
                }
            });

            console.log("all deposit Response:", response);

            if (response.status === 200) {
                const { data, current_page, last_page, per_page } = response.data.data;

                const filteredData = data.filter(item => !item.proof_of_payment);
                console.log("filteredData automated deposit Response:", filteredData);
                setAutomatedDeposits(filteredData);
                setCurrentPage(current_page);
                setLastPage(last_page);
            } else {
                throw new Error(response.data.message || "Failed to fetch automated deposits.");
            }
        } catch (error) {
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            console.error("API submission error:", error);
            toast.error(error.response?.data?.message || "An error occurred fetching automated deposits!.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAutomatedDeposits();
    }, [token, currentPage, perPage]);

    const handleAction = async (actionType) => {
        if (!trnxToConfirm?.id) return;

        const endpoint = actionType === 'confirm' ? `${API_URL}/api/confirm-manual-deposit/${trnxToConfirm.id}` : `${API_URL}/api/decline-manual-deposit/${trnxToConfirm.id}`;
        const actionText = actionType === 'confirm' ? "Confirming" : "Declining";
        const successText = actionType === 'confirm' ? "confirmed" : "declined";

        const toastId = toast.loading(`${actionText} withdrawal...`);
        
        try {
            const response = await axios.post(endpoint, {}, {
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message || `Withdrawal ${successText} successfully`, { id: toastId });
                fetchAutomatedDeposits();
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
                        <th className="p-5">Order Status</th>
                        <th className="p-5">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="11" className="text-center p-8">Loading...</td>
                        </tr>
                    ) : automatedDeposits.length > 0 ? (
                        automatedDeposits.map((item, index) => {
                            const serialNumber = (currentPage - 1) * perPage + (index + 1);
                            const { text, className } = statusLabels[item.status] || { text: item.status, className: "bg-gray-200 text-gray-600" };

                            return (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 text-sm border-b border-black/10 text-center whitespace-nowrap"
                                >
                                    <td className="p-3">{String(serialNumber).padStart(3, "0")}</td>
                                    <td className="p-4">{item.user?.username || "-"}</td>
                                    <td className="p-4">{item.user?.email || "-"}</td>
                                    <td className="p-4 capitalize text-xs">{item.transaction_type === "deposit_e_wallet" ? "E-wallet deposit" : item.transaction_type === "manual_withdraw" ? "Manual withdraw" : "" || "-"}</td>
                                    <td className="p-4">{formatterUtility(Number(item.amount)) || "-"}</td>
                                    <td className="p-4 capitalize">
                                        <div className={`w-[100px] py-2 ${className} rounded-lg text-center font-normal mx-auto border border-pryClr/15`}>
                                            {text}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-pryClr font-semibold">
                                        {formatISODateToCustom(item.created_at)}
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

            {!isLoading && automatedDeposits.length > 0 && (
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

export default AutomatedDeposit;