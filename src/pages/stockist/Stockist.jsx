import React, { useState } from 'react';
import { CiWallet } from 'react-icons/ci';
import { FaEye, FaEdit } from 'react-icons/fa';
import { GiCheckMark } from 'react-icons/gi';
import { PiEyesFill } from 'react-icons/pi';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const Stockist = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [activeTab, setActiveTab] = useState('pickup');
  const [pickupPage, setPickupPage] = useState(1);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const itemsPerPage = 5;

  const statusColorsPickup = {
    Pending: 'border border-[#EC3030]/20 text-[#FF0000]/80',
    Picked: 'border border-[#4B7233]/20 text-[#4B7233]/80',
  };

  const statusColorsTransactions = {
    Completed: 'text-[#4BA312]',
    Pending: 'text-[#FFCC00]',
    Failed: 'text-[#FF005F]',
  };

  const pickupOrders = [
    { sn: '001', name: 'John Doe', ref: '92626', product: 'Laptop', package: 'Premium', date: '10/08/25', status: 'Pending' },
    { sn: '002', name: 'Jane Smith', ref: '38635', product: 'Phone', package: 'Standard', date: '08/08/25', status: 'Picked' },
    { sn: '003', name: 'Alice Johnson', ref: '45678', product: 'Tablet', package: 'Basic', date: '07/08/25', status: 'Pending' },
    { sn: '004', name: 'Bob Brown', ref: '78901', product: 'Monitor', package: 'Premium', date: '06/08/25', status: 'Picked' },
    { sn: '005', name: 'Emma Wilson', ref: '12345', product: 'Keyboard', package: 'Standard', date: '05/08/25', status: 'Pending' },
    { sn: '006', name: 'Michael Lee', ref: '67890', product: 'Mouse', package: 'Basic', date: '04/08/25', status: 'Picked' },
    { sn: '007', name: 'Sarah Davis', ref: '23456', product: 'Laptop', package: 'Premium', date: '03/08/25', status: 'Pending' },
    { sn: '008', name: 'David Clark', ref: '34567', product: 'Phone', package: 'Standard', date: '02/08/25', status: 'Picked' },
  ];

  const transactions = [
    { id: '001', amount: '₦500,000', month: 'August', type: 'Bonus', status: 'Completed', orderId: 'GHY665', date: '09/08/25' },
    { id: '002', amount: '₦120,000', month: 'July', type: 'Move', status: 'Pending', orderId: 'JST543', date: '08/08/25' },
    { id: '003', amount: '₦300,000', month: 'June', type: 'Bonus', status: 'Completed', orderId: 'KLM987', date: '07/08/25' },
    { id: '004', amount: '₦80,000', month: 'May', type: 'Move', status: 'Failed', orderId: 'XYZ123', date: '06/08/25' },
    { id: '005', amount: '₦250,000', month: 'April', type: 'Bonus', status: 'Pending', orderId: 'ABC456', date: '05/08/25' },
    { id: '006', amount: '₦150,000', month: 'March', type: 'Move', status: 'Completed', orderId: 'DEF789', date: '04/08/25' },
    { id: '007', amount: '₦400,000', month: 'February', type: 'Bonus', status: 'Completed', orderId: 'GHI012', date: '03/08/25' },
    { id: '008', amount: '₦90,000', month: 'January', type: 'Move', status: 'Pending', orderId: 'JKL345', date: '02/08/25' },
  ];

  const totalPickupPages = Math.ceil(pickupOrders.length / itemsPerPage);
  const totalTransactionPages = Math.ceil(transactions.length / itemsPerPage);

  const paginatedPickupOrders = pickupOrders.slice(
    (pickupPage - 1) * itemsPerPage,
    pickupPage * itemsPerPage
  );

  const paginatedTransactions = transactions.slice(
    (transactionsPage - 1) * itemsPerPage,
    transactionsPage * itemsPerPage
  );

  const renderPagination = (currentPage, totalPages, setPage) => {
    let startPage = Math.max(1, currentPage - 1);
    if (currentPage >= 3) {
      startPage = currentPage - 1;
    }
    const pages = [startPage, startPage + 1, startPage + 2].filter(page => page <= totalPages);
    
    return (
      <div className="flex justify-center gap-2 mt-12">
        <button
          onClick={() => setPage(currentPage > 1 ? currentPage - 1 : 1)}
          className="p-2"
          disabled={currentPage === 1}
        >
          <FaAngleLeft className="text-pryClr" />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setPage(page)}
            className={`px-3 py-1 rounded ${currentPage === page ? 'bg-pryClr text-white' : 'bg-gray-200 text-gray-700'}`}
            disabled={page > totalPages}
          >
            {page}
          </button>
        ))}
        {totalPages > startPage + 2 && <span className="px-3 py-1">...</span>}
        <button
          onClick={() => setPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
          className="p-2"
          disabled={currentPage === totalPages}
        >
          <FaAngleRight className="text-pryClr" />
        </button>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full md:w-1/2 bg-pryClr p-5 rounded-lg shadow-md flex justify-between items-center text-white">
        <div className="flex gap-2 md:gap-4 items-center">
          <div className="p-2 md:p-3 rounded-full bg-white flex items-center justify-center">
            <CiWallet className="text-pryClr w-8 h-8 md:w-10 md:h-10" />
          </div>
          <div className="flex flex-col gap-0.5 md:gap-1">
            <p className="text-sm md:text-xl leading-tight">Stockist Balance</p>
            <p className="text-lg md:text-2xl font-bold">₦7,000</p>
          </div>
        </div>
        <button className="text-[10px] md:text-xs whitespace-nowrap hover:underline focus:outline-none">
          Transfer Funds
        </button>
      </div>

      <div className="w-full p-4 bg-white rounded-lg shadow-sm flex flex-col gap-2">
        <div className="w-full bg-pryClr p-3 gap-2 rounded-lg grid grid-cols-1 md:grid-cols-2">
          <button
            onClick={() => setActiveTab('pickup')}
            className={`w-full flex items-center justify-center py-2 cursor-pointer transition-colors duration-200 font-bold ${activeTab === 'pickup' ? 'bg-gray-200 text-pryClr rounded-lg' : 'bg-pryClr text-white'
              }`}
            aria-selected={activeTab === 'pickup'}
            role="tab"
          >
            <p className="text-sm md:text-lg">Pick Up Orders</p>
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center justify-center py-2 cursor-pointer transition-colors duration-200 font-bold ${activeTab === 'transactions' ? 'bg-gray-200 text-pryClr rounded-lg' : 'bg-pryClr text-white'
              }`}
            aria-selected={activeTab === 'transactions'}
            role="tab"
          >
            <p className="text-sm md:text-lg">Transaction History</p>
          </button>
        </div>

        {activeTab === 'pickup' && (
          <div className="overflow-x-auto">
            <table className="w-full text-base mt-4 whitespace-nowrap">
              <thead className="text-gray-700 uppercase">
                <tr>
                  <th className="px-4 py-6 text-center">SN</th>
                  <th className="px-4 py-6 text-center">Name</th>
                  <th className="px-4 py-6 text-center">REF NO</th>
                  <th className="px-4 py-6 text-center">Product</th>
                  <th className="px-4 py-6 text-center">Package</th>
                  <th className="px-4 py-6 text-center">Date</th>
                  <th className="px-4 py-6 text-center">Status</th>
                  <th className="px-4 py-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPickupOrders.map((order) => (
                  <tr key={order.sn} className="border-b border-black/10">
                    <td className="px-4 py-6 text-center">{order.sn}</td>
                    <td className="px-4 py-6 text-center">{order.name}</td>
                    <td className="px-4 py-6 text-center">{order.ref}</td>
                    <td className="px-4 py-6 text-center">{order.product}</td>
                    <td className="px-4 py-6 text-center">{order.package}</td>
                    <td className="px-4 py-6 text-center">{order.date}</td>
                    <td className="px-4 py-6 text-center">
                      <span className={`px-2 py-2 rounded-full text-xs ${statusColorsPickup[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-6 flex gap-3 justify-center">
                      <PiEyesFill
                        className="text-black cursor-pointer hover:text-black/50"
                        title="View"
                        onClick={() => console.log(`View order ${order.sn}`)}
                      />
                      <GiCheckMark
                        className="text-black cursor-pointer hover:text-black/50"
                        title="Edit"
                        onClick={() => console.log(`Edit order ${order.sn}`)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination(pickupPage, totalPickupPages, setPickupPage)}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-base mt-4 whitespace-nowrap">
              <thead className="text-gray-700 uppercase">
                <tr>
                  <th className="px-4 py-6 text-center">ID</th>
                  <th className="px-4 py-6 text-center">Amount</th>
                  <th className="px-4 py-6 text-center">Month</th>
                  <th className="px-4 py-6 text-center">Type</th>
                  <th className="px-4 py-6 text-center">Status</th>
                  <th className="px-4 py-6 text-center">Order ID</th>
                  <th className="px-4 py-6 text-center">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-black/10">
                    <td className="px-4 py-6 text-center">{tx.id}</td>
                    <td className="px-4 py-6 text-center">{tx.amount}</td>
                    <td className="px-4 py-6 text-center">{tx.month}</td>
                    <td className="px-4 py-6 text-center">{tx.type}</td>
                    <td className="px-4 py-6 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${statusColorsTransactions[tx.status]}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-6 text-center">{tx.orderId}</td>
                    <td className="px-4 py-6 text-center">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination(transactionsPage, totalTransactionPages, setTransactionsPage)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stockist;