import React, { useEffect, useState } from "react";
import { useUser } from "../../../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";
import PaginationControls from "../../../../utilities/PaginationControls";
import { formatISODateToCustom, formatterUtility } from "../../../../utilities/Formatterutility";
import { GiCheckMark } from "react-icons/gi";
import Modal from "../../../../components/modals/Modal";
import ConfirmationDialog from "../../../../components/modals/ConfirmationDialog";
import { FiChevronDown } from 'react-icons/fi';
import { FaFileCsv } from "react-icons/fa6";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ManualWithdraw = () => {
    const { token, logout } = useUser();
    const [manualWithdraws, setManualWithdraws] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [trnxToConfirm, setTrnxToConfirm] = useState(null);
    const [modalType, setModalType] = useState('confirm');
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [isDownloadingList, setIsDownloadingList] = useState(false);

    const statusLabels = {
        success: { text: "Success", className: "bg-[#dff7ee]/80 text-pryclr" },
        failed: { text: "Failed", className: "bg-[#c51236]/20 text-red-600" },
        pending: { text: "Pending", className: "bg-yellow-100 text-yellow-600" }
    };

    const fetchManualWithdrawals = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/all/withdraw`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log("all withdraw Response:", response);

            if (response.status === 200 && response.data.success) {
                const { data } = response.data;
                setManualWithdraws(data);
            } else {
                throw new Error(response.data.message || "Failed to fetch withdraw list.");
            }
        } catch (error) {
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            toast.error(error.response?.data?.message || "An error occurred fetching withdraw list!.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchManualWithdrawals();
    }, [token]);

    const toggleAccordion = (id) => {
        setActiveAccordion(activeAccordion === id ? null : id);
    };

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

    // const sampleData = {
    //     "2025-08-22": [
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         }
    //     ],
    //     "2025-08-12": [
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //         {
    //             "name": "name",
    //             "bank_name": "bank_name",
    //             "account_name": "account_name",
    //             "account_number": "accunt_nunmber",
    //         },
    //     ],
    // }

    // xlsx
    const handleListDownloadAsCSV = async (data) => {
        if (!data || data.length === 0) return;
        
        setIsDownloadingList(true)

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Define CSV headers
        const headers = [
            "S/N",
            "Username",
            "Email",
            "Amount",
            "Bank Name",
            "Account Number",
            "Account Name"
        ];

        // Build CSV rows
        const rows = data.map((item, idx) => [
            String(idx + 1).padStart(3, "0"),
            item.user_name || "-",
            item.user_email || "-",
            item.amount || "-",
            item.bank_name || "-",
            item.account_number || "-",
            item.account_name || "-"
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        // Create a Blob and trigger download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `withdrawals_for_${formatISODateToCustom(Date.now()).split(" ")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setIsDownloadingList(false)
    }

    return (
        <div className="space-y-6">
            {
                Object.entries(manualWithdraws).map(([date, data], index) => (
                    <div className="shadow-sm rounded bg-white">
                        <div
                            className={`flex items-center justify-between w-full p-5 font-medium text-left text-gray-800 transition-colors border border-pryClr/20 rounded-[inherit] cursor-pointer ${activeAccordion === index ? 'bg-white/60' : 'bg-white/90 hover:bg-white/80'
                            }`}
                            >
                            <span className="text-sm md:text-lg font-semibold">{date}</span>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => toggleAccordion(index)}
                                    className="bg-accClr h-[40px] px-4 rounded-md cursor-pointer"
                                >
                                    {activeAccordion === index ? 'Collapse' : 'Expand'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleListDownloadAsCSV(data)}
                                    disabled={isDownloadingList}
                                    className={`bg-accClr h-[40px] px-4 rounded-md flex items-center gap-1 cursor-pointer ${isDownloadingList ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {isDownloadingList ? 'Downloading...' : 'Download list'}
                                    <FaFileCsv />
                                </button>
                            </div>
                        </div>
                        <div className={`overflow-x-auto transition-all duration-200 overflow-hidden ${activeAccordion === index ? 'max-h-max' : 'max-h-0'
                  }`}>
                            <table key={index} className="min-w-full">
                                <thead>
                                    <tr className="text-black/70 text-[12px] whitespace-nowrap uppercase text-center border-b border-black/20">
                                        <th className="p-5">S/N</th>
                                        <th className="p-5">Username</th>
                                        <th className="p-5">Email</th>
                                        <th className="p-5">Amount</th>
                                        <th className="p-5">Bank Name</th>
                                        <th className="p-5">Account Number</th>
                                        <th className="p-5">Account Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.length > 0 ? (
                                            data.map((item, index) => {
                                                return (
                                                    <tr
                                                        key={item.id}
                                                        className="hover:bg-gray-50 text-sm border-b border-black/10 text-center whitespace-nowrap"
                                                    >
                                                        <td className="p-3">{String(index+1).padStart(3, "0")}</td>
                                                        <td className="p-4">{item?.user_name || "-"}</td>
                                                        <td className="p-4">{item?.user_email || "-"}</td>
                                                        <td className="p-4">{formatterUtility(Number(item?.amount)) || "-"}</td>
                                                        <td className="p-4">{item?.bank_name || "-"}</td>
                                                        <td className="p-4">{item?.account_number || "-"}</td>
                                                        <td className="p-4">{item?.account_name || "-"}</td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="11" className="text-center p-8">No withdrawal request found.</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            }


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
    )
};

export default ManualWithdraw;