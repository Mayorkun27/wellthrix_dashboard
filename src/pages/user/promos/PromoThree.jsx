import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';
import Confetti from 'react-confetti';
import { formatterUtility } from '../../../utilities/formatterutility';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const PromoThree = ({ refresh, onComplete }) => {
    const { user, token, logout } = useUser();
    const [iWinProgress, setIWinProgress] = useState(null);
    const [isGettingProgress, setIsGettingProgress] = useState(false);
    const [qualifiedTier, setQualifiedTier] = useState(null);

    const stockistTiers = [
        { name: "grand_imperial", target: 20000000, prize: 'Brand new iPhone 14' },
        { name: "imperial_stockist", target: 6000000, prize: '43-inch Smart TV' },
        { name: "royal_stockist", target: 3000000, prize: 'Water Dispenser' },
        { name: "prestige_stockist", target: 1500000, prize: 'Brand new Phone' },
    ];

    useEffect(() => {
        const fetchIWinProgress = async () => {
            if (!user?.id) return;
            setIsGettingProgress(true);
            try {
                const response = await axios.get(`${API_URL}/api/double_power/progress/${user.id}`, {
                    headers: { "Authorization": `Bearer ${token}` },
                });

                if (response.status === 200 && response.data.progress) {
                    const progress = response.data.progress;
                    setIWinProgress(progress);

                    if (response.data.stockist_plan) {
                        const matchedTier = stockistTiers.find(tier => tier.name === response.data.stockist_plan);
                        if (matchedTier) {
                            setQualifiedTier(matchedTier);
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

        if (token) fetchIWinProgress();
    }, [refresh, token, user?.id]);

    return (
        <>
            {isGettingProgress ? (
                <div className="text-center py-8 border border-black/10 rounded-lg">
                    <p className="text-gray-500">Loading WELLTHRIX iWIN PROMO progress...</p>
                </div>
            ) : iWinProgress ? (
                <div className="border border-black/10 md:p-6 py-4 p-3 rounded-xl">
                    <h4 className='font-medium md:text-base text-sm mb-4'>WELLTHRIX iWIN PROMO</h4>
                    
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 text-left">
                        {stockistTiers.map(tier => {
                            const isQualified = qualifiedTier?.name === tier.name;
                            return (
                                <div 
                                    key={tier.name} 
                                    className={`p-4 rounded-lg relative overflow-hidden transition-all duration-300 ${isQualified ? 'border bg-green-100 border-green-400' : 'border-2 border-secClr '}`}
                                >
                                    {isQualified && (
                                        <Confetti 
                                            recycle={false} 
                                            numberOfPieces={200} 
                                            width={window.innerWidth / 2} 
                                            height={200} 
                                        />
                                    )}
                                    <p className={`font-semibold ${isQualified ? 'text-green-800' : 'text-pryClr'}`}>Refer a {formatterUtility(tier.target)} Stockist</p>
                                    <p className={`${isQualified ? 'text-green-700' : 'text-gray-800'}`}>Win a <span className='font-bold'>{tier.prize}</span></p>

                                    {isQualified && (
                                        <div className="mt-2 pt-2 border-t border-green-300">
                                            <p className='font-bold text-green-800 text-center'>🎉 You Won This! 🎉</p>
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
    );
}

export default PromoThree;
