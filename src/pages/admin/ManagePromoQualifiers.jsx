import React, { useState } from 'react'
import PromoFour from './promos/PromoFour';
import PromoFive from './promos/PromoFive';

const ManagePromoQualifiers = () => {
    const [activeTab, setActiveTab] = useState('promofive');

    const renderContent = () => {
        switch (activeTab) {
            case 'promofour':
                return <PromoFour />;
            case 'promofive':
                return <PromoFive />;
            default:
                return <PromoFour />;
        }
    };

    return (
        <div className='space-y-6'>
            <div className="flex items-center gap-10 overflow-x-auto snap-x snap-mandatory hr-scroll py-4 rounded-xl bg-white px-6">
                <button
                    className={`text-lg md:text-xl whitespace-nowrap font-medium cursor-pointer pb-1 snap-center ${activeTab === 'promofour' ? 'text-pryClr border-b-2 font-bold border-pryClr' : 'text-pryClr/60 transition-all duration-300'
                    }`}
                    onClick={() => setActiveTab('promofour')}
                >
                    Promo Four
                </button>
                <button
                    className={`text-lg md:text-xl whitespace-nowrap font-medium cursor-pointer pb-1 snap-center ${activeTab === 'promofive' ? 'text-pryClr border-b-2 font-bold border-pryClr' : 'text-pryClr/60 transition-all duration-300'
                    }`}
                    onClick={() => setActiveTab('promofive')}
                >
                    Promo Five
                </button>
            </div>
            <div className="bg-white shadow-md rounded-xl">
                <div>{renderContent()}</div>
            </div>
        </div>
    )
}

export default ManagePromoQualifiers