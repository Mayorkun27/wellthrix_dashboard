import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const electricityHistory = [
  {
    id: 1,
    provider: "IKEDC",
    token: "G5W2",
    plan: "1 month",
    amount: "₦20,000",
  },
  {
    id: 2,
    provider: "KAEDCO",
    token: "G5W2",
    plan: "2 month",
    amount: "₦30,500",
  },
  // Add more items for testing pagination
  {
    id: 3,
    provider: "EKEDC",
    token: "G6R4",
    plan: "1 month",
    amount: "₦21,000",
  },
  {
    id: 4,
    provider: "IBEDC",
    token: "B1Z7",
    plan: "3 month",
    amount: "₦45,000",
  },
  {
    id: 5,
    provider: "PHEDC",
    token: "Y8W9",
    plan: "2 month",
    amount: "₦31,500",
  },
];

const ITEMS_PER_PAGE = 3;

const ElectricityRecharges = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(electricityHistory.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = electricityHistory.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-4">
      <div className="shadow-sm rounded bg-white overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-black/70 text-[12px] uppercase border-b border-black/20 text-center">
              <th className="p-5">ID</th>
              <th className="p-5">Provider</th>
              <th className="p-5">Token</th>
              <th className="p-5">Plan</th>
              <th className="p-5">Amount</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 text-sm border-b border-black/10 text-center"
              >
                <td className="p-4">{String(item.id).padStart(3, "0")}</td>
                <td className="p-4">{item.provider}</td>
                <td className="p-4">{item.token}</td>
                <td className="p-4">{item.plan}</td>
                <td className="p-4 text-sm text-pryClr font-semibold">
                  {item.amount}
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
    </div>
  );
};

export default ElectricityRecharges;
