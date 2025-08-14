import React, { useEffect, useState } from "react";
import { useUser } from "../../../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";
import PaginationControls from "../../../../utilities/PaginationControls";
import { formatISODateToCustom, formatterUtility } from "../../../../utilities/Formatterutility";
import { GiCheckMark } from "react-icons/gi";
import Modal from "../../../../components/modals/Modal";
import ConfirmationDialog from "../../../../components/modals/ConfirmationDialog";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const AutomatedWithdraw = () => {
    const { user, token, logout } = useUser();
    const [automatedWithdraws, setAutomatedWithdraws] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [trnxToConfirm, setTrnxToConfirm] = useState(null);
    const [isFetchingbank, setIsFetchingbank] = useState(true);
    const [listOfBanks, setListOfBanks] = useState([]);

    const statusLabels = {
        success: { text: "Successful", className: "bg-[#dff7ee]/80 text-pryclr" },
        failed: { text: "Failed", className: "bg-[#c51236]/20 text-red-600" },
        pending: { text: "Pending", className: "bg-yellow-100 text-yellow-600" }
    };


    const fetchAutomatedWithdrawals = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/withdraw-paystack-wallets`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    page: currentPage,
                    perPage: perPage
                }
            });

            console.log("automated withdraws Response:", response);

            if (response.status === 200) {
                const { data, current_page, last_page, per_page } = response.data.data;
                setAutomatedWithdraws(data);
                setCurrentPage(current_page);
                setLastPage(last_page);
                setPerPage(per_page);
            } else {
                throw new Error(response.data.message || "Failed to fetch automated withdraws.");
            }
        } catch (error) {
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            console.error("API submission error:", error);
            toast.error(error.response?.data?.message || "An error occurred fetching automated withdraws!.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAutomatedWithdrawals();
    }, [token, currentPage]);

    useEffect(() => {
        const fetchApprovedBanks = async () => {
            setIsFetchingbank(true)
            try {
                const response = await axios.get("https://api.paystack.co/bank");
                // console.log(response)

                if (response.status === 200 && response.data.status) {
                    setListOfBanks(response.data.data);
                }
            } catch (err) {
                console.error("Error fetching banks", err);
                toast.error("Error fetching bank list.");
            } finally {
                setIsFetchingbank(false)
            }
        };

        fetchApprovedBanks();
    }, []);

    const confirmRequest = async () => {
        if (!trnxToConfirm.ref_no) return;

        let payLoad = {
            ref_no: trnxToConfirm.ref_no,
            bank_code: trnxToConfirm.bank_code
        }

        const toastId = toast.loading("Confirming withdraw...");
        
        try {
            const response = await axios.post(`${API_URL}/api/confirm/withdraw`, payLoad, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message || "Withdrawal confirmed successfully", { id: toastId });
                fetchAutomatedWithdrawals();
            } else {
                throw new Error(response.data.message || "Failed to confirm withdrawal.");
            }
        } catch (error) {
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            console.error("request confirmation error:", error);
            toast.error(error.response?.data?.message || "An error occurred confirming the request.", { id: toastId });
        } finally {
            setShowConfirmModal(false);
            setTrnxToConfirm(null);
        }
    };

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
                    {isLoading || isFetchingbank ? (
                        <tr>
                            <td colSpan="11" className="text-center p-8">Loading...</td>
                        </tr>
                    ) : automatedWithdraws.length > 0 ? (
                        automatedWithdraws.map((item, index) => {
                            const serialNumber = (currentPage - 1) * perPage + (index + 1);
                            const bankCode = listOfBanks.find(bank => 
                                bank.name?.toLowerCase().trim() === item.user?.bank_name?.toLowerCase().trim()
                            )?.code;
                            const { text, className } = statusLabels[item.status] || { text: item.status, className: "bg-gray-200 text-gray-600" };
                            return (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 text-sm border-b border-black/10 text-center whitespace-nowrap"
                                >
                                    <td className="p-3">{String(serialNumber).padStart(3, "0")}</td>
                                    <td className="p-4">{item.user?.username || "-"}</td>
                                    <td className="p-4">{item.user?.email || "-"}</td>
                                    <td className="p-4 capitalize text-xs">{item.transaction_type === "paystack_withdraw" ? "withdraw via paystack" : "" || "-"}</td>
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
                                    <td className="p-4 text-sm text-pryClr font-semibold">
                                        <button
                                            type="button"
                                            title={`Confirm withdraw request`}
                                            disabled={item.status === "success"}
                                            onClick={() => {
                                                setTrnxToConfirm({
                                                    ref_no: item.ref_no,
                                                    bank_code: bankCode,
                                                    username: item.user.username,
                                                    amount: item.amount
                                                })
                                                setShowConfirmModal(true);
                                            }}
                                            className="text-pryClr hover:text-pryClr text-xl cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-pryClr/10 transition-all duration-300 rounded-lg mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <GiCheckMark />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan="11" className="text-center p-8">No withdrawal request found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {!isLoading && automatedWithdraws.length > 0 && (
                <div className="flex justify-center items-center gap-2 p-4">
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={lastPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            )}

            {showConfirmModal && (
                <Modal onClose={() => setShowConfirmModal(false)}>
                {console.log(trnxToConfirm.amount)}
                    <ConfirmationDialog 
                        title="Confirm request"
                        message={`Are you sure you want to confirm this withdrawal request of ${formatterUtility(Number(trnxToConfirm?.amount))} initiated by ${trnxToConfirm?.username}? This action cannot be undone.`}
                        onConfirm={confirmRequest}
                        onCancel={() => setShowConfirmModal(false)}
                        type="confirm"
                    />
                </Modal>
            )}
        </div>
    );
};

export default AutomatedWithdraw;