import React, { useState } from 'react';
import { FaEye, FaEdit } from 'react-icons/fa';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const ManageTransactions = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [activeTab, setActiveTab] = useState('incoming');
  const [incomingPage, setIncomingPage] = useState(1);
  const [outgoingPage, setOutgoingPage] = useState(1);
  const itemsPerPage = 5;

  const statusColors = {
    Successful: 'text-[#2F5318] bg-[#DFF7EE]/15 border border-[#2F5318]/15',
    Pending: 'text-[#BF1235] bg-[#C51236]/20 border border-[#2F5318]/15',
  };

  const incomingRequests = [
    { email: 'john.doe@example.com', accountType: 'E-wallet', amountPaid: '₦50,000', status: 'Successful', date: '10/08/25', time: '09:00:00 AM' },
    { email: 'jane.smith@example.com', accountType: 'Account Balance', amountPaid: '₦75,000', status: 'Pending', date: '09/08/25', time: '10:30:00 AM' },
    { email: 'alice.johnson@example.com', accountType: 'E-wallet', amountPaid: '₦20,000', status: 'Successful', date: '08/08/25', time: '11:15:00 AM' },
    { email: 'bob.brown@example.com', accountType: 'Account Balance', amountPaid: '₦100,000', status: 'Pending', date: '07/08/25', time: '02:45:00 PM' },
    { email: 'emma.wilson@example.com', accountType: 'E-wallet', amountPaid: '₦30,000', status: 'Successful', date: '06/08/25', time: '08:00:00 AM' },
    { email: 'michael.lee@example.com', accountType: 'Account Balance', amountPaid: '₦60,000', status: 'Pending', date: '05/08/25', time: '03:20:00 PM' },
    { email: 'john.doe@example.com', accountType: 'E-wallet', amountPaid: '₦50,000', status: 'Successful', date: '10/08/25', time: '09:00:00 AM' },
    { email: 'jane.smith@example.com', accountType: 'Account Balance', amountPaid: '₦75,000', status: 'Pending', date: '09/08/25', time: '10:30:00 AM' },
    { email: 'alice.johnson@example.com', accountType: 'E-wallet', amountPaid: '₦20,000', status: 'Successful', date: '08/08/25', time: '11:15:00 AM' },
    { email: 'bob.brown@example.com', accountType: 'Account Balance', amountPaid: '₦100,000', status: 'Pending', date: '07/08/25', time: '02:45:00 PM' },
    { email: 'emma.wilson@example.com', accountType: 'E-wallet', amountPaid: '₦30,000', status: 'Successful', date: '06/08/25', time: '08:00:00 AM' },
    { email: 'michael.lee@example.com', accountType: 'Account Balance', amountPaid: '₦60,000', status: 'Pending', date: '05/08/25', time: '03:20:00 PM' },
    { email: 'john.doe@example.com', accountType: 'E-wallet', amountPaid: '₦50,000', status: 'Successful', date: '10/08/25', time: '09:00:00 AM' },
    { email: 'jane.smith@example.com', accountType: 'Account Balance', amountPaid: '₦75,000', status: 'Pending', date: '09/08/25', time: '10:30:00 AM' },
    { email: 'alice.johnson@example.com', accountType: 'E-wallet', amountPaid: '₦20,000', status: 'Successful', date: '08/08/25', time: '11:15:00 AM' },
    { email: 'bob.brown@example.com', accountType: 'Account Balance', amountPaid: '₦100,000', status: 'Pending', date: '07/08/25', time: '02:45:00 PM' },
    { email: 'emma.wilson@example.com', accountType: 'E-wallet', amountPaid: '₦30,000', status: 'Successful', date: '06/08/25', time: '08:00:00 AM' },
    { email: 'michael.lee@example.com', accountType: 'Account Balance', amountPaid: '₦60,000', status: 'Pending', date: '05/08/25', time: '03:20:00 PM' },
    { email: 'john.doe@example.com', accountType: 'E-wallet', amountPaid: '₦50,000', status: 'Successful', date: '10/08/25', time: '09:00:00 AM' },
    { email: 'jane.smith@example.com', accountType: 'Account Balance', amountPaid: '₦75,000', status: 'Pending', date: '09/08/25', time: '10:30:00 AM' },
    { email: 'alice.johnson@example.com', accountType: 'E-wallet', amountPaid: '₦20,000', status: 'Successful', date: '08/08/25', time: '11:15:00 AM' },
    { email: 'bob.brown@example.com', accountType: 'Account Balance', amountPaid: '₦100,000', status: 'Pending', date: '07/08/25', time: '02:45:00 PM' },
    { email: 'emma.wilson@example.com', accountType: 'E-wallet', amountPaid: '₦30,000', status: 'Successful', date: '06/08/25', time: '08:00:00 AM' },
    { email: 'michael.lee@example.com', accountType: 'Account Balance', amountPaid: '₦60,000', status: 'Pending', date: '05/08/25', time: '03:20:00 PM' },
  ];

  const outgoingRequests = [
    { email: 'sarah.davis@example.com', accountType: 'E-wallet', bankName: 'First Bank', accountNo: '1234567890', amountPaid: '₦40,000', status: 'Successful', date: '10/08/25', time: '07:00:00 AM' },
    { email: 'david.clark@example.com', accountType: 'Account Balance', bankName: 'GTBank', accountNo: '9876543210', amountPaid: '₦25,000', status: 'Pending', date: '09/08/25', time: '04:10:00 PM' },
    { email: 'lisa.white@example.com', accountType: 'E-wallet', bankName: 'Zenith Bank', accountNo: '4567891234', amountPaid: '₦80,000', status: 'Successful', date: '08/08/25', time: '09:50:00 AM' },
    { email: 'tom.green@example.com', accountType: 'Account Balance', bankName: 'Access Bank', accountNo: '3216549870', amountPaid: '₦15,000', status: 'Pending', date: '07/08/25', time: '01:30:00 PM' },
    { email: 'emma.brown@example.com', accountType: 'E-wallet', bankName: 'UBA', accountNo: '6543217890', amountPaid: '₦90,000', status: 'Successful', date: '06/08/25', time: '11:00:00 AM' },
    { email: 'chris.jones@example.com', accountType: 'Account Balance', bankName: 'Stanbic IBTC', accountNo: '7891234560', amountPaid: '₦70,000', status: 'Pending', date: '05/08/25', time: '05:40:00 PM' },
    { email: 'sarah.davis@example.com', accountType: 'E-wallet', bankName: 'First Bank', accountNo: '1234567890', amountPaid: '₦40,000', status: 'Successful', date: '10/08/25', time: '07:00:00 AM' },
    { email: 'david.clark@example.com', accountType: 'Account Balance', bankName: 'GTBank', accountNo: '9876543210', amountPaid: '₦25,000', status: 'Pending', date: '09/08/25', time: '04:10:00 PM' },
    { email: 'lisa.white@example.com', accountType: 'E-wallet', bankName: 'Zenith Bank', accountNo: '4567891234', amountPaid: '₦80,000', status: 'Successful', date: '08/08/25', time: '09:50:00 AM' },
    { email: 'tom.green@example.com', accountType: 'Account Balance', bankName: 'Access Bank', accountNo: '3216549870', amountPaid: '₦15,000', status: 'Pending', date: '07/08/25', time: '01:30:00 PM' },
    { email: 'emma.brown@example.com', accountType: 'E-wallet', bankName: 'UBA', accountNo: '6543217890', amountPaid: '₦90,000', status: 'Successful', date: '06/08/25', time: '11:00:00 AM' },
    { email: 'chris.jones@example.com', accountType: 'Account Balance', bankName: 'Stanbic IBTC', accountNo: '7891234560', amountPaid: '₦70,000', status: 'Pending', date: '05/08/25', time: '05:40:00 PM' },
    { email: 'sarah.davis@example.com', accountType: 'E-wallet', bankName: 'First Bank', accountNo: '1234567890', amountPaid: '₦40,000', status: 'Successful', date: '10/08/25', time: '07:00:00 AM' },
    { email: 'david.clark@example.com', accountType: 'Account Balance', bankName: 'GTBank', accountNo: '9876543210', amountPaid: '₦25,000', status: 'Pending', date: '09/08/25', time: '04:10:00 PM' },
    { email: 'lisa.white@example.com', accountType: 'E-wallet', bankName: 'Zenith Bank', accountNo: '4567891234', amountPaid: '₦80,000', status: 'Successful', date: '08/08/25', time: '09:50:00 AM' },
    { email: 'tom.green@example.com', accountType: 'Account Balance', bankName: 'Access Bank', accountNo: '3216549870', amountPaid: '₦15,000', status: 'Pending', date: '07/08/25', time: '01:30:00 PM' },
    { email: 'emma.brown@example.com', accountType: 'E-wallet', bankName: 'UBA', accountNo: '6543217890', amountPaid: '₦90,000', status: 'Successful', date: '06/08/25', time: '11:00:00 AM' },
    { email: 'chris.jones@example.com', accountType: 'Account Balance', bankName: 'Stanbic IBTC', accountNo: '7891234560', amountPaid: '₦70,000', status: 'Pending', date: '05/08/25', time: '05:40:00 PM' },
    { email: 'sarah.davis@example.com', accountType: 'E-wallet', bankName: 'First Bank', accountNo: '1234567890', amountPaid: '₦40,000', status: 'Successful', date: '10/08/25', time: '07:00:00 AM' },
    { email: 'david.clark@example.com', accountType: 'Account Balance', bankName: 'GTBank', accountNo: '9876543210', amountPaid: '₦25,000', status: 'Pending', date: '09/08/25', time: '04:10:00 PM' },
    { email: 'lisa.white@example.com', accountType: 'E-wallet', bankName: 'Zenith Bank', accountNo: '4567891234', amountPaid: '₦80,000', status: 'Successful', date: '08/08/25', time: '09:50:00 AM' },
    { email: 'tom.green@example.com', accountType: 'Account Balance', bankName: 'Access Bank', accountNo: '3216549870', amountPaid: '₦15,000', status: 'Pending', date: '07/08/25', time: '01:30:00 PM' },
    { email: 'emma.brown@example.com', accountType: 'E-wallet', bankName: 'UBA', accountNo: '6543217890', amountPaid: '₦90,000', status: 'Successful', date: '06/08/25', time: '11:00:00 AM' },
    { email: 'chris.jones@example.com', accountType: 'Account Balance', bankName: 'Stanbic IBTC', accountNo: '7891234560', amountPaid: '₦70,000', status: 'Pending', date: '05/08/25', time: '05:40:00 PM' },
  ];

  const maskAccountNumber = (accountNo) => {
    if (accountNo.length >= 4) {
      return accountNo.slice(0, 2) + '**' + accountNo.slice(4);
    }
    return accountNo;
  };

  const totalIncomingPages = Math.ceil(incomingRequests.length / itemsPerPage);
  const totalOutgoingPages = Math.ceil(outgoingRequests.length / itemsPerPage);

  const paginatedIncomingRequests = incomingRequests.slice(
    (incomingPage - 1) * itemsPerPage,
    incomingPage * itemsPerPage
  );

  const paginatedOutgoingRequests = outgoingRequests.slice(
    (outgoingPage - 1) * itemsPerPage,
    outgoingPage * itemsPerPage
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
      <div className="flex gap-8">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`text-xl md:text-2xl font-bold cursor-pointer pb-1 ${activeTab === 'incoming' ? 'text-pryClr border-b-2 border-pryClr' : 'text-gray-500'}`}
          aria-selected={activeTab === 'incoming'}
          role="tab"
        >
          Incoming
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          className={`text-lg md:text-2xl font-bold cursor-pointer pb-1 ${activeTab === 'outgoing' ? 'text-pryClr border-b-2 border-pryClr' : 'text-gray-500'}`}
          aria-selected={activeTab === 'outgoing'}
          role="tab"
        >
          Outgoing
        </button>
      </div>
      <div className="w-full bg-white p-4 rounded-lg shadow-sm">
        {activeTab === 'incoming' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm mt-4 whitespace-nowrap">
              <thead className="text-gray-700 uppercase">
                <tr>
                  <th className="px-1 py-4 text-center">Email</th>
                  <th className="px-1 py-4 text-center">Account Type</th>
                  <th className="px-1 py-4 text-center">Amount Paid</th>
                  <th className="px-1 py-4 text-center">Status</th>
                  <th className="px-1 py-4 text-center">Date</th>
                  <th className="px-1 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedIncomingRequests.map((request, index) => (
                  <tr key={index} className="border-b border-black/10">
                    <td className="px-1 py-4 text-center whitespace-normal break-words max-w-[100px]">{request.email}</td>
                    <td className="px-1 py-4 text-center">{request.accountType}</td>
                    <td className="px-1 py-4 text-center">{request.amountPaid}</td>
                    <td className="px-1 py-4 text-center">
                      <span className={`px-2 py-2 rounded-full text-xs ${statusColors[request.status]}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-1 py-4 text-center">
                      <div className="flex flex-col text-pryClr font-semibold items-center">
                        <span>{request.date}</span>
                        <span>{request.time}</span>
                      </div>
                    </td>
                    <td className="px-1 py-4 flex gap-3 justify-center items-center">
                      <FaEye
                        className="text-pryClr cursor-pointer hover:text-pryClr/50"
                        title="View"
                        onClick={() => console.log(`View incoming request ${request.email}`)}
                      />
                      <MdDelete
                        className="text-pryClr cursor-pointer hover:text-pryClr/50"
                        title="Delete"
                        onClick={() => console.log(`Delete incoming request ${request.email}`)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination(incomingPage, totalIncomingPages, setIncomingPage)}
          </div>
        )}

        {activeTab === 'outgoing' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm mt-4 whitespace-nowrap">
              <thead className="text-gray-700 uppercase">
                <tr>
                  <th className="px-1 py-4 text-center">Email</th>
                  <th className="px-1 py-4 text-center">Account Type</th>
                  <th className="px-1 py-4 text-center">Bank Name</th>
                  <th className="px-1 py-4 text-center">Account No</th>
                  <th className="px-1 py-4 text-center">Amount Paid</th>
                  <th className="px-1 py-4 text-center">Status</th>
                  <th className="px-1 py-4 text-center">Date</th>
                  <th className="px-1 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOutgoingRequests.map((request, index) => (
                  <tr key={index} className="border-b border-black/10">
                    <td className="px-1 py-4 text-center whitespace-normal break-words max-w-[100px]">{request.email}</td>
                    <td className="px-1 py-4 text-center">{request.accountType}</td>
                    <td className="px-1 py-4 text-center">{request.bankName}</td>
                    <td className="px-1 py-4 text-center">{maskAccountNumber(request.accountNo)}</td>
                    <td className="px-1 py-4 text-center">{request.amountPaid}</td>
                    <td className="px-1 py-4 text-center">
                      <span className={`px-2 py-2 rounded-full text-xs ${statusColors[request.status]}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-1 py-4 text-center">
                      <div className="flex flex-col text-pryClr font-semibold items-center">
                        <span>{request.date}</span>
                        <span>{request.time}</span>
                      </div>
                    </td>
                    <td className="px-1 py-4 flex gap-3 justify-center items-center">
                      <FaEye
                        className="text-pryClr cursor-pointer hover:text-pryClr/50"
                        title="View"
                        onClick={() => console.log(`View outgoing request ${request.email}`)}
                      />
                      <MdDelete
                        className="text-pryClr cursor-pointer hover:text-pryClr/50"
                        title="Delete"
                        onClick={() => console.log(`Delete outgoing request ${request.email}`)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination(outgoingPage, totalOutgoingPages, setOutgoingPage)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTransactions;