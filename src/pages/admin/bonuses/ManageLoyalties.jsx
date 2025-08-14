import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import PaginationControls from "../../../utilities/PaginationControls";
import {
  formatISODateToCustom,
  formatterUtility,
} from "../../../utilities/Formatterutility";
import { FaTrashAlt } from "react-icons/fa";
import Modal from "../../../components/modals/Modal";
import ConfirmationDialog from "../../../components/modals/ConfirmationDialog";
import { useUser } from "../../../context/UserContext";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ManageLoyalties = () => {
  const { user, token, logout } = useUser();
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bonusToPay, setBonusToPay] = useState(null);

  const fetchEligibleUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/loyalty/eligible-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            page: currentPage,
            perPage: perPage,
          },
        }
      );

      console.log("eligible users Response:", response);

      if (response.status === 200 && response.data.success) {
        const { data, current_page, last_page, per_page } = response.data.data;
        setEligibleUsers(data);
        setCurrentPage(current_page);
        setLastPage(last_page);
        setPerPage(per_page);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch eligible users."
        );
      }
    } catch (error) {
      if (error.response?.data?.message?.includes("unauthenticated")) {
        logout();
      }
      console.error("API submission error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred fetching eligible users!."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEligibleUsers();
  }, [user?.id, token, currentPage]);

  const handleConfirmPayout = async (user) => {
    setShowConfirmModal(true);
    setBonusToPay(user);
  };

  const confirmPayout = async () => {
    if (!bonusToPay.id) return;

    const toastId = toast.loading("Reimbursing loyalty bonus...");
    setShowConfirmModal(false);

    try {
      const response = await axios.put(
        `${API_URL}/api/loyalty/pay/${bonusToPay.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          response.data.message || "Reimbursed loyalty bonus successfully",
          { id: toastId }
        );
        fetchEligibleUsers();
      } else {
        throw new Error(
          response.data.message || "Failed to reimburse loyalty bonus."
        );
      }
    } catch (error) {
      if (error.response?.data?.message?.includes("unauthenticated")) {
        logout();
      }
      console.error("Reimbursement error:", error);
      toast.error(
        error.response?.data?.message || "Failed to reimburse loyalty bonus.",
        { id: toastId }
      );
    } finally {
      setBonusToPay(null);
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
            <th className="p-5">Date</th>
            <th className="p-5">Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="8" className="text-center p-8">
                Loading...
              </td>
            </tr>
          ) : eligibleUsers.length > 0 ? (
            eligibleUsers.map((item, index) => {
              const serialNumber = (currentPage - 1) * perPage + (index + 1);
              return (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 text-sm border-b border-black/10 text-center"
                >
                  <td className="p-3">
                    {String(serialNumber).padStart(3, "0")}
                  </td>
                  <td className="p-4 capitalize">
                    {`${item.first_name} ${item.last_name}` || "-"}
                  </td>
                  <td className="p-4">{item.email || "-"}</td>
                  <td className="p-4">{item.username || "-"}</td>
                  <td className="p-4 capitalize">{item.mobile || "-"}</td>
                  <td className="p-4 capitalize">
                    <div
                      className={`w-[100px] py-2 ${
                        item.enabled === 1
                          ? "bg-[#dff7ee]/80 text-pryclr"
                          : "bg-[#c51236]/20 text-red-600"
                      } rounded-lg text-center font-normal mx-auto border border-pryClr/15`}
                    >
                      {item.enabled === 1 ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-pryClr font-semibold">
                    {formatISODateToCustom(item.created_at)}
                  </td>
                  <td className="p-4 text-sm text-pryClr font-semibold">
                    <button
                      type="button"
                      title={`Delete ${item.username}`}
                      onClick={() => handleConfirmPayout(item)}
                      className="text-red-600 hover:text-red-700 cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-pryClr/10 transition-all duration-300 rounded-lg mx-auto"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" className="text-center p-8">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!isLoading && eligibleUsers.length > 0 && (
        <div className="flex justify-center items-center gap-2 p-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={lastPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {showConfirmModal && (
        <Modal onClose={() => setShowConfirmModal(false)}>
          <ConfirmationDialog
            message={`Are you sure you want to payout ${formatterUtility(
              Number(bonusToPay?.amount)
            )} to ${bonusToPay?.username}? This action cannot be undone.`}
            onConfirm={confirmPayout}
            onCancel={() => setShowConfirmModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageLoyalties;
