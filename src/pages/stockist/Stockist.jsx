import React, { useState, useEffect } from 'react';
import { FaAngleLeft, FaAngleRight, FaWallet } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';
import { useUser } from '../../context/UserContext';
import PaginationControls from '../../utilities/PaginationControls';
import { formatISODateToCustom } from '../../utilities/Formatterutility';
import PickUps from './PickUps';
import OverviewCards from '../../components/cards/OverviewCards';
import { BsWallet2 } from 'react-icons/bs';
import { TbTruckDelivery } from 'react-icons/tb';
import History from './History';
import RegistrationOrders from './RegistrationOrders';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

const Stockist = () => {
  const { token, logout, user, refreshUser } = useUser();
  const stockistId = user?.id || 1;
  const [activeTab, setActiveTab] = useState('history'); // Toggle between 'pickup' and 'history' or 'register
  const perPage = 5;

  useEffect(() => {
    refreshUser()
  }, [])

  // Corrected statusLabels object with unique keys
  const statusLabels = {
    pending: { text: 'Pending', className: 'text-yellow-600' },
    failed: { text: 'Failed', className: ' text-red-600' },
    completed: { text: 'Completed', className: 'text-green-600' },
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm flex flex-col gap-8">
      {/* Header Section */}
      <div className="grid md:grid-cols-2 grid-cols-1">
        <OverviewCards
          amount={user?.stockist_balance || 0}
          icon={
            <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
              <TbTruckDelivery />
            </div>
          }
          walletType={"Stockist Balance"}
        />
        
      </div>

      {/* Tabs Section */}
      <div className="flex justify-end gap-4 overflow-x-scroll no-scrollbar">
        <button
          onClick={() => setActiveTab('pickup')}
          className={`px-4 h-[40px] font-semibold rounded-lg md:text-base text-sm whitespace-nowrap ${
            activeTab === 'pickup' ? 'bg-pryClr text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Pickup Orders
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`px-4 h-[40px] font-semibold rounded-lg md:text-base text-sm whitespace-nowrap ${
            activeTab === 'register' ? 'bg-pryClr text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Registration Orders
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 h-[40px] font-semibold rounded-lg md:text-base text-sm whitespace-nowrap ${
            activeTab === 'history' ? 'bg-pryClr text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Transaction History
        </button>
      </div>

      {/* Table Section */}
      <div className="w-full">
        {activeTab === 'pickup' ? (
          <PickUps />
        ) : activeTab === 'history' ? (
          <History />
        ) : (
          <RegistrationOrders />
        )}
      </div>
    </div>
  );
};

export default Stockist;