import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti';
import { formatterUtility } from '../../../utilities/Formatterutility';
import { useUser } from '../../../context/UserContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const PromoOne = ({ refresh, onComplete }) => {
    const { user, token } = useUser();
    const [tripProgress, setTripProgress] = useState([]);
    const [isGettingProgress, setIsGettingProgress] = useState(false);
    const [hasQualified, setHasQualified] = useState(false);


    const fetchTripProgress = async () => {
        setIsGettingProgress(true)
        try {
            const response = await axios.get(`${API_URL}/api/cruise/progress/${user?.id}`, {
                headers: {
                "Authorization" : `Bearer ${token}`,
                }
            })

            // console.log("trip response", response)
            if (response.status === 200) {
                setTripProgress(response.data.progress)
            }

        } catch (error) {
            console.error('Failed to fetch your progress:', error);
            if (error.response?.data?.message?.includes('unauthenticated')) {
                logout();
            }
            toast.error(error.response?.data?.message || 'An error occurred fetching your progress.');
        } finally {
            setIsGettingProgress(false);
            onComplete();
        }
    }

    useEffect(() => {
        if (token) fetchTripProgress();
    }, [refresh, token])

    const getProgressDetails = (progressString) => {
        if (typeof progressString !== 'string') return { value: 0, target: 0, percentage: 0 };
        const match = progressString.match(/(\d+)\/(\d+)\s\((\d+)%\)/);
        if (match) {
        return {
            value: parseInt(match[1], 10),
            target: parseInt(match[2], 10),
            percentage: parseInt(match[3], 10),
        };
        }
        return { value: 0, target: 0, percentage: 0 };
    };

    const ProgressBar = ({ label, progress, value, target }) => (
        <div className=''>
            <div className='flex justify-between items-center mb-1'>
                <span className='text-xs font-medium text-gray-700'>{label}</span>
                <span className='text-xs font-medium text-gray-700'>{value}/{target}</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2.5'>
                <div className='bg-pryClr h-2.5 rounded-full' style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );

    // Add a new useEffect to check for qualification
    useEffect(() => {
        if (tripProgress.leadership || tripProgress.crown || tripProgress.stockist) {
            checkQualification();
        }
    }, [tripProgress, user?.repurchase_pv]);
    
    const checkQualification = () => {
        let qualified = false;
        const personalPV = (Number(user?.repurchase_pv) - Number(user?.campaign_pv)) || 0;
        const isRepurchaseComplete = personalPV >= 40;
    
        if (tripProgress.leadership) {
            const leadershipRecruitsPV = getProgressDetails(tripProgress.leadership.recruits_pv).percentage;
            const leadershipRecruits = getProgressDetails(tripProgress.leadership.recruits).percentage;
            const lesserLegPV = getProgressDetails(tripProgress.leadership.lesser_pv).percentage;
    
            if (leadershipRecruitsPV === 100 && leadershipRecruits === 100 && lesserLegPV === 100) {
                qualified = true;
            }
        }
    
        if (tripProgress.crown) {
            const crownProgress = getProgressDetails(tripProgress.crown).percentage;
            if (crownProgress >= 100) {
                qualified = true;
            }
        }
    
        if (tripProgress.stockist) {
            const stockistProgress = getProgressDetails(tripProgress.stockist).percentage;
            if (stockistProgress >= 100) {
                qualified = true;
            }
        }
    
        setHasQualified(qualified && isRepurchaseComplete);
    };

    return (
        <>
            {isGettingProgress ? (
                <div className="text-center py-8 border border-black/10 rounded-lg">
                    <p className="text-gray-500">Loading WELLTHRIX 042 CRUISE @ The Elite Experience progress...</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-6 border border-black/10 md:p-4 py-4 p-2 rounded-xl">
                    <div className="md:col-span-3 col-span-1 flex items-center justify-between">
                        <h4 className='font-medium md:text-base text-sm'>WELLTHRIX 042 CRUISE @ The Elite Experience</h4>
                        <div className="flex flex-col items-end">
                            <h3 className='font-bold text-accClr md:text-3xl text-2xl'>{formatterUtility(500000)}</h3>
                            <small className='md:text-xs text-[10px]'>Trip Value per Person</small>
                        </div>
                    </div>
                    {hasQualified && (
                        <div className="md:col-span-3 col-span-1 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative text-center mb-4 overflow-hidden">
                            <Confetti
                                width={window.innerWidth}
                                height={window.innerHeight}
                                recycle={false}
                                numberOfPieces={200}
                                run={hasQualified}
                            />
                            <strong className="font-bold">Congratulations {user?.username}! 🎉</strong>
                            <span className="block sm:inline"> You have qualified for the promo trip!</span>
                        </div>
                    )}
                    {/* {tripProgress.leadership && ( */}
                        <div className="border-2 p-4 rounded-[inherit] border-secClr flex flex-col">
                        <h5 className="font-bold lg:text-lg text-base mb-2 capitalize">Leadership Builder</h5>
                        <div className='flex-grow space-y-4'>
                            <div className="space-y-2">
                                <ProgressBar
                                    label="Lesser Leg PV"
                                    progress={tripProgress.leadership ? getProgressDetails(tripProgress.leadership.lesser_pv).percentage : "0"}
                                    value={tripProgress.leadership ? getProgressDetails(tripProgress.leadership.lesser_pv).value : "0"}
                                    target={tripProgress.leadership ? getProgressDetails(tripProgress.leadership.lesser_pv).target : 3600}
                                />
                                <div className='flex justify-between items-center mb-1'>
                                    <span className='text-xs font-medium text-gray-700'>*Higher leg PV</span>
                                    <span className='text-xs font-medium text-gray-700'>{tripProgress.leadership && tripProgress.leadership.higher_pv}</span>
                                </div>
                            </div>
                            <ProgressBar
                                label="New Recruits"
                                progress={tripProgress.leadership ? getProgressDetails(tripProgress.leadership.recruits).percentage : "0"}
                                value={tripProgress.leadership ? getProgressDetails(tripProgress.leadership.recruits).value : "0"}
                                target={tripProgress.leadership ? getProgressDetails(tripProgress.leadership.recruits).target : 3}
                            />
                            <ProgressBar
                                label="Recruits PV"
                                progress={tripProgress.leadership ? getProgressDetails(tripProgress.leadership.recruits_pv).percentage : "0"}
                                value={tripProgress.leadership ? getProgressDetails(tripProgress.leadership.recruits_pv).value : "0"}
                                target={tripProgress.leadership ? getProgressDetails(tripProgress.leadership.recruits_pv).target : 180}
                            />
                        </div>
                        </div>
                    {/* )} */}
                    {
                    // tripProgress.crown && 
                    (() => {
                        const sponsoredCrowns = tripProgress.crown ? getProgressDetails(tripProgress.crown).value : 0;
                        return (
                            <div className="border-2 p-4 rounded-[inherit] border-secClr flex flex-col">
                                <h5 className="font-bold lg:text-lg text-base mb-2 capitalize">Crown Path</h5>
                                <div className='flex-grow space-y-4'>
                                <ProgressBar
                                    label="Sponsor 4 (1 Slot)"
                                    progress={sponsoredCrowns ? Math.min((sponsoredCrowns / 4) * 100, 100) : 0}
                                    value={sponsoredCrowns || 0}
                                    target={4}
                                />
                                <ProgressBar
                                    label="Sponsor 8 (2 Slots: 1 VIP)"
                                    progress={sponsoredCrowns ? Math.min((sponsoredCrowns / 8) * 100, 100) : 0}
                                    value={sponsoredCrowns || 0}
                                    target={8}
                                />
                                </div>
                                <p className="text-[10px] text-gray-500 md:mt-auto mt-6">Sponsor 4 for 1 slot, or 8 for 2 slots (1 VIP).</p>
                            </div>
                        );
                    })()}
                    {/* {tripProgress.stockist && ( */}
                        <div className="border-2 p-4 rounded-[inherit] border-secClr flex flex-col">
                            <h5 className="font-bold lg:text-lg text-base mb-2 capitalize">VIP Stockist Path</h5>
                            <div className='flex-grow space-y-4'>
                                <ProgressBar
                                label="Stockists Referred"
                                progress={tripProgress.stockist ? getProgressDetails(tripProgress.stockist).percentage : 0}
                                value={tripProgress.stockist ? getProgressDetails(tripProgress.stockist).value : 0}
                                target={tripProgress.stockist ? getProgressDetails(tripProgress.stockist).target : 1}
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 md:mt-auto mt-6">Note: Refer a Royal Stockist for 1 VIP slot, Imperial Stockist for 2 VIP slot, or Grand Imperial Stockist for 3 VIP slot.</p>
                        </div>
                    {/* )} */}
                    {user?.repurchase_pv && user?.campaign_pv && (
                        <div className="md:col-span-3 col-span-1 space-y-4">
                        <ProgressBar
                            label="Personal Repurchase PV"
                            progress={(Number(user?.repurchase_pv) - Number(user?.campaign_pv)) ? Math.min(((Number(user?.repurchase_pv) - Number(user?.campaign_pv)) / 40) * 100, 100) : 0}
                            value={Math.ceil(Number(user?.repurchase_pv) - Number(user?.campaign_pv)) || 0}
                            target={40}
                        />
                        <p className="text-xs text-gray-500 mt-auto">Note: The 40PV Personal Repurchase is mandatory for all paths.</p>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default PromoOne