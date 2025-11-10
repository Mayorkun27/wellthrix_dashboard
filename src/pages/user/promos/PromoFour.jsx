import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';
import Confetti from 'react-confetti';
import { formatTransactionType } from '../../../utilities/formatterutility';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const PromoFour = ({ refresh, onComplete }) => {
    const { user, token, logout } = useUser();
    const [superCashProgress, setSuperCashProgress] = useState(null);
    const [isGettingProgress, setIsGettingProgress] = useState(false);
    const [qualifiedTiers, setQualifiedTiers] = useState([]);

    const stockistTiers = [
        { name: "prestige_stockist", target: 1_500_000, prize: 'Earn ₦75,000 + Extra ₦50,000 and 1 Duvet Set.' },
        { name: "royal_stockist", target: 3_000_000, prize: 'Earn ₦150,000 + Extra ₦100,000 and 1 Duvet Set' },
        { name: "imperial_stockist", target: 6_000_000, prize: 'Earn ₦300,000 + Extra ₦150,000 and 2 Duvet Sets' },
        { name: "grand_imperial", target: 20_000_000, prize: ' Earn ₦1,000,000 + Extra ₦400,000, plus 1 Duvet Set & a Microwave!' },
    ];

    useEffect(() => {
        const fetchSuperCashProgress = async () => {
            if (!user?.id) return;
            setIsGettingProgress(true);
            try {
                const response = await axios.get(`${API_URL}/api/supercash_users/${user.id}`, {
                    headers: { "Authorization": `Bearer ${token}` },
                });

                console.log("response", response)
                if (response.status === 200 && response.data.progress) {
                    const progress = response.data.progress;
                    setSuperCashProgress(progress);

                    if (progress.stockist_recruits >= 1 && Array.isArray(progress.stockist_plan)) {
                        const matchedTiers = progress.stockist_plan
                            .map(planName => stockistTiers.find(tier => tier.name === planName))
                            .filter(Boolean); // Filter out any undefined results
                        
                        if (matchedTiers.length > 0) {
                            setQualifiedTiers(matchedTiers);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch your progress:', error);
                if (error.response?.data?.message?.includes('unauthenticated')) {
                    logout();
                }
                toast.error(error.response?.data?.message || 'An error occurred fetching your progress.');
            } finally {
                setIsGettingProgress(false);
                if (onComplete) onComplete();
            }
        };

        if (token) fetchSuperCashProgress();
    }, [refresh, token, user?.id]);
    
    return (
        <>
            {isGettingProgress ? (
                <div className="text-center py-8 border border-black/10 rounded-lg">
                    <p className="text-gray-500">Loading WELLTHRIX SUPER CASH PROMO progress...</p>
                </div>
            ) : superCashProgress ? (
                <div className="border border-black/10 md:p-6 py-4 p-3 rounded-xl">
                    <h4 className='font-medium md:text-base text-sm mb-4 text-start'>WELLTHRIX SUPER CASH PROMO</h4>
                    
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 text-left">
                        {stockistTiers.map(tier => {
                            const isQualified = qualifiedTiers.some(qualified => qualified.name === tier.name);
                            return (
                                <div 
                                    key={tier.name} 
                                    className={`p-4 h-36 rounded-lg relative overflow-hidden transition-all duration-300 flex flex-col items-start justify-center ${isQualified ? 'border bg-green-100 border-green-400' : 'border-2 border-secClr '}`}
                                >
                                    {isQualified && (
                                        <Confetti 
                                            recycle={false} 
                                            numberOfPieces={200} 
                                            width={window.innerWidth / 2} 
                                            height={200} 
                                        />
                                    )}
                                    <p className={`font-semibold ${isQualified ? 'text-green-800' : 'text-pryClr'}`}>Refer a {formatTransactionType(tier.name, true)} {tier.name === "grand_imperial" && "Stockist"}</p>
                                    <p className={`${isQualified ? 'text-green-700' : 'text-gray-800'}`}>to <span className='font-bold'>{tier.prize}</span></p>

                                    {isQualified && (
                                        <div className="mt-2 pt-2 border-t border-green-300 w-full">
                                            <p className='font-bold text-green-800 text-end'>🎉 You Won This! 🎉</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 border border-black/10 rounded-lg">
                    <p className="text-gray-500">Could not load promo progress. Please try again later.</p>
                </div>
            )}
        </>
    )
}

export default PromoFour;
