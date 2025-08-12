import React, { useState, useEffect, useMemo } from "react";
import PaginationControls from "../../utilities/PaginationControls";
import { FaEye, FaTrash } from "react-icons/fa";

const ManageContactRequests = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL || "";
  const [currentPage, setCurrentPage] = useState(1);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowsPerPage = 5;

  // Fallback contacts in case API fails
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
  useEffect(() => {
    const fetchContacts = async (retries = 3, delay = 1000) => {
      try {
        setLoading(true);
        setError(null);

        // Validate API_URL
        if (!API_URL) {
          throw new Error("API base URL is not defined. Check your .env file.");
        }
        let token = '10|K6MqIw4swBgL0RUnlBNXfTt7ELlYQXxRQ5mmSJt2cc695556'
        // Set up AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(`${API_URL}/api/contact`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responsejson = await response.json();
        const data = responsejson.data || responsejson; // Handle different response structures
        console.log("Fetched contacts:", data); // Debugging log

        // Validate response format (expecting array)
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format: Expected an array of contacts");
        }

        // Map data to ensure consistent field names
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
        console.error("Fetch error:", err.message); // Debugging log
        if (retries > 0 && err.name !== "AbortError") {
          // Retry on failure (except timeout)
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchContacts(retries - 1, delay * 2); // Exponential backoff
        }
        setError(err.message || "Failed to fetch contacts");
        setContacts(fallbackContacts); // Use fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [API_URL]);

  const totalPages = Math.ceil(contacts.length / rowsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return contacts.slice(start, start + rowsPerPage);
  }, [currentPage, contacts]);

  // Handle View action: Fetch contact details by ID
  const handleView = async (id) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/contact/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch contact details: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched contact details:", data); // Debugging log
      setSelectedContact(data);
      setShowViewModal(true);
    } catch (err) {
      console.error("View error:", err.message); // Debugging log
      setError(err.message || "Failed to fetch contact details");
    }
  };

  // Handle Delete action: Show confirmation modal
  const handleDeletePrompt = (id) => {
    setContactToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm Delete action: Send DELETE request
  const confirmDelete = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/contact/${contactToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete contact: ${response.status}`);
      }

      console.log(`Deleted contact with ID: ${contactToDelete}`); // Debugging log
      setContacts(contacts.filter((contact) => contact.id !== contactToDelete));
      setShowDeleteModal(false);
      setContactToDelete(null);
    } catch (err) {
      console.error("Delete error:", err.message); // Debugging log
      setError(err.message || "Failed to delete contact");
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="shadow-sm rounded bg-white overflow-x-auto">
      {loading ? (
        <div className="text-center p-8">Loading...</div>
      ) : error ? (
        <div className="text-center p-8 text-red-600">
          {error}
          <div className="mt-2 text-sm text-gray-600">
            Using fallback data due to API failure.
          </div>
        </div>
      ) : (
        <>
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
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
              <div className="mt-4 text-left text-sm">
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