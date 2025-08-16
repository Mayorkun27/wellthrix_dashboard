// import React, { useEffect, useState } from "react";
// import { useUser } from "../../../context/UserContext";
// import axios from "axios";
// import { toast } from "sonner";
// import PaginationControls from "../../../utilities/PaginationControls";
// import { formatISODateToCustom, formatterUtility } from "../../../utilities/Formatterutility";
// import { FaTrashAlt } from "react-icons/fa";
// import Modal from "../../../components/modals/Modal";
// import ConfirmationDialog from "../../../components/modals/ConfirmationDialog";
// import { GoUnlink } from "react-icons/go";

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
//     const [isEnabling, setIsEnabling] = useState(false);
//     const [selectedUserForAction, setSelectedUserForAction] = useState(null);
//     const [selectedPlan, setSelectedPlan] = useState("");
//     const [selectedLocation, setSelectedLocation] = useState("");

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

//     const handleDeleteUser = (user) => {
//         setShowDeleteModal(true);
//         setSelectedUserForAction(user);
//     };

//     const confirmDelete = async () => {
//         if (!selectedUserForAction?.id) return;

//         const toastId = toast.loading("Deleting user...");
//         setShowDeleteModal(false);

//         try {
//             const response = await axios.delete(`${API_URL}/api/deleteuser/${selectedUserForAction.id}`, {
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
//             setSelectedUserForAction(null);
//         }
//     };

//     const handleEnableStockist = (user) => {
//         setShowStockistEnableConfirmModal(true);
//         setSelectedUserForAction(user);
//     };

//     const confirmEnable = async () => {
//         if (!selectedUserForAction?.id) return;
//         setIsEnabling(true)

//         const payLoad = {
//             "stockist_plan": selectedPlan,
//             "stockist_location": selectedLocation,
//         }

//         const toastId = toast.loading(`Enabling ${selectedUserForAction.username} as stockist...`);
        
//         try {
//             const response = await axios.post(`${API_URL}/api/users/${selectedUserForAction.id}/enable-stockist`, payLoad, {
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             });

//             if (response.status === 200) {
//                 toast.success(response.data.message || `${selectedUserForAction.username} is now a stockist!`, { id: toastId });
//                 fetchAllUsers();
//             } else {
//                 throw new Error(response.data.message || "Failed to enable stockist.");
//             }
//         } catch (error) {
//             if (error.response?.data?.message?.includes("unauthenticated")) {
//                 logout();
//             }
//             console.error("Enable stockist error:", error);
//             toast.error(error.response?.data?.message || "An error occurred enabling stockist.", { id: toastId });
//         } finally {
//             setShowStockistEnableConfirmModal(false);
//             setIsEnabling(false);
//             setSelectedUserForAction(null)
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
//                         <th className="p-5">Stockist Enabled</th>
//                         <th className="p-5">Account Status</th>
//                         <th className="p-5">Date Joined</th>
//                         <th className="p-5">Action</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {isLoading ? (
//                         <tr>
//                             <td colSpan="9" className="text-center p-8">Loading...</td> {/* Adjusted colspan */}
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
//                                         <button
//                                             type="button"
//                                             className="bg-accClr w-[100px] h-[40px] rounded font-semibold cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
//                                             onClick={() => handleEnableStockist(item)}
//                                             disabled={item.stockist_enabled === 1}
//                                         >
//                                             {item.stockist_enabled === 1 ? "Enabled" : "Enable"}
//                                         </button>
//                                     </td>
//                                     <td className="p-4 capitalize">
//                                         <button
//                                             type="button"
//                                             className={`w-[100px] h-[40px] rounded-md font-semibold cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed border border-pryClr/20 ${item.enabled === 1 ? "bg-[#e5f9f1] hover:bg-[#e5e7eb]" : "hover:bg-[#e5f9f1] bg-[#e5e7eb]"} transition-all duration-300`}
//                                             onClick={() => handleAccountActiveToggle(item)}
//                                         >
//                                             {item.enabled === 1 ? "Active" : "Deactivated"}
//                                         </button>
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
//                             <td colSpan="9" className="text-center p-8">No users found.</td> {/* Adjusted colspan */}
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
//                         message={`Are you sure you want to delete ${selectedUserForAction?.username}? This action cannot be undone.`}
//                         onConfirm={confirmDelete}
//                         onCancel={() => setShowDeleteModal(false)}
//                     />
//                 </Modal>
//             )}

//             {showStockistEnableConfirmModal && (
//                 <Modal onClose={() => setShowStockistEnableConfirmModal(false)}>
//                     <div className="space-y-4">
//                         <h3 className="font-semibold capitalize text-2xl text-center">Enable {selectedUserForAction?.username}</h3>
//                         <div className="space-y-1">
//                             <label className="block text-sm" htmlFor="stockist_plan">Pick a stockist plan for {selectedUserForAction?.username}</label>
//                             <select 
//                                 name="stockist_plan" 
//                                 id="stockist_plan"
//                                 value={selectedPlan}
//                                 onChange={(e) => setSelectedPlan(e.target.value)}
//                                 className={`w-full p-3 border rounded-lg border-gray-300 outline-0 capitalize`}
//                             >
//                                 <option value="" disabled>Select stockist plan</option>
//                                 <option value="Grand_imperial">Grand imperial Plan</option>
//                                 <option value="imperial_stockist">imperial stockist Plan</option>
//                                 <option value="royal_stockist">royal stockist Plan</option>
//                             </select>
//                         </div>
//                         <div className="space-y-1">
//                             <label className="block text-sm" htmlFor="stockist_location">Enter a certified location for {selectedUserForAction?.username}</label>
//                             <input 
//                                 type="text"
//                                 name="stockist_location" 
//                                 id="stockist_location"
//                                 value={selectedLocation}
//                                 onChange={(e) => setSelectedLocation(e.target.value)}
//                                 className={`w-full p-3 border rounded-lg border-gray-300 outline-0 capitalize`}
//                             />
//                         </div>
//                         <button
//                             type="button"
//                             className="bg-pryClr text-secClr w-full py-3 mt-6 rounded font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                             onClick={confirmEnable}
//                             disabled={!selectedPlan || !selectedLocation || isEnabling}
//                         >
//                             {isEnabling ? "Enabling..." : "Enable"}
//                         </button>
//                     </div>
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
import { GoUnlink } from "react-icons/go";

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
    const [showAccountStatusToggleModal, setShowAccountStatusToggleModal] = useState(false); // New state for account status toggle modal
    const [isEnabling, setIsEnabling] = useState(false);
    const [isTogglingAccountStatus, setIsTogglingAccountStatus] = useState(false); // New state for account status toggle loading
    const [selectedUserForAction, setSelectedUserForAction] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");

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
        setSelectedUserForAction(user);
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

    const handleEnableStockist = (user) => {
        setShowStockistEnableConfirmModal(true);
        setSelectedUserForAction(user);
    };

    const confirmEnable = async () => {
        if (!selectedUserForAction?.id || !selectedPlan || !selectedLocation) {
            toast.error("Please select a plan and enter a location.");
            return;
        }
        setIsEnabling(true);

        const payLoad = {
            "stockist_plan": selectedPlan,
            "stockist_location": selectedLocation,
        };

        const toastId = toast.loading(`Enabling ${selectedUserForAction.username} as stockist...`);

        try {
            const response = await axios.post(`${API_URL}/api/users/${selectedUserForAction.id}/enable-stockist`, payLoad, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message || `${selectedUserForAction.username} is now a stockist!`, { id: toastId });
                fetchAllUsers();
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
            setShowStockistEnableConfirmModal(false);
            setIsEnabling(false);
            setSelectedUserForAction(null);
            setSelectedPlan(""); // Reset selected plan
            setSelectedLocation(""); // Reset selected location
        }
    };

    // New handler for account active/deactive toggle
    const handleAccountActiveToggle = (user) => {
        setSelectedUserForAction(user);
        setShowAccountStatusToggleModal(true);
    };

    // New function to confirm and perform account status toggle
    const confirmAccountToggle = async () => {
        if (!selectedUserForAction?.id) return;

        setIsTogglingAccountStatus(true);
        setShowAccountStatusToggleModal(false); // Close the modal immediately

        const currentStatus = selectedUserForAction.enabled;
        const endpoint = currentStatus === 1 ? `${API_URL}/api/admin/disable/${selectedUserForAction.id}` : `${API_URL}/api/admin/disable/${selectedUserForAction.id}`;
        const actionText = currentStatus === 1 ? "Deactivating" : "Activating";
        const successMessage = currentStatus === 1 ? "User account deactivated successfully!" : "User account activated successfully!";
        const errorMessage = currentStatus === 1 ? "Failed to deactivate user account." : "Failed to activate user account.";

        const toastId = toast.loading(`${actionText} ${selectedUserForAction.username}'s account...`);

        try {
            const response = await axios.put(endpoint, {}, { // PUT request, likely no body needed
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message || successMessage, { id: toastId });
                fetchAllUsers(); // Refresh the list
            } else {
                throw new Error(response.data.message || errorMessage);
            }
        } catch (error) {
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            console.error(`Account ${actionText.toLowerCase()} error:`, error);
            toast.error(error.response?.data?.message || `An error occurred ${actionText.toLowerCase()} the account.`, { id: toastId });
        } finally {
            setIsTogglingAccountStatus(false);
            setSelectedUserForAction(null);
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
                        <th className="p-5">Stockist Enabled</th>
                        <th className="p-5">Account Status</th> {/* New column header */}
                        <th className="p-5">Date Joined</th>
                        <th className="p-5">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="9" className="text-center p-8">Loading...</td> {/* Adjusted colspan to 9 */}
                        </tr>
                    ) : allUsers.length > 0 ? (
                        allUsers.map((item, index) => {
                            const serialNumber = (currentPage - 1) * perPage + (index + 1);
                            const accountStatusText = item.enabled === 1 ? "Active" : "Deactivated";
                            const accountStatusClass = item.enabled === 1 ? "bg-[#e5f9f1] hover:bg-[#dff7ee]" : "hover:bg-[#f2f2f2] bg-[#e5e7eb]"; // Adjusted classes for hover

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
                                        <button
                                            type="button"
                                            className="bg-accClr w-[100px] h-[40px] rounded font-semibold cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleEnableStockist(item)}
                                            disabled={item.stockist_enabled === 1 || isEnabling}
                                        >
                                            {item.stockist_enabled === 1 ? "Enabled" : "Enable"}
                                        </button>
                                    </td>
                                    {/* Account Status Toggle Button */}
                                    <td className="p-4 capitalize">
                                        <button
                                            type="button"
                                            className={`w-[100px] h-[40px] rounded-md font-semibold cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed border border-pryClr/20 ${accountStatusClass} transition-all duration-300`}
                                            onClick={() => handleAccountActiveToggle(item)}
                                            disabled={isTogglingAccountStatus} // Disable while another toggle is in progress
                                        >
                                            {accountStatusText}
                                        </button>
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
                            <td colSpan="9" className="text-center p-8">No users found.</td> {/* Adjusted colspan to 9 */}
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
                <Modal onClose={() => {
                    setShowStockistEnableConfirmModal(false);
                    setSelectedPlan("");
                    setSelectedLocation("");
                    setSelectedUserForAction(null); // Clear selected user
                }}>
                    <div className="space-y-4">
                        <h3 className="font-semibold capitalize text-2xl text-center">Enable {selectedUserForAction?.username}</h3>
                        <div className="space-y-1">
                            <label className="block text-sm" htmlFor="stockist_plan">Pick a stockist plan for {selectedUserForAction?.username}</label>
                            <select
                                name="stockist_plan"
                                id="stockist_plan"
                                value={selectedPlan}
                                onChange={(e) => setSelectedPlan(e.target.value)}
                                className={`w-full p-3 border rounded-lg border-gray-300 outline-0 capitalize`}
                            >
                                <option value="" disabled>Select stockist plan</option>
                                <option value="Grand_imperial">Grand imperial Plan</option>
                                <option value="imperial_stockist">imperial stockist Plan</option>
                                <option value="royal_stockist">royal stockist Plan</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm" htmlFor="stockist_location">Enter a certified location for {selectedUserForAction?.username}</label>
                            <input
                                type="text"
                                name="stockist_location"
                                id="stockist_location"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className={`w-full p-3 border rounded-lg border-gray-300 outline-0 capitalize`}
                            />
                        </div>
                        <button
                            type="button"
                            className="bg-pryClr text-secClr w-full py-3 mt-6 rounded font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={confirmEnable}
                            disabled={!selectedPlan || !selectedLocation || isEnabling}
                        >
                            {isEnabling ? "Enabling..." : "Enable"}
                        </button>
                    </div>
                </Modal>
            )}

            {/* Account Status Toggle Confirmation Modal */}
            {showAccountStatusToggleModal && (
                <Modal onClose={() => {
                    setShowAccountStatusToggleModal(false);
                    setSelectedUserForAction(null); // Clear selected user
                }}>
                    <ConfirmationDialog
                        type="confirm"
                        title={`Confirm ${selectedUserForAction?.enabled === 1 ? 'deactivation' : 'activation'}?`}
                        message={`Are you sure you want to ${selectedUserForAction?.enabled === 1 ? 'deactivate' : 'activate'} ${selectedUserForAction?.username}'s account?`}
                        onConfirm={confirmAccountToggle}
                        onCancel={() => {
                            setShowAccountStatusToggleModal(false);
                            setSelectedUserForAction(null);
                        }}
                        confirmButtonText={isTogglingAccountStatus ? "Processing..." : (selectedUserForAction?.enabled === 1 ? "Deactivate" : "Activate")}
                        isConfirming={isTogglingAccountStatus}
                    />
                </Modal>
            )}
        </div>
    );
};

export default AllUsers;