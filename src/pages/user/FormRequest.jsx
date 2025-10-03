import React, { useState, useMemo } from "react";
import PaginationControls from "../../utilities/PaginationControls";
import { FaEye, FaCheck } from "react-icons/fa";
import Modal from "../../components/modals/Modal";

const FormRequest = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const rowsPerPage = 5;

  const fallbackItems = [
    {
      id: "001",
      title: "Sample Title 1",
      description: "This is a sample description.",
      expected_date: "2025-10-10",
      image: "https://via.placeholder.com/150",
      status: "pending",
    },
    {
      id: "002",
      title: "Sample Title 2",
      description: "Another sample description here.",
      expected_date: "2025-11-15",
      image: null,
      status: "completed",
    },
  ];

  const handleView = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const markCompleted = (id) => {
    if (window.confirm("Are you sure you want to mark this as completed?")) {
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, status: "completed" } : item
        )
      );
    }
  };

  const totalPages = Math.ceil(items.length / rowsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return items.length > 0 ? items.slice(start, start + rowsPerPage) : fallbackItems;
  }, [currentPage, items]);

  return (
    <div className="space-y-4">
      <div>
        <div className="shadow-sm rounded bg-white overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-black/70 text-[12px] uppercase border-b border-black/20 whitespace-nowrap">
                <th className="lg:p-5 p-3 text-left">ID</th>
                <th className="lg:p-5 p-3 text-left">Title</th>
                <th className="lg:p-5 p-3 text-left">Description</th>
                <th className="lg:p-5 p-3 text-left">Date</th>
                <th className="lg:p-5 p-3 text-left">Image</th>
                <th className="lg:p-5 p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-gray-50 text-sm border-b border-black/10"
                  >
                    <td className="lg:p-5 p-3 text-left">{t.id}</td>
                    <td className="lg:p-5 p-3 text-left">{t.title}</td>
                    <td className="lg:p-5 p-3 text-left min-w-[400px]">{t.description}</td>
                    <td className="lg:p-5 p-3 text-left">{t.expected_date}</td>
                    <td className="lg:p-5 p-3 text-left">
                      <div className="w-[60px] h-[60px]">
                        <img
                          src={t.image || "https://via.placeholder.com/150?text=Image+Not+Found"}
                          alt={t.title}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </td>
                    <td className="lg:p-5 p-3 text-left">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleView(t)}
                          className="text-pryClr hover:text-pryClr/50"
                          title="View"
                        >
                          <FaEye size={16} />
                        </button>
                        {t.status === "pending" && (
                          <button
                            onClick={() => markCompleted(t.id)}
                            className="text-pryClr hover:text-pryClr/50"
                            title="Mark Completed"
                          >
                            <FaCheck size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-8">
                    No requests found.
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
      </div>

      {showViewModal && selectedItem && (
        <Modal
          onClose={() => setShowViewModal(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">{selectedItem.title}</h3>
            <p className="mb-2"><strong>Description:</strong> {selectedItem.description}</p>
            <p className="mb-2"><strong>Expected Date:</strong> {selectedItem.expected_date}</p>
            <p className="mb-2"><strong>Status:</strong> {selectedItem.status}</p>
            {selectedItem.image && (
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-auto mb-4"
              />
            )}
            <button
              onClick={() => setShowViewModal(false)}
              className="bg-pryClr text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FormRequest;