import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';
import Confetti from 'react-confetti';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const PromoTwo = ({ refresh, onComplete }) => {
    const { user, token, logout } = useUser();
    const [doublePowerProgress, setDoublePowerProgress] = useState(null);
    const [isGettingProgress, setIsGettingProgress] = useState(false);
    const [hasQualified, setHasQualified] = useState(false);
    const [qualifiedPrize, setQualifiedPrize] = useState('');

    const pvTiers = [
        { target: 5000, prize: 'iPhone 13 Pro Max' },
        { target: 4000, prize: 'Smart TV' },
        { target: 2200, prize: 'Brand new Phone' },
        { target: 1400, prize: 'Electric Jug' },
    ];

    const crownTiers = [
        { target: 10, prize: 'A Grand Prize' },
        { target: 5, prize: 'A Smart TV' },
        { target: 3, prize: 'A Phone' },
        { target: 1, prize: 'Electric Jug' },
    ];

    useEffect(() => {
        const fetchDoublePowerProgress = async () => {
            if (!user?.id) return;
            setIsGettingProgress(true);
            try {
                const response = await axios.get(`${API_URL}/api/double_power/progress/${user.id}`, {
                    headers: { "Authorization": `Bearer ${token}` },
                });

                console.log("response", response)

                if (response.status === 200) {
                    setDoublePowerProgress(response.data.progress);
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

        if (token) fetchDoublePowerProgress();
    }, [refresh, token, user?.id]);

    useEffect(() => {
        if (doublePowerProgress) {
            const lesserLegPv = Math.min(Number(doublePowerProgress.left_pv), Number(doublePowerProgress.right_pv));
            const sponsoredCrowns = Number(doublePowerProgress.crown_directs);

            let qualified = false;
            let prize = '';

            // Check PV tiers from highest to lowest
            for (const tier of pvTiers) {
                if (lesserLegPv >= tier.target) {
                    qualified = true;
                    prize = tier.prize;
                    break; 
                }
            }

            // Check Crown tiers only if not already qualified by PV
            if (!qualified) {
                for (const tier of crownTiers) {
                    if (sponsoredCrowns >= tier.target) {
                        qualified = true;
                        prize = tier.prize;
                        break;
                    }
                }
            }

            setHasQualified(qualified);
            setQualifiedPrize(prize);
        }
    }, [doublePowerProgress]);

    const ProgressBar = ({ label, value, target }) => {
        const percentage = target > 0 ? Math.min((value / target) * 100, 100) : 0;
        return (
            <div>
                <div className='flex justify-between items-center mb-1'>
                    <span className='text-xs font-medium text-gray-700'>{label}</span>
                    <span className='text-xs font-medium text-gray-700'>{value}/{target}</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2.5'>
                    <div className='bg-pryClr h-2.5 rounded-full' style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        );
    };

    const lesserLegPv = doublePowerProgress ? Math.min(Number(doublePowerProgress.left_pv), Number(doublePowerProgress.right_pv)) : 0;
    const sponsoredCrowns = doublePowerProgress ? Number(doublePowerProgress.crown_directs) : 0;

    return (
        <>
            {isGettingProgress ? (
                <div className="text-center py-8 border border-black/10 rounded-lg">
                    <p className="text-gray-500">Loading WELLTHRIX DOUBLE POWER PROMO progress...</p>
                </div>
            ) : doublePowerProgress ? (
                <div className="border border-black/10 md:p-4 py-4 p-2 rounded-xl">
                    <h4 className='font-medium md:text-base text-sm mb-4'>WELLTHRIX DOUBLE POWER PROMO</h4>
                    
                    {hasQualified && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative text-center mb-4 overflow-hidden">
                            <Confetti 
                                width={window.innerWidth}
                                height={window.innerHeight}
                                recycle={false}
                                numberOfPieces={200}
                                run={hasQualified}
                            />
                            <strong className='font-bold text-green-800'>Congratulations, {user?.username}! 🎉</strong>
                            <span className='block sm:inline text-green-700'>You have qualified to win a <span className='font-bold'>{qualifiedPrize}</span>!</span>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">
                        {/* Option A: PV Accumulation */}
                        <div className="border-2 p-4 rounded-lg border-secClr flex flex-col gap-4">
                            <h5 className="font-bold lg:text-lg text-base capitalize">New PV Accumulation</h5>
                            {pvTiers.map(tier => (
                                <ProgressBar
                                    key={tier.target}
                                    label={`Win ${tier.prize}`}
                                    value={lesserLegPv}
                                    target={tier.target}
                                />
                            ))}
                            <div className="mt-4">
                                <div className='flex justify-between items-center'>
                                    <span className='text-xs font-medium text-gray-700'>*Left PV: {doublePowerProgress && (doublePowerProgress.left_pv)}</span>
                                    <span className='text-xs font-medium text-gray-700'>*Right PV: {doublePowerProgress && (doublePowerProgress.right_pv)}</span>
                                </div>
                                <small className='text-xs font-medium text-gray-700'>Note: The stated PV is to be accumulated on both legs to qualify.</small>
                            </div>
                        </div>

                        {/* Option B: Crown Rush */}
                        <div className="border-2 p-4 rounded-lg border-secClr flex flex-col gap-4">
                            <h5 className="font-bold lg:text-lg text-base capitalize">CROWN RUSH</h5>
                            {crownTiers.map(tier => (
                                <ProgressBar
                                    key={tier.target}
                                    label={`Sponsor ${tier.target} Crown(s) for ${tier.prize}`}
                                    value={sponsoredCrowns}
                                    target={tier.target}
                                />
                            ))}
                        </div>
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

export default PromoTwo;