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

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

const Stockist = () => {
  const { token, logout, user } = useUser();
  const stockistId = user?.id || 1;
  const [activeTab, setActiveTab] = useState('history'); // Toggle between 'pickup' and 'history'
  const perPage = 5;

  // Mock transaction history data
  const transactionHistory = [
    { id: 1, amount: 5000, month: 'January', type: 'Bonus', status: 'completed', orderId: 'ORD123', date: '2025-01-10' },
    { id: 2, amount: 3000, month: 'February', type: 'Move', status: 'pending', orderId: 'ORD124', date: '2025-02-15' },
    { id: 3, amount: 7000, month: 'March', type: 'Bonus', status: 'failed', orderId: 'ORD125', date: '2025-03-20' },
    { id: 4, amount: 4000, month: 'April', type: 'Move', status: 'completed', orderId: 'ORD126', date: '2025-04-05' },
    { id: 5, amount: 6000, month: 'May', type: 'Bonus', status: 'pending', orderId: 'ORD127', date: '2025-05-12' },
  ];

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
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setActiveTab('pickup')}
          className={`px-4 py-2 font-semibold rounded-lg ${
            activeTab === 'pickup' ? 'bg-pryClr text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Pickup Orders
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-semibold rounded-lg ${
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
        ) : (
          <History />
        )}
      </div>
    </div>
  );
};

export default Stockist;