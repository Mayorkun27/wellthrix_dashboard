import React, { useState, useMemo, useCallback, useEffect } from "react";
import PaginationControls from "../../utilities/PaginationControls";
import { FaEye, FaCheck } from "react-icons/fa";
import Modal from "../../components/modals/Modal";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL

const FormRequest = () => {
  const { token, logout } = useUser()
  const [selectedItem, setSelectedItem] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [misDetails, setMisDetails] = useState({
    completed_count: "",
    pending_count: "",
  })

  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage] = useState(5);

  const fetchTasks = useCallback(async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/allform`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          },
          params: {
            page: currentPage,
            perPage: perPage
          }
        });
  
        // console.log("tasks fetch response", response);
  
        if (response.status === 200) {
          setMisDetails({
            completed_count: response.data.completed_count,
            pending_count: response.data.pending_count,
          })
          const { data, current_page, last_page, per_page } = response.data.tasks;
          setItems(data);
          setCurrentPage(current_page);
          setLastPage(last_page);
        }
      } catch (error) {
          if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
            logout();
          }
          console.error("An error occured tasks announcements", error);
          toast.error(error.response.data.message || "An error occured fetching tasks");
      } finally {
        setIsLoading(false);
      }
  }, [token, currentPage, perPage, refresh, logout]);
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleView = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const markCompleted = async (id) => {
    if (window.confirm("Are you sure you want to mark this as completed?")) {
      try {
        const response = await axios.put(`${API_URL}/api/forms/${id}/complete`, {}, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          },
          params: {
            page: currentPage,
            perPage: perPage
          }
        });
  
        // console.log("tasks complete response", response);
  
        if (response.status === 200) {
          toast.success(response.data.message || "Task marked completed")
          setRefresh(true)
        }
      } catch (error) {
          if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
            logout();
          }
          console.error("An error occured completing task", error);
          toast.error(error.response.data.message || "An error occured completing task");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white shadow rounded p-4 text-center">
            <h4 className="text-gray-600 text-sm font-medium">Completed</h4>
            <p className="text-2xl font-bold text-green-600">{misDetails.completed_count || 0}</p>
          </div>
          <div className="bg-white shadow rounded p-4 text-center">
            <h4 className="text-gray-600 text-sm font-medium">Pending</h4>
            <p className="text-2xl font-bold text-yellow-600">{misDetails.pending_count || 0}</p>
          </div>
        </div>

        <div className="shadow-sm rounded bg-white overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-black/70 text-[12px] uppercase border-b border-black/20 whitespace-nowrap">
                <th className="lg:p-5 p-3 text-center">S/N</th>
                <th className="lg:p-5 p-3 text-center">Title</th>
                <th className="lg:p-5 p-3 text-center">Created Date</th>
                <th className="lg:p-5 p-3 text-center">Due Date</th>
                <th className="lg:p-5 p-3 text-center">Image</th>
                <th className="lg:p-5 p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((t, i) => {
                  const serialNumber = (currentPage - 1) * perPage + (i + 1);
                  return (
                    <tr
                      key={t.id}
                      className={`transition-all text-sm border-b border-black/10 ${t?.status.toLowerCase() === "completed" ? "bg-pryClr/30" : "bg-accClr/30"}`}
                    >
                      <td className="lg:p-5 p-3 text-center">{String(serialNumber).padStart(3, "0")}</td>
                      <td className="lg:p-5 p-3 text-center">{t.title}</td>
                      <td className="lg:p-5 p-3 text-center">{t.created_at.split("T")[0]}</td>
                      <td className="lg:p-5 p-3 text-center">{t.due_date}</td>
                      <td className="lg:p-5 p-3 text-center">
                        <div className="w-[60px] h-[60px] mx-auto border border-black/20 overflow-hidden rounded-full">
                          <img
                            src={`https://api.wellthrixinternational.com/storage/app/public/${t?.image}`}
                            alt={t?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="lg:p-5 p-3 text-center">
                        <div className="flex justify-center gap-3 mx-auto items-center">
                          <button
                            onClick={() => handleView(t)}
                            className="text-white flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 rounded-md w-10 h-10 bg-pryClr"
                            title="View"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => markCompleted(t.id)}
                            className="text-white flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 rounded-md w-10 h-10 bg-pryClr"
                            title="Mark Completed"
                            disabled={t?.status.toLowerCase() === "completed"}
                          >
                            <FaCheck size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-8">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {items.length > 0 && (
            <div className="p-4">
              <PaginationControls
                currentPage={currentPage}
                totalPages={lastPage}
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
          <div className="bg-white p-6 rounded-lg w-full">
            <h3 className="text-xl font-semibold mb-4">{selectedItem.title}</h3>
            <p className="mb-2 whitespace-pre-wrap"><strong>Description:</strong> {selectedItem.description}</p>
            <p className="mb-2"><strong>Expected Date:</strong> {selectedItem.due_date}</p>
            <p className="mb-2"><strong>Status:</strong> {selectedItem.status}</p>
            {selectedItem.image && (
              <img
                src={`https://api.wellthrixinternational.com/storage/app/public/${selectedItem.image}`}
                alt={selectedItem.title}
                className="w-1/2 h-auto mb-4"
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