import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import PaginationControls from "../../utilities/PaginationControls";
import { FaEye, FaTrash } from "react-icons/fa";
import { useUser } from "../../context/UserContext";

const ManageContactRequests = () => {
  const { token } = useUser();
  const API_URL = import.meta.env.VITE_API_BASE_URL || "";
  const [currentPage, setCurrentPage] = useState(1);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const rowsPerPage = 5;

  // Fallback contacts
  const fallbackContacts = [
    {
      id: "001",
      first_name: "Dorcas",
      last_name: "Odekunle",
      phone: "08133565247",
      email: "atoyebiolamilekins@gmail.com",
      message: "Hello! Tell me more about this.",
    },
    {
      id: "002",
      first_name: "Jane",
      last_name: "Smith",
      phone: "08133565247",
      email: "janesmith@gmail.com",
      message: "Request for quotation",
    },
  ];

  // Fetch all contacts with retry mechanism
  const fetchContacts = async (retries = 1, delay = 1000) => {
    if (!token) {
      setError("Please log in to access contacts.");
      setContacts(fallbackContacts);
      setLoading(false);
      toast.error("Please log in to access contacts.", {
        duration: 3000,
      });
      setTimeout(() => {
        window.location.href = "https://wellthrixinternational.com/#/login";
      }, 3000);
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
      setContacts(fallbackContacts);
    } finally {
      setLoading(false);
    }
  };

  // Fetch contacts on mount or token change
  useEffect(() => {
    fetchContacts();
  }, [API_URL, token]);

  const totalPages = Math.ceil(contacts.length / rowsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return contacts.slice(start, start + rowsPerPage);
  }, [currentPage, contacts]);

  // Handle View action
  const handleView = async (id) => {
    if (!token) {
      setError("Please log in to view contact details.");
      toast.error("Please log in to view contact details.", { duration: 3000 });
      setTimeout(() => {
        window.location.href = "https://wellthrixinternational.com/#/login";
      }, 3000);
      return;
    }

    try {
      setError(null);
      const response = await axios.get(`${API_URL}/api/contact/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data || response.data;
      console.log("Fetched contact details:", data);
      setSelectedContact(data);
      setShowViewModal(true);
    } catch (err) {
      console.error("View error:", err.message, err.response?.data);
      let errorMessage = "Failed to fetch contact details.";
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
    }
  };

  // Handle Delete action: Show confirmation modal
  const handleDeletePrompt = (id) => {
    if (!token) {
      setError("Please log in to delete contacts.");
      toast.error("Please log in to delete contacts.", { duration: 3000 });
      setTimeout(() => {
        window.location.href = "https://wellthrixinternational.com/#/login";
      }, 3000);
      return;
    }
    setContactToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm Delete action
  const confirmDelete = async () => {
    try {
      setError(null);
      const response = await axios.delete(`${API_URL}/api/contact/${contactToDelete}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`Deleted contact with ID: ${contactToDelete}`, response.data);
      setContacts(contacts.filter((contact) => contact.id !== contactToDelete));
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
              <div className="mt-2 text-sm text-gray-600">
                Using fallback data due to API failure.
                <button
                  onClick={() => fetchContacts()}
                  className="ml-2 text-pryClr hover:text-pryClr/50 underline"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          <table className="w-full">
            <thead>
              <tr className="text-black/70 text-[12px] uppercase border-b border-black/20 whitespace-nowrap">
                <th className="lg:p-5 p-3 text-left">ID</th>
                <th className="lg:p-5 p-3 text-left">Name</th>
                <th className="lg:p-5 p-3 text-left">Phone Number</th>
                <th className="lg:p-5 p-3 text-left">Email Address</th>
                <th className="lg:p-5 p-3 text-left">Subject</th>
                <th className="lg:p-5 p-3 text-left">Action</th>
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
                    <td className="lg:p-5 p-3 text-left">{`${c.first_name} ${c.last_name}`}</td>
                    <td className="lg:p-5 p-3 text-left">{c.phone}</td>
                    <td className="lg:p-5 p-3 text-left">{c.email}</td>
                    <td className="lg:p-5 p-3 text-left">{c.message}</td>
                    <td className="lg:p-5 p-3 text-left">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleView(c.id)}
                          className="text-pryClr hover:text-pryClr/50"
                          title="View"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletePrompt(c.id)}
                          className="text-pryClr hover:text-pryClr/50"
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
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
        </>
      )}

      {/* View Contact Modal */}
      {showViewModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="text-center p-4 mt-4">
              <h2 className="text-xl font-bold text-pryClr">Contact Details</h2>
              <div className="mt-4 text-left flex flex-col gap-3 text-sm">
                <p><strong>ID:</strong> {selectedContact.id}</p>
                <p><strong>First Name:</strong> {selectedContact.first_name}</p>
                <p><strong>Last Name:</strong> {selectedContact.last_name}</p>
                <p><strong>Phone:</strong> {selectedContact.phone}</p>
                <p><strong>Email:</strong> {selectedContact.email}</p>
                <p><strong>Message:</strong> {selectedContact.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="text-center p-4 mt-4">
              <h2 className="text-xl font-bold text-pryClr">Confirm Delete</h2>
              <p className="text-sm mt-2">
                Are you sure you want to delete this contact?
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageContactRequests;