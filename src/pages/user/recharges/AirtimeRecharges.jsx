import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const rechargeHistory = [
  {
    id: 1,
    phone: "08012345678",
    network: "MTN",
    type: "VTU",
    amount: "₦500",
    orderId: "ORD123456",
    date: "2025/08/01",
  },
  {
    id: 2,
    phone: "08123456789",
    network: "Airtel",
    type: "Share & Sell",
    amount: "₦200",
    orderId: "ORD123457",
    date: "2025/08/01",
  },
];

const AirtimeRecharges = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(rechargeHistory.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = rechargeHistory.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="shadow-sm rounded bg-white overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-black/70 text-[12px] uppercase text-center border-b border-black/20">
            <th className="p-5">ID</th>
            <th className="p-5">Phone</th>
            <th className="p-5">Network</th>
            <th className="p-5">Type</th>
            <th className="p-5">Amount</th>
            <th className="p-5">Order ID</th>
            <th className="p-5">Date</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 text-sm border-b border-black/10 text-center"
            >
              <td className="p-3">{String(item.id).padStart(3, "0")}</td>
              <td className="p-4">{item.phone}</td>
              <td className="p-4">{item.network}</td>
              <td className="p-4">{item.type}</td>
              <td className="p-4">{item.amount}</td>
              <td className="p-4">{item.orderId}</td>
              <td className="p-4 text-sm text-pryClr font-semibold">
                {item.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
      <div className="flex items-center justify-center space-x-2 p-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="text-gray-600 disabled:opacity-30"
        >
          <FaChevronLeft />
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${
                currentPage === page
                  ? "bg-pryClr text-white font-bold"
                  : "text-gray-800"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="text-gray-600 disabled:opacity-30"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default AirtimeRecharges;
