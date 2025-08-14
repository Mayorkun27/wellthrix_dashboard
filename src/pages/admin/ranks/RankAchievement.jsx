import React, { useState } from "react";
import PaginationControls from "../../../utilities/PaginationControls";

const RankAchievement = () => {
  const allData = [
    { name: "Dorcas Odekune", rank: "5 Star" },
    { name: "Favour Adeleke", rank: "4 Star" },
    { name: "Damola Mella", rank: "4 Star" },
    { name: "Ayomide Pentium", rank: "2 Star" },
    { name: "Jane Doe", rank: "3 Star" },
    { name: "John Smith", rank: "1 Star" },
    { name: "Blessing Paul", rank: "2 Star" },
    { name: "Emeka Obi", rank: "4 Star" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;
  const totalPages = Math.ceil(allData.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const currentRows = allData.slice(start, start + rowsPerPage);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full border-collapse text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-5 text-sm font-medium text-gray-600">Name</th>
              <th className="p-5 text-sm font-medium text-gray-600">Ranking</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="p-4 text-sm text-gray-800">{row.name}</td>
                <td className="p-4 text-sm text-gray-800">{row.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-2 p-2">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage} // ✅ same as Unilevel
        />
      </div>
    </div>
  );
};

export default RankAchievement;
