import React, { useState, useEffect } from 'react';
import { FaAngleLeft, FaAngleRight, FaWallet } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';
import { useUser } from '../../context/UserContext';
import PaginationControls from '../../utilities/PaginationControls';
import { formatISODateToCustom } from '../../utilities/Formatterutility';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

const Stockist = () => {
  const { token, logout, user } = useUser();
  const stockistId = user?.id || 1;
  const [pickupOrders, setPickupOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pickupPage, setPickupPage] = useState(1);
  const [totalPickupPages, setTotalPickupPages] = useState(1);
  const [activeTab, setActiveTab] = useState('pickup'); // Toggle between 'pickup' and 'history'
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

  const fetchPickupOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/stockists/${stockistId}/user`,
        { page: pickupPage, perPage: perPage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('response', response);
      console.log('response', response.data.transactions);

      if (response.status === 200) {
        const { transactions, current_page, last_page } = response.data;
        setPickupOrders(transactions);
        setPickupPage(current_page);
        setTotalPickupPages(last_page);
        toast.success('Pickup orders fetched successfully');
      } else {
        throw new Error(response.data.message || 'Failed to fetch pickup orders.');
      }
    } catch (error) {
      if (error.response?.data?.message?.includes('unauthenticated')) {
        logout();
        toast.error('Session expired. Please login again.');
      }
      console.error('Pickup orders fetch error:', error);
      toast.error(error.response?.data?.message || 'An error occurred fetching pickup orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && stockistId && activeTab === 'pickup') {
      fetchPickupOrders();
    }
  }, [pickupPage, token, stockistId, activeTab]);

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm flex flex-col gap-8">
      {/* Header Section */}
      <div className="w-full md:w-1/2 bg-pryClr text-white p-4 rounded-lg flex  justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white p-4 rounded-full">
            <FaWallet className="text-pryClr text-4xl" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm md:text-xl">Stockists Balance</p>
            <p className="text-lg md:text-2xl font-semibold">
              {user?.e_wallet ? `NGN ${user.e_wallet.toLocaleString()}` : 'N 0'}
            </p>
          </div>
        </div>
        <p className="text-xs">Transfer funds</p>
      </div>

      {/* Tabs Section */}
      <div className="flex gap-4 mb-4">
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
          <div className="overflow-x-auto">
            <table className="w-full text-base whitespace-nowrap">
              <thead className="text-gray-700 uppercase">
                <tr>
                  <th className="px-4 py-4 text-center">S/N</th>
                  <th className="px-4 py-4 text-center">Name</th>
                  <th className="px-4 py-4 text-center">Ref ID</th>
                  <th className="px-4 py-4 text-center">Product</th>
                  <th className="px-4 py-4 text-center">Date</th>
                  <th className="px-4 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center p-8">Loading...</td>
                  </tr>
                ) : pickupOrders.length > 0 ? (
                  pickupOrders.map((pickupOrder, index) => {
                    const status = pickupOrder?.order?.delivery || '';
                    const { text, className } = statusLabels[status] || {
                      text: status || 'unknown',
                      className: 'bg-gray-200 text-gray-600',
                    };
                    return (
                      <tr key={pickupOrder.id} className="border-b border-black/10 text-xs">
                        <td className="px-4 py-6 text-center">{index + 1}</td>
                        <td className="px-4 py-6 text-center">{`${pickupOrder?.order?.user?.first_name || ''} ${
                          pickupOrder?.order?.user?.last_name || ''
                        }`.trim() || '-'}</td>
                        <td className="px-4 py-6 text-center">{pickupOrder.ref_no || '-'}</td>
                        <td className="px-4 py-6 text-center">{pickupOrder?.order?.product?.product_name || '-'}</td>
                        <td className="px-4 py-6 text-center text-pryClr font-semibold">
                          {formatISODateToCustom(pickupOrder.created_at).split(' ')[0] || '-'}
                        </td>
                        <td className="px-4 py-6 text-center">
                          <span className={`px-2 py-2 rounded-lg text-center font-normal mx-auto border border-pryClr/10 text-xs ${className}`}>
                            {text || '-'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-8">No pickup orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            {!isLoading && pickupOrders.length > 0 && (
              <PaginationControls
                currentPage={pickupPage}
                totalPages={totalPickupPages}
                setCurrentPage={setPickupPage}
              />
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-base whitespace-nowrap">
              <thead className="text-gray-700 uppercase">
                <tr>
                  <th className="px-4 py-4 text-center">ID</th>
                  <th className="px-4 py-4 text-center">Amount</th>
                  <th className="px-4 py-4 text-center">Month</th>
                  <th className="px-4 py-4 text-center">Type</th>
                  <th className="px-4 py-4 text-center">Status</th>
                  <th className="px-4 py-4 text-center">Order ID</th>
                  <th className="px-4 py-4 text-center">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.length > 0 ? (
                  transactionHistory.map((transaction) => {
                    const { text, className } = statusLabels[transaction.status] || {
                      text: transaction.status || 'unknown',
                      className: 'bg-gray-200 text-gray-600',
                    };
                    return (
                      <tr key={transaction.id} className="border-b border-black/10 text-xs">
                        <td className="px-4 py-6 text-center">{transaction.id}</td>
                        <td className="px-4 py-6 text-center">NGN {transaction.amount.toLocaleString()}</td>
                        <td className="px-4 py-6 text-center">{transaction.month}</td>
                        <td className="px-4 py-6 text-center">{transaction.type}</td>
                        <td className="px-4 py-6 text-center">
                          <span className={`px-2 py-2 rounded-lg text-center font-normal mx-auto border border-pryClr/15 text-xs ${className}`}>
                            {text}
                          </span>
                        </td>
                        <td className="px-4 py-6 text-center">{transaction.orderId}</td>
                        <td className="px-4 py-6 text-center text-pryClr font-semibold">{transaction.date}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-8">No transaction history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stockist;