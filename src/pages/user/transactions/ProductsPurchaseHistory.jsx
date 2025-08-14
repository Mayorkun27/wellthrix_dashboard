import React, { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";
import PaginationControls from "../../../utilities/PaginationControls";
import { formatISODateToCustom, formatterUtility } from "../../../utilities/Formatterutility";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ProductsPurchaseHistory = () => {
    const { user, token, logout } = useUser();
    const [allProductPurchase, setProductsPurchaseHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
                    <tr className="text-black/70 text-[12px] uppercase text-center border-b whitespace-nowrap border-black/20">
                        <th className="p-5">S/N</th>
                        <th className="p-5">Order ID</th>
                        <th className="p-5">Order Amount</th>
                        <th className="p-5">Delevery Status</th>
                        <th className="p-5">Stockist Name</th>
                        <th className="p-5">Stockist Location</th>
                        <th className="p-5">Date</th>
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
                                    <td className="p-3">{String(index).padStart(3, "0")}</td>
                                    <td className="p-4 capitalize">{item.ref_no  || "-"}</td>
                                    <td className="p-4">{formatterUtility(item.amount) || "-"}</td>
                                    <td className="p-4 capitalize">
                                        <div className={`w-[100px] py-2 ${item.order.delivery === "success" ? "bg-[#dff7ee]/80 text-pryclr" : item.order.delivery === "failed" ? "bg-[#c51236]/20 text-red-600" : "bg-yellow-100 text-yellow-600"} rounded-lg text-center font-normal mx-auto border border-pryClr/15`}>
                                            {item.order.delivery === "success" ? "Successful" : item.order.delivery === "failed" ? "Failed" : "Pending"}
                                        </div>
                                    </td>
                                    <td className="p-4 capitalize">{item.stockist?.name  || "-"}</td>
                                    <td className="p-4 capitalize">{item.stockist?.location  || "-"}</td>
                                    <td className="p-4 text-sm text-pryClr font-semibold">
                                        {formatISODateToCustom(item.created_at)}
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center p-8">No purchase wallet history found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsPurchaseHistory;