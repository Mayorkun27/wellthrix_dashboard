// import React, { useEffect, useState } from "react";
// import { useUser } from "../../../context/UserContext";
// import axios from "axios";
// import { toast } from "sonner";
// import PaginationControls from "../../../utilities/PaginationControls";
// import { formatISODateToCustom, formatterUtility } from "../../../utilities/Formatterutility";
// import { FaTrashAlt } from "react-icons/fa";
// import Modal from "../../../components/modals/Modal";
// import ConfirmationDialog from "../../../components/modals/ConfirmationDialog";

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const AllUsers = () => {
//     const { user, token, logout } = useUser();
//     const [allUsers, setAllUsers] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [lastPage, setLastPage] = useState(1);
//     const [perPage, setPerPage] = useState(5);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [showStockistEnableConfirmModal, setShowStockistEnableConfirmModal] = useState(false);
//     const [userToDelete, setUserToDelete] = useState(null);

//     const fetchAllUsers = async () => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${API_URL}/api/users`, {
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//                 params: {
//                     page: currentPage,
//                     perPage: perPage
//                 }
//             });

//             console.log("all users Response:", response);

//             if (response.status === 200 && response.data.success) {
//                 const { data, current_page, last_page, per_page } = response.data.data;
//                 setAllUsers(data);
//                 setCurrentPage(current_page);
//                 setLastPage(last_page);
//                 setPerPage(per_page);
//             } else {
//                 throw new Error(response.data.message || "Failed to fetch all users.");
//             }
//         } catch (error) {
//             if (error.response?.data?.message?.includes("unauthenticated")) {
//                 logout();
//             }
//             console.error("API submission error:", error);
//             toast.error(error.response?.data?.message || "An error occurred fetching all users!.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchAllUsers();
//     }, [user?.id, token, currentPage]);

//     const handleDeleteUser = async (user) => {
//         setShowDeleteModal(true);
//         setUserToDelete(user);
//     };

//     const confirmDelete = async () => {
//         if (!userToDelete.id) return;

//         const toastId = toast.loading("Deleting user...");
//         setShowDeleteModal(false);

//         try {
//             const response = await axios.delete(`${API_URL}/api/deleteuser/${userToDelete.id}`, {
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             });

//             if (response.status === 200) {
//                 toast.success(response.data.message || "User deleted successfully", { id: toastId });
//                 fetchAllUsers();
//             } else {
//                 throw new Error(response.data.message || "Failed to delete user.");
//             }
//         } catch (error) {
//             if (error.response?.data?.message?.includes("unauthenticated")) {
//                 logout();
//             }
//             console.error("user deletion error:", error);
//             toast.error(error.response?.data?.message || "An error occurred deleting the user.", { id: toastId });
//         } finally {
//             setUserToDelete(null);
//         }
//     };

//     return (
//         <div className="shadow-sm rounded bg-white overflow-x-auto">
//             <table className="min-w-full">
//                 <thead>
//                     <tr className="text-black/70 text-[12px] uppercase text-center border-b border-black/20">
//                         <th className="p-5">ID</th>
//                         <th className="p-5">Name</th>
//                         <th className="p-5">Email</th>
//                         <th className="p-5">Username</th>
//                         <th className="p-5">Phone</th>
//                         <th className="p-5">Status</th>
//                         <th className="p-5">Stockist Enabled</th>
//                         <th className="p-5">Date Joined</th>
//                         <th className="p-5">Action</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {isLoading ? (
//                         <tr>
//                             <td colSpan="8" className="text-center p-8">Loading...</td>
//                         </tr>
//                     ) : allUsers.length > 0 ? (
//                         allUsers.map((item, index) => {
//                             const serialNumber = (currentPage - 1) * perPage + (index + 1);
//                             return (
//                                 <tr
//                                     key={item.id}
//                                     className="hover:bg-gray-50 text-sm border-b border-black/10 text-center"
//                                 >
//                                     <td className="p-3">{String(serialNumber).padStart(3, "0")}</td>
//                                     <td className="p-4 capitalize">{`${item.first_name} ${item.last_name}` || "-"}</td>
//                                     <td className="p-4">{item.email || "-"}</td>
//                                     <td className="p-4">{item.username || "-"}</td>
//                                     <td className="p-4 capitalize">{item.mobile || "-"}</td>
//                                     <td className="p-4 capitalize">
//                                         <div className={`w-[100px] py-2 ${item.enabled === 1 ? "bg-[#dff7ee]/80 text-pryclr" : "bg-[#c51236]/20 text-red-600"} rounded-lg text-center font-normal mx-auto border border-pryClr/15`}>
//                                             {item.enabled === 1 ? "Active" : "Inactive"}
//                                         </div>
//                                     </td>
//                                     <td className="p-4 capitalize">
//                                         <input 
//                                             type="checkbox" 
//                                             name="" 
//                                             id="" 
//                                             className="w-[25px] h-[25px] accent-accClr"
//                                             checked={item.stockist_enabled === 0 ? false : true}
//                                             disabled={item.stockist_enabled === 0 ? false : true}
//                                         />
//                                     </td>
//                                     <td className="p-4 text-sm text-pryClr font-semibold">
//                                         {formatISODateToCustom(item.created_at)}
//                                     </td>
//                                     <td className="p-4 text-sm text-pryClr font-semibold">
//                                         <button
//                                             type="button"
//                                             title={`Delete ${item.username}`}
//                                             onClick={() => handleDeleteUser(item)}
//                                             className="text-red-600 hover:text-red-700 cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-pryClr/10 transition-all duration-300 rounded-lg mx-auto"
//                                         >
//                                             <FaTrashAlt />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             )
//                         })
//                     ) : (
//                         <tr>
//                             <td colSpan="8" className="text-center p-8">No users found.</td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>

//             {!isLoading && allUsers.length > 0 && (
//                 <div className="flex justify-center items-center gap-2 p-4">
//                     <PaginationControls
//                         currentPage={currentPage}
//                         totalPages={lastPage}
//                         setCurrentPage={setCurrentPage}
//                     />
//                 </div>
//             )}

//             {showDeleteModal && (
//                 <Modal onClose={() => setShowDeleteModal(false)}>
//                     <ConfirmationDialog 
//                         message={`Are you sure you want to delete ${userToDelete?.username}? This action cannot be undone.`}
//                         onConfirm={confirmDelete}
//                         onCancel={() => setShowDeleteModal(false)}
//                     />
//                 </Modal>
//             )}

//             {showStockistEnableConfirmModal && (
//                 <Modal onClose={() => setShowStockistEnableConfirmModal(false)}>
//                     <ConfirmationDialog 
//                         message={`Are you sure you want to make ${userToDelete?.username} a stockist? This action cannot be undone.`}
//                         onConfirm={confirmEnable}
//                         onCancel={() => setShowStockistEnableConfirmModal(false)}
//                     />
//                 </Modal>
//             )}
//         </div>
//     );
// };

// export default AllUsers;


import React, { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";
import PaginationControls from "../../../utilities/PaginationControls";
import { formatISODateToCustom, formatterUtility } from "../../../utilities/Formatterutility";
import { FaTrashAlt } from "react-icons/fa";
import Modal from "../../../components/modals/Modal";
import ConfirmationDialog from "../../../components/modals/ConfirmationDialog";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const AllUsers = () => {
    const { user, token, logout } = useUser();
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStockistEnableConfirmModal, setShowStockistEnableConfirmModal] = useState(false);
    const [selectedUserForAction, setSelectedUserForAction] = useState(null); // Renamed for clarity

    const fetchAllUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/users`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    page: currentPage,
                    perPage: perPage
                }
            });

            console.log("all users Response:", response);

            if (response.status === 200 && response.data.success) {
                const { data, current_page, last_page, per_page } = response.data.data;
                setAllUsers(data);
                setCurrentPage(current_page);
                setLastPage(last_page);
                setPerPage(per_page);
            } else {
                throw new Error(response.data.message || "Failed to fetch all users.");
            }
        } catch (error) {
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            console.error("API submission error:", error);
            toast.error(error.response?.data?.message || "An error occurred fetching all users!.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, [user?.id, token, currentPage]);

    const handleDeleteUser = (user) => {
        setShowDeleteModal(true);
        setSelectedUserForAction(user); // Use the generic state
    };

    const confirmDelete = async () => {
        if (!selectedUserForAction?.id) return;

        const toastId = toast.loading("Deleting user...");
        setShowDeleteModal(false);

        try {
            const response = await axios.delete(`${API_URL}/api/deleteuser/${selectedUserForAction.id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message || "User deleted successfully", { id: toastId });
                fetchAllUsers();
            } else {
                throw new Error(response.data.message || "Failed to delete user.");
            }
        } catch (error) {
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            console.error("user deletion error:", error);
            toast.error(error.response?.data?.message || "An error occurred deleting the user.", { id: toastId });
        } finally {
            setSelectedUserForAction(null);
        }
    };

    // New handler for enabling stockist
    const handleEnableStockist = (user) => {
        setShowStockistEnableConfirmModal(true);
        setSelectedUserForAction(user); // Set the user for the stockist action
    };

    // New function to confirm and make the API call for enabling stockist
    const confirmEnable = async () => {
        if (!selectedUserForAction?.id) return;

        const toastId = toast.loading(`Enabling ${selectedUserForAction.username} as stockist...`);
        setShowStockistEnableConfirmModal(false); // Close the modal immediately

        try {
            const response = await axios.post(`${API_URL}/api/users/${selectedUserForAction.id}/enable-stockist`, {}, { // Empty body for POST request
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message || `${selectedUserForAction.username} is now a stockist!`, { id: toastId });
                fetchAllUsers(); // Refresh the user list to show the updated status
            } else {
                throw new Error(response.data.message || "Failed to enable stockist.");
            }
        } catch (error) {
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            console.error("Enable stockist error:", error);
            toast.error(error.response?.data?.message || "An error occurred enabling stockist.", { id: toastId });
        } finally {
            setSelectedUserForAction(null); // Clear the selected user
        }
    };


    return (
        <div className="shadow-sm rounded bg-white overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="text-black/70 text-[12px] uppercase text-center border-b border-black/20">
                        <th className="p-5">ID</th>
                        <th className="p-5">Name</th>
                        <th className="p-5">Email</th>
                        <th className="p-5">Username</th>
                        <th className="p-5">Phone</th>
                        <th className="p-5">Status</th>
                        <th className="p-5">Stockist Enabled</th>
                        <th className="p-5">Date Joined</th>
                        <th className="p-5">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="9" className="text-center p-8">Loading...</td> {/* Adjusted colspan */}
                        </tr>
                    ) : allUsers.length > 0 ? (
                        allUsers.map((item, index) => {
                            const serialNumber = (currentPage - 1) * perPage + (index + 1);
                            return (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 text-sm border-b border-black/10 text-center"
                                >
                                    <td className="p-3">{String(serialNumber).padStart(3, "0")}</td>
                                    <td className="p-4 capitalize">{`${item.first_name} ${item.last_name}` || "-"}</td>
                                    <td className="p-4">{item.email || "-"}</td>
                                    <td className="p-4">{item.username || "-"}</td>
                                    <td className="p-4 capitalize">{item.mobile || "-"}</td>
                                    <td className="p-4 capitalize">
                                        <div className={`w-[100px] py-2 ${item.enabled === 1 ? "bg-[#dff7ee]/80 text-pryclr" : "bg-[#c51236]/20 text-red-600"} rounded-lg text-center font-normal mx-auto border border-pryClr/15`}>
                                            {item.enabled === 1 ? "Active" : "Inactive"}
                                        </div>
                                    </td>
                                    <td className="p-4 capitalize">
                                        <input
                                            type="checkbox"
                                            className="w-[25px] h-[25px] accent-accClr cursor-pointer" // Added cursor-pointer
                                            checked={item.stockist_enabled === 1} // Check if stockist_enabled is 1
                                            onChange={() => handleEnableStockist(item)} // Call handler on change
                                            disabled={item.stockist_enabled === 1} // Disable if already enabled
                                        />
                                    </td>
                                    <td className="p-4 text-sm text-pryClr font-semibold">
                                        {formatISODateToCustom(item.created_at)}
                                    </td>
                                    <td className="p-4 text-sm text-pryClr font-semibold">
                                        <button
                                            type="button"
                                            title={`Delete ${item.username}`}
                                            onClick={() => handleDeleteUser(item)}
                                            className="text-red-600 hover:text-red-700 cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-pryClr/10 transition-all duration-300 rounded-lg mx-auto"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center p-8">No users found.</td> {/* Adjusted colspan */}
                        </tr>
                    )}
                </tbody>
            </table>

            {!isLoading && allUsers.length > 0 && (
                <div className="flex justify-center items-center gap-2 p-4">
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={lastPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            )}

            {showDeleteModal && (
                <Modal onClose={() => setShowDeleteModal(false)}>
                    <ConfirmationDialog
                        message={`Are you sure you want to delete ${selectedUserForAction?.username}? This action cannot be undone.`}
                        onConfirm={confirmDelete}
                        onCancel={() => setShowDeleteModal(false)}
                    />
                </Modal>
            )}

            {showStockistEnableConfirmModal && (
                <Modal onClose={() => setShowStockistEnableConfirmModal(false)}>
                    <ConfirmationDialog
                        message={`Are you sure you want to make ${selectedUserForAction?.username} a stockist? This action cannot be undone.`}
                        onConfirm={confirmEnable} 
                        title="Confirm enabling?"
                        type="confirm"
                        onCancel={() => setShowStockistEnableConfirmModal(false)}
                    />
                </Modal>
            )}
        </div>
    );
};

export default AllUsers;