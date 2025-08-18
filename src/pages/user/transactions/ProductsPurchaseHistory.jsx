import React, { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";
import { formatISODateToCustom, formatterUtility } from "../../../utilities/Formatterutility";
import { MdRemoveRedEye } from "react-icons/md";
import Modal from "../../../components/modals/Modal";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ProductsPurchaseHistory = () => {
    const { user, token, logout } = useUser();
    const [allProductPurchase, setProductsPurchaseHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    const fetchProductsPurchaseHistory = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/users/${user?.id}/manual-purchases`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("Product purchase History Response:", response);

            if (response.status === 200) {
                setProductsPurchaseHistory(response.data.data);
            } else {
                throw new Error(response.data.message || "Failed to fetch product purchase history.");
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
        fetchProductsPurchaseHistory();
    }, [user?.id, token]);

    return (
        <div className="shadow-sm rounded bg-white overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="text-black/70 text-[12px] uppercase text-center border-b border-black/20">
                        <th className="p-5">S/N</th>
                        <th className="p-5">Order ID</th>
                        <th className="p-5">Order Amount</th>
                        <th className="p-5">Pickup Status</th>
                        <th className="p-5">Stockist Username</th>
                        <th className="p-5">Date</th>
                        <th className="p-5">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="7" className="text-center p-8">Loading...</td>
                        </tr>
                    ) : allProductPurchase.length > 0 ? (
                        allProductPurchase.map((item, index) => {
                            return (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 text-sm border-b border-black/10 text-center"
                                >
                                    <td className="p-3">{String(index+1).padStart(3, "0")}</td>
                                    <td className="p-4 text-xs whitespace-nowrap capitalize">{item.ref_no  || "-"}</td>
                                    <td className="p-4">{formatterUtility(item.amount) || "-"}</td>
                                    <td className="p-4 capitalize">
                                        <div className={`w-[100px] py-2 ${item.order.delivery === "success" ? "bg-[#dff7ee]/80 text-pryclr" : item.order.delivery === "failed" ? "bg-[#c51236]/20 text-red-600" : "bg-yellow-100 text-yellow-600"} rounded-lg text-center font-normal mx-auto border border-pryClr/15`}>
                                            {item.order.delivery === "success" ? "Successful" : item.order.delivery === "failed" ? "Failed" : "Pending"}
                                        </div>
                                    </td>
                                    <td className="p-4 capitalize">{item.order?.stockist?.username  || "-"}</td>
                                    {/* <td className="p-4 capitalize">{item.order?.stockist?.stockist_location  || "-"}</td> */}
                                    <td className="p-4 text-sm text-pryClr font-semibold">
                                        {formatISODateToCustom(item.created_at)}
                                    </td>
                                    <td className="p-4 text-sm text-pryClr font-semibold">
                                        <button
                                            type="button"
                                            title={`View this order`}
                                            onClick={() => setSelectedPurchase(item)}
                                            className="text-pryClr hover:text-pryClr/90 cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-pryClr/10 transition-all duration-300 rounded-lg mx-auto"
                                        >
                                            <MdRemoveRedEye />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center p-8">No Product purchase history found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {selectedPurchase && (
                <Modal
                    onClose={() => setSelectedPurchase(null)}
                >
                    <h3 className="font-bold text-center md:text-xl">Order ID: #{selectedPurchase.ref_no}</h3>
                    <ul className="space-y-2 md:text-lg text-base my-4">
                        <li>
                            <span className="font-medium">Stockist Name: </span>
                            {`${selectedPurchase.order?.stockist?.first_name} ${selectedPurchase.order?.stockist?.last_name}`}
                        </li>
                        <li>
                            <span className="font-medium">Stockist Username: </span>
                            {selectedPurchase.order?.stockist?.username}
                        </li>
                        <li>
                            <span className="font-medium">Stockist Location: </span>
                            {selectedPurchase.order?.stockist?.stockist_location}
                        </li>
                        <span className="font-bold">Contact Information:</span>
                        <li>
                            <span className="font-medium">Stockist Email: </span>
                            {selectedPurchase.order?.stockist?.email}
                        </li>
                        <li>
                            <span className="font-medium">Stockist Phone: </span>
                            {selectedPurchase.order?.stockist?.mobile}
                        </li>
                        <li>
                            <span className="font-medium">Order amount: </span>
                            {formatterUtility(Number(selectedPurchase.order?.total_amount))}
                        </li>
                    </ul>
                    <div className={`w-full py-2 ${selectedPurchase.order.delivery === "success" ? "bg-[#dff7ee]/80 text-pryclr" : selectedPurchase.order.delivery === "failed" ? "bg-[#c51236]/20 text-red-600" : "bg-yellow-100 text-yellow-600"} rounded-lg text-center font-normal mx-auto border border-pryClr/15`}>
                        Status: {selectedPurchase.order.delivery === "success" ? "Successful" : selectedPurchase.order.delivery === "failed" ? "Failed" : "Pending"}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ProductsPurchaseHistory;