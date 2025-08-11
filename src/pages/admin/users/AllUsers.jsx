import React, { useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const AllUsers = () => {

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const users = [
    { id: '001', name: 'Sanni Ayomide', email: 'sanni.ayomide@example.com', phone: '080123456789', status: 'Active', date: '10/08/25' },
    { id: '002', name: 'Chidi Okeke', email: 'chidi.okeke@example.com', phone: '081234567890', status: 'Inactive', date: '09/08/25' },
    { id: '003', name: 'Aisha Bello', email: 'aisha.bello@example.com', phone: '082345678901', status: 'Active', date: '08/08/25' },
    { id: '004', name: 'Tunde Adeyemi', email: 'tunde.adeyemi@example.com', phone: '083456789012', status: 'Inactive', date: '07/08/25' },
    { id: '005', name: 'Funmi Ojo', email: 'funmi.ojo@example.com', phone: '084567890123', status: 'Active', date: '06/08/25' },
    { id: '006', name: 'Emeka Nwosu', email: 'emeka.nwosu@example.com', phone: '085678901234', status: 'Inactive', date: '05/08/25' },
    { id: '007', name: 'Ngozi Eze', email: 'ngozi.eze@example.com', phone: '086789012345', status: 'Active', date: '04/08/25' },
    { id: '008', name: 'Kemi Ade', email: 'kemi.ade@example.com', phone: '087890123456', status: 'Inactive', date: '03/08/25' },
  ];

  const statusColors = {
    Active: 'text-[#4BA312] bg-[#DFF7EE]/15 border border-[#4BA312]/15',
    Inactive: 'text-[#BF1235] bg-[#C51236]/20 border border-[#BF1235]/15',
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
      <div className="w-full bg-white rounded-lg p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm mt-4 whitespace-nowrap">
            <thead className="text-gray-700 uppercase">
              <tr>
                <th className="px-2 py-6 text-center">ID</th>
                <th className="px-2 py-6 text-center">Name</th>
                <th className="px-2 py-6 text-center">Email</th>
                <th className="px-2 py-6 text-center">Phone Number</th>
                <th className="px-2 py-6 text-center">Status</th>
                <th className="px-2 py-6 text-center">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-black/10">
                  <td className="px-2 py-6 text-center">{user.id}</td>
                  <td className="px-2 py-6 text-center">{user.name}</td>
                  <td className="px-2 py-6 text-center whitespace-nowrap">{user.email}</td>
                  <td className="px-2 py-6 text-center">{user.phone}</td>
                  <td className="px-2 py-6 text-center">
                    <span className={`px-2 py-2 rounded-full text-xs ${statusColors[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-2 py-6 text-center">{user.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
        {renderPagination(currentPage, totalPages, setCurrentPage)}
      </div>
    </div>
  );
};

export default AllUsers;