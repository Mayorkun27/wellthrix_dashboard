import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import { FaCheck, FaLock, FaStar, FaGift } from 'react-icons/fa';
import { formatterUtility } from '../../../utilities/formatterutility';
import { toast } from 'sonner';
import Modal from '../../../components/modals/Modal';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const RewardModal = ({ rank, onClaim, onClose }) => {
    const [isClaiming, setIsClaiming] = useState(false);

    const handleClaim = async (choice) => {
        setIsClaiming(true);
        try {
            await onClaim(rank.id, choice);
            toast.success(`You have successfully claimed your ${choice === 'bonus' ? 'bonus amount' : 'extra reward'}!`);
            onClose();
        } catch (error) {
            toast.error("Failed to claim reward. Please try again.");
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <Modal
            onClose={onClose}
        >
            <h3 className="text-xl font-bold mb-4">Claim Your <span className='text-pryClr'>{rank.rank_title}</span> Reward!</h3>
            <p className="mb-6">Congratulations! Please choose one of the following rewards:</p>
            <div className="grid md:grid-cols-2 gap-4 items-center">
                <button 
                    onClick={() => handleClaim('bonus')}
                    disabled={isClaiming}
                    className='p-4 border border-pryClr rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    <p className='font-bold text-lg'>{formatterUtility(rank.bonus_amount)}</p>
                    <p className='text-sm'>Cash Bonus</p>
                </button>
                <button 
                    onClick={() => handleClaim('extra')}
                    disabled={isClaiming}
                    className='p-4 border rounded-lg cursor-pointer bg-pryClr text-white disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    <p className='font-bold text-lg'>{rank.extra_reward}</p>
                    <p className='text-sm'>Special Reward</p>
                </button>
            </div>
            {isClaiming && <div className='text-center mt-4 flex items-center rounded-full justify-center'>
                <div className="size-6 border-3 border-pryClr border-t-transparent animate-spin"></div>
                Claiming...
            </div>}
            <button onClick={onClose} disabled={isClaiming} className="mt-6 w-full py-3 bg-gray-200 rounded-lg disabled:opacity-50">
                Close
            </button>
        </Modal>
    );
};


const RankTier = ({ title, bonus, pvNeeded, extra, status, progress = 0 }) => {
    const getStatusStyles = () => {
        switch (status) {
            case 'attained':
                return {
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    borderColor: 'border-green-400',
                    icon: <FaCheck className="text-green-500" />,
                };
            case 'current':
                return {
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800',
                    borderColor: 'border-blue-400',
                    icon: <FaStar className="text-blue-500" />,
                };
            case 'next':
                return {
                    bgColor: 'bg-yellow-50',
                    textColor: 'text-yellow-800',
                    borderColor: 'border-yellow-400',
                    icon: <FaStar className="text-yellow-500" />,
                };
            default:
                return {
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-500',
                    borderColor: 'border-gray-300',
                    icon: <FaLock className="text-gray-400" />,
                };
        }
    };

    const styles = getStatusStyles();

    return (
        <div className={`p-4 rounded-lg border ${styles.borderColor} ${styles.bgColor} transition-all`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {styles.icon}
                    <h3 className={`font-bold text-lg ${styles.textColor}`}>{title}</h3>
                </div>
                {status === 'attained' && <span className="text-xs font-semibold px-2 py-1 bg-green-200 text-green-800 rounded-full">Achieved</span>}
                {status === 'current' && <span className="text-xs font-semibold px-2 py-1 bg-blue-200 text-blue-800 rounded-full">Current</span>}
            </div>
            <p className={`text-sm font-semibold ${styles.textColor}`}>{formatterUtility(bonus)} Bonus{extra && ` or ${extra}`}</p>
            <p className={`text-xs ${styles.textColor}`}>Requires: {formatterUtility(pvNeeded, true)} PV on weaker leg</p>

            {status === 'next' && (
                <div className="mt-3">
                    <div className="w-full bg-black/80 rounded-full h-4 px-0.5 flex flex-col justify-center">
                        <div className="bg-accClr h-3 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-xs text-right mt-1">{progress.toFixed(2)}% Complete</p>
                </div>
            )}
        </div>
    );
};

const MyRankProgress = () => {
    const { token, miscellaneousDetails, user } = useUser();
    const [achievedRanks, setAchievedRanks] = useState([]);
    const [pendingChoiceRank, setPendingChoiceRank] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const rankTiers = [
        { title: 'Bronze Leader', bonus_amount: 100000, pv_needed: 1500, plan: 3 },
        { title: 'Silver Leader', bonus_amount: 300000, pv_needed: 5000, plan: 4 },
        { title: 'Gold Leader', bonus_amount: 1000000, pv_needed: 15000, plan: 5, extra: 'Iphone' },
        { title: 'Platinum Leader', bonus_amount: 6000000, pv_needed: 55000, plan: 6, extra: 'Car' },
        { title: 'Diamond Executive', bonus_amount: 8000000, pv_needed: 110000, plan: 6, extra: 'Car' },
        { title: 'Blue Diamond', bonus_amount: 15000000, pv_needed: 180000, plan: 7, extra: 'Car' },
        { title: 'Black Diamond', bonus_amount: 20000000, pv_needed: 400000, plan: 7, extra: 'Super Car' },
        { title: 'Royal Diamond', bonus_amount: 25000000, pv_needed: 1300000, plan: 7, extra: 'Land' },
        { title: 'Crown Ambassador', bonus_amount: 50000000, pv_needed: 2100000, plan: 7, extra: 'Bungalow' },
        { title: 'Double Crown Ambassador', bonus_amount: 120000000, pv_needed: 4500000, plan: 7, extra: 'Duplex' },
    ];

    const fetchMyRankAchievement = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/rank/my-achievements`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const achievements = response.data.data || [];
            setAchievedRanks(achievements);
            
            const pendingRank = achievements.find(rank => rank.status === 'pending' && rank.choice === null && rank.extra_reward);
            setPendingChoiceRank(pendingRank || null);

        } catch (err) {
            console.error("Failed to fetch user rank:", err);
        }
    };

    const handleClaimReward = async (rankId, choice) => {
        try {
            await axios.post(`${API_URL}/api/rank/pick/${rankId}`, 
                { choice },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchMyRankAchievement();
        } catch (error) {
            console.error("Failed to claim reward:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchMyRankAchievement();
    }, [token]);

    const currentRankIndex = rankTiers.findIndex(tier => tier.title.toLowerCase() === user?.rank?.toLowerCase());
    const weakerLegPV = Math.min(miscellaneousDetails?.totalPVLeft || 0, miscellaneousDetails?.totalPVRight || 0);

    const nextRank = currentRankIndex !== -1 && currentRankIndex < rankTiers.length - 1 
        ? rankTiers[currentRankIndex + 1] 
        : null;

    const progressPercentage = nextRank ? Math.min((weakerLegPV / nextRank.pv_needed) * 100, 100) : 0;

    const statItems = [
        { 
          id: 1,  
          title: 'Left PV', 
          value: miscellaneousDetails?.totalPVLeft 
        },
        { 
          id: 2,  
          title: 'PV required to next rank', 
          value: (Number(nextRank?.pv_needed) - Number(weakerLegPV)) || 0
        },
        { 
          id: 3,  
          title: 'Right PV', 
          value: miscellaneousDetails?.totalPVRight 
        },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">My Rank Progression</h2>

            <div>
                <h3 className="font-semibold mb-2 text-lg">Pv Summary</h3>
                <div className="grid lg:grid-cols-3 md:grid-cols-3 gap-4">
                    {statItems.map((item) => (
                        <div
                            key={item.id}
                            className='w-full gap-2 flex flex-row items-center font-bold bg-pryClr rounded-lg shadow-lg p-4'
                        >
                            <div className="flex flex-col w-full">
                                <div className="flex items-center justify-between w-full">
                                    <p className='md:text-xs text-xs text-white'>{item.title}</p>
                                    <p className='md:text-xs text-xs text-white'>{(weakerLegPV === item.value) && "Compared leg"}</p>
                                </div>
                                <p className='text-2xl md:text-3xl text-white'>{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {pendingChoiceRank && (
                <div className="p-4 bg-accClr shadow-md border border-pryClr/20 rounded-lg flex items-center justify-between">
                    <div className='flex items-center gap-2'>
                        <FaGift className="text-white animate-bounce" size={24} />
                        <div>
                            <h4 className='font-bold text-white'>You have an Unclaimed Rank Reward!</h4>
                            <p className='text-sm text-white'>Claim your reward for achieving the {pendingChoiceRank.rank_title} rank.</p>
                        </div>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-pryClr text-white font-semibold rounded-md">
                        Claim Now
                    </button>
                </div>
            )}
            
            {isModalOpen && pendingChoiceRank && (
                <RewardModal 
                    rank={pendingChoiceRank}
                    onClaim={handleClaimReward}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {nextRank && (
                <div>
                    <h3 className="font-semibold mb-2 text-lg">Your Next Rank</h3>
                    <RankTier
                        title={nextRank.title}
                        bonus={nextRank.bonus_amount}
                        pvNeeded={nextRank.pv_needed}
                        extra={nextRank.extra}
                        status="next"
                        progress={progressPercentage}
                    />
                </div>
            )}

            <div>
                <h3 className="font-semibold mb-2 text-lg">All Ranks</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {rankTiers.map((tier, index) => {
                        let status = 'locked';
                        if (currentRankIndex > index) {
                            status = 'attained';
                        } else if (currentRankIndex === index) {
                            status = 'current';
                        } else if (currentRankIndex + 1 === index) {
                            return null;
                        }

                        return (
                            <RankTier
                                key={tier.title}
                                title={tier.title}
                                bonus={tier.bonus_amount}
                                pvNeeded={tier.pv_needed}
                                extra={tier.extra}
                                status={status}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MyRankProgress;