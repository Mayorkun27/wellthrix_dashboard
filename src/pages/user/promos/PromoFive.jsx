import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';
import Confetti from 'react-confetti';
import { FaKey, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ProgressBar = ({ current, required, label }) => {
    const percentage = required > 0 ? Math.min((current / required) * 100, 100) : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1 text-xs">
                <span>{label}</span>
                <span>{current} / {required}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-yellow-400 h-3 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const PromoCard = ({ title, reward, requirements, isQualified }) => {
    let progress = null;
    if (requirements.left_pv !== undefined) {
        const weakerLeg = Math.min(requirements.left_pv.current, requirements.right_pv.current);
        progress = <ProgressBar current={weakerLeg} required={requirements.left_pv.required} label="PV in Weaker Leg" />;
    } else if (requirements.super_stores !== undefined) {
        progress = <ProgressBar current={requirements.super_stores.current} required={requirements.super_stores.required} label="SuperStores Referred" />;
    } else if (requirements.imperial_stockists !== undefined) {
        progress = <ProgressBar current={requirements.imperial_stockists.current} required={requirements.imperial_stockists.required} label="Imperial Stockists" />;
    }

    return (
        <div className={`p-4 border-2 rounded-lg relative overflow-hidden transition-all ${isQualified ? 'bg-green-100 border-green-400' : 'border-secClr'}`}>
            {isQualified && <Confetti recycle={false} numberOfPieces={300} />}
            <div className="flex flex-col items-start gap-1 mb-5">
                <h3 className={`font-bold text-base ${isQualified ? 'text-green-800' : 'text-pryClr'}`}>{title}</h3>
                <p className={`font-semibold text-sm ${isQualified ? 'text-green-700' : 'text-gray-800'}`}>{reward}</p>
            </div>
            <div className="mt-4">{progress}</div>
            {isQualified && <p className="text-center text-sm border-t border-t-pryClr/20 pt-2 font-bold text-green-800 mt-3">🎉 Qualified! 🎉</p>}
        </div>
    );
};

const RequirementRow = ({ label, met }) => (
    <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
        <span className="text-xs font-medium">{label}</span>
        {met ? (
            <FaCheckCircle className="text-green-500" />
        ) : (
            <FaTimesCircle className="text-red-500" />
        )}
    </div>
);


const PromoFive = ({ refresh, onComplete }) => {
    const { user, token, logout } = useUser();
    const [promoData, setPromoData] = useState(null);
    const [isGettingProgress, setIsGettingProgress] = useState(false);

    useEffect(() => {
        const fetchMegaDriveCarPromo = async () => {
            if (!user?.id) return;
            setIsGettingProgress(true);
            try {
                const response = await axios.get(`${API_URL}/api/car-promo/user/${user.id}/check`, {
                    headers: { "Authorization": `Bearer ${token}` },
                });
                if (response.status === 200 && response.data.data) {
                    setPromoData(response.data.data);
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

        if (token) fetchMegaDriveCarPromo();
    }, [refresh, token, user?.id]);

    const promoTiers = [
        { id: 'emerald', title: 'EMERALD KEYS', reward: 'Qualify for ₦12million Car' },
        { id: 'golden', title: 'GOLDEN KEYS', reward: 'Qualify for ₦8million Car' },
        { id: 'super', title: 'SUPER KEYS', reward: 'Get a Mini Car (₦6million)' },
    ];
    
    return (
        <div className="p-4 border border-black/10 rounded-xl space-y-6">
            <h3 className='font-bold text-xl'>MEGA DRIVE CAR PROMO</h3>

            {isGettingProgress ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">Loading your promo progress...</p>
                </div>
            ) : promoData ? (
                <>
                    <div className="grid lg:grid-cols-3 gap-4">
                        {promoTiers.map(tier => (
                            <PromoCard
                                key={tier.id}
                                title={tier.title}
                                reward={tier.reward}
                                requirements={promoData.qualifications[tier.id].requirements}
                                isQualified={promoData.qualifications[tier.id].qualified}
                            />
                        ))}
                    </div>
                    <div>
                        <h4 className='font-semibold mb-3 text-start'>General Requirements</h4>
                        <div className="grid lg:grid-cols-2 items-center gap-4">
                            <RequirementRow 
                                label="Directly sponsor 5 new accounts monthly" 
                                met={promoData.qualifications.emerald.requirements.monthly_sponsors.met} // Assuming it's the same for all
                            />
                            <RequirementRow 
                                label="Sponsor at least 5 Crown Packages during the promo" 
                                met={promoData.qualifications.emerald.requirements.crown_packages.met} // Assuming it's the same for all
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">Could not load promo data.</p>
                </div>
            )}
        </div>
    );
}

export default PromoFive;