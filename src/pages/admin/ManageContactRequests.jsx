import React, { useState, useMemo } from "react";
import PaginationControls from "../../utilities/PaginationControls";

const ManageContactRequests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const contacts = [
    {
      id: "001",
      name: "Dorcas Odekunle",
      phone: "08133565247",
      gmail: "atoyebiolamilekins @gmail.com",
      subject: "Hello! Tell me more about this.",
    },
    {
      id: "002",
      name: "Jane Smith",
      phone: "08133565247",
      gmail: "janesmith@gmail.com",
      subject: "Request for quotation",
    },
  ];

  const totalPages = Math.ceil(contacts.length / rowsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return contacts.slice(start, start + rowsPerPage);
  }, [currentPage, contacts]);

  return (
    <div className="shadow-sm rounded bg-white overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-black/70 text-[12px] uppercase border-b border-black/20">
            <th className="lg:p-5 p-3 text-left">ID</th>
            <th className="lg:p-5 p-3 text-left">Name</th>
            <th className="lg:p-5 p-3 text-left">Phone Number</th>
            <th className="lg:p-5 p-3 text-left">Email Address</th>
            <th className="lg:p-5 p-3 text-left">Subject</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-gray-50 text-sm border-b border-black/10"
              >
                <td className="lg:p-5 p-3 text-left">{c.id}</td>
                <td className="lg:p-5 p-3 text-left">{c.name}</td>
                <td className="lg:p-5 p-3 text-left">{c.phone}</td>
                <td className="lg:p-5 p-3 text-left">{c.gmail}</td>
                <td className="lg:p-5 p-3 text-left">{c.subject}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-8">
                No contacts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {currentData.length > 0 && (
        <div className="p-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ManageContactRequests;
