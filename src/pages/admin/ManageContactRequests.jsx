import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import PaginationControls from "../../utilities/PaginationControls";
import { FaEye, FaTrash } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import Modal from "../../components/modals/Modal";
import ConfirmationDialog from "../../components/modals/ConfirmationDialog";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ManageContactRequests = () => {
  const { token } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all contacts with retry mechanism
  const fetchContacts = async () => {
    if (!token) {
      setError("Please log in to access contacts.");
      setContacts([]);
      setLoading(false);
      toast.error("Please log in to access contacts.", {
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!API_URL) {
        throw new Error("API base URL is not defined. Check your .env file.");
      }

      const response = await axios.get(`${API_URL}/api/contact`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          perPage: perPage
        },
        timeout: 5000,
      });

      const data = response.data.data || response.data;
      console.log("Fetched contacts:", data);

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: Expected an array of contacts");
      }

      const mappedData = data.map((contact) => ({
        id: contact.id,
        first_name: contact.first_name,
        last_name: contact.last_name,
        phone: contact.phone,
        email: contact.email,
        message: contact.message,
      }));

      setContacts(mappedData);
    } catch (err) {
      console.error("Fetch error:", err.message, err.response?.data);
      let errorMessage = "Failed to fetch contacts. Please try again later.";
      if (err.response?.status === 401) {
        errorMessage = "Unauthorized: Please log in again.";
        toast.error(errorMessage, { duration: 3000 });
        setTimeout(() => {
          window.location.href = "https://wellthrixinternational.com/#/login";
        }, 3000);
      } else if (err.response?.status === 500) {
        errorMessage = "Server error: Please contact support.";
        toast.error(errorMessage, { duration: 3000 });
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again.";
        toast.error(errorMessage, { duration: 3000 });
      } else {
        toast.error(errorMessage, { duration: 3000 });
      }

      if (retries > 0 && err.code !== "ECONNABORTED") {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchContacts(retries - 1, delay * 2);
      }

      setError(errorMessage);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch contacts on mount or token change
  useEffect(() => {
    fetchContacts();
  }, [API_URL, token]);

  // Handle Delete action: Show confirmation modal
  const handleDeletePrompt = (contact) => {
    if (!token) {
      setError("Please log in to delete contacts.");
      toast.error("Please log in to delete contacts.", { duration: 3000 });
      setTimeout(() => {
        window.location.href = "https://wellthrixinternational.com/#/login";
      }, 3000);
      return;
    }
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  // Confirm Delete action
  const confirmDelete = async () => {
    try {
      setError(null);
      const response = await axios.delete(`${API_URL}/api/contact/${contactToDelete?.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`Deleted contact with ID: ${contactToDelete.id}`, response.data);
      setContacts(contacts.filter((contact) => contact.id !== contactToDelete.id));
      setShowDeleteModal(false);
      setContactToDelete(null);
      toast.success("Contact deleted successfully", { duration: 3000 });
    } catch (err) {
      console.error("Delete error:", err.message, err.response?.data);
      let errorMessage = "Failed to delete contact.";
      if (err.response?.status === 401) {
        errorMessage = "Unauthorized: Please log in again.";
        toast.error(errorMessage, { duration: 3000 });
        setTimeout(() => {
          window.location.href = "https://wellthrixinternational.com/#/login";
        }, 3000);
      } else if (err.response?.status === 500) {
        errorMessage = "Server error: Please contact support.";
        toast.error(errorMessage, { duration: 3000 });
      } else {
        toast.error(errorMessage, { duration: 3000 });
      }
      setError(errorMessage);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="shadow-sm rounded bg-white overflow-x-auto">
      {loading ? (
        <div className="text-center p-8">Loading contacts...</div>
      ) : (
        <>
          {error && (
            <div className="text-center p-4 text-red-600">
              {error}
              <button
                onClick={() => fetchContacts()}
                className="ml-2 text-pryClr hover:text-pryClr/50 underline"
              >
                Retry
              </button>
            </div>
          )}
          <table className="w-full">
            <thead>
              <tr className="text-black/70 text-[12px] text-center uppercase border-b border-black/20 whitespace-nowrap">
                <th className="lg:p-5 p-3">ID</th>
                <th className="lg:p-5 p-3">Name</th>
                <th className="lg:p-5 p-3">Phone Number</th>
                <th className="lg:p-5 p-3">Email Address</th>
                <th className="lg:p-5 p-3">Subject</th>
                <th className="lg:p-5 p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length > 0 ? (
                contacts.map((c, index) => {
                  const serialNumber = (currentPage - 1) * perPage + (index + 1);
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-gray-50 text-sm text-center border-b border-black/10"
                    >
                      <td className="p-3">{String(serialNumber).padStart(3, "0")}</td>
                      <td className="lg:p-5 p-3">{`${c.first_name} ${c.last_name}`}</td>
                      <td className="lg:p-5 p-3">{c.phone}</td>
                      <td className="lg:p-5 p-3">{c.email}</td>
                      <td className="lg:p-5 p-3">{c.message}</td>
                      <td className="lg:p-5 p-3">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            title={`View`}
                            onClick={() => setSelectedContact(c)}
                            className="text-pryClr cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-pryClr/10 transition-all duration-300 rounded-lg mx-auto"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePrompt(c)}
                            className="text-pryClr cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-pryClr/10 transition-all duration-300 rounded-lg mx-auto"
                            title="Delete"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-8">
                    No contacts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {contacts.length > 0 && (
            <div className="p-4">
              <PaginationControls
                currentPage={currentPage}
                totalPages={lastPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      {/* View Contact Modal */}
      {selectedContact && (
        <Modal
          onClose={() => setSelectedContact(null)}
          title={`Contact Details - ${selectedContact.first_name} ${selectedContact.last_name}`}
        >
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold text-pryClr">Contact Details</h2>
            <div className="mt-4 text-left grid md:grid-cols-2 grid-cols-1 gap-3 text-sm">
              <p className=""><strong>First Name:</strong> {selectedContact.first_name}</p>
              <p className=""><strong>Last Name:</strong> {selectedContact.last_name}</p>
              <p className=""><strong>Phone:</strong> {selectedContact.phone}</p>
              <p className=""><strong>Email:</strong> {selectedContact.email}</p>
              <p className="md:col-span-2 col-span-1"><strong>Message:</strong> {selectedContact.message}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal>
          <ConfirmationDialog
            message={`Are you sure you want to delete this contact from ${contactToDelete?.email}? This action cannot be undone.`}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageContactRequests;