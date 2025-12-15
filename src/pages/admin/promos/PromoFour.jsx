import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';
import { formatTransactionType } from '../../../utilities/formatterutility';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const PromoFour = () => {
    const { user, token, logout } = useUser();
    const [allQualifiers, setAllQualifiers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [perPage, setPerPage] = useState(5);

    const stockistTiers = [
        { name: "prestige_stockist", target: 1_500_000, prize: '₦75,000, Extra ₦50,000, 1 Duvet Set.' },
        { name: "royal_stockist", target: 3_000_000, prize: '₦150,000, Extra ₦100,000, 1 Duvet Set' },
        { name: "imperial_stockist", target: 6_000_000, prize: '₦300,000, Extra ₦150,000, 2 Duvet Sets' },
        { name: "grand_imperial", target: 20_000_000, prize: ' ₦1,000,000, Extra ₦400,000, 1 Duvet Set, a Microwave.' },
    ];

    const getRewardForStockistPlan = (planName) => {
        const tier = stockistTiers.find(tier => tier.name === planName);
        return tier ? tier.prize : "N/A";
    };

    const fetchQualifiers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/admin/super-cash/qualified`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    page: currentPage,
                    perPage: perPage
                }
            });

            console.log("PromoFour qualifiers Response:", response);

            if (response.status === 200) {
                setAllQualifiers(response.data);
                setLastPage(response.data.last_page);
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
                <h3 className='text-xl font-semibold'>{allQualifiers.promo_name}</h3>
            </div>
            <table className="min-w-full">
                <thead>
                    <tr className="text-black/70 text-[12px] uppercase text-center border-b border-black/20">
                        <th className="p-5">S/N</th>
                        <th className="p-5">Username</th>
                        <th className="p-5">Email</th>
                        <th className="p-5 text-end">Stockist referred & Reward</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="7" className="text-center p-8">Loading...</td>
                        </tr>
                    ) : allQualifiers.qualified_users.length > 0 ? (
                        allQualifiers.qualified_users.map((qualifier, index) => {
                            const serialNumber = (currentPage - 1) * perPage + (index + 1);
                            const stockistPlans = JSON.parse(qualifier.stockist_plan || '[]');
                            return (
                                <tr
                                    key={qualifier.id}
                                    className="hover:bg-gray-50 text-sm border-b border-black/10 text-center"
                                >
                                    <td className="p-3">{String(serialNumber).padStart(3, "0")}</td>
                                    <td className="p-4">{qualifier.username || "-"}</td>
                                    <td className="p-4">{qualifier.email || "-"}</td>
                                    <td className="p-4 text-xs text-end text-pryClr font-semibold whitespace-nowrap">
                                        {stockistPlans.map((plan, idx) => (
                                            <p key={idx}>{formatTransactionType(plan, true)} - {getRewardForStockistPlan(plan)}</p>
                                        ))}
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center p-8">No qualifiers found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default PromoFour
