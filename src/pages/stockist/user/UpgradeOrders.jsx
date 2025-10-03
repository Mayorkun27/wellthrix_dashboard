import React, { useEffect, useState } from "react";
import PaginationControls from "../../../utilities/PaginationControls";
import { useUser } from "../../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";
import {
  formatISODateToCustom,
  formatterUtility,
  formatTransactionType,
} from "../../../utilities/formatterutility";
import { GiCheckMark } from "react-icons/gi";
import Modal from "../../../components/modals/Modal";
import ConfirmationDialog from "../../../components/modals/ConfirmationDialog";
import { MdRemoveRedEye } from "react-icons/md";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const UpgradeOrders = () => {
  const { token, logout, user, refreshUser } = useUser();
  const [upgradeOrders, setUpgradeOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(40);
  const [selectedOrder, setSelectedOrder] = useState(null);
  // const [orderProducts, setOrderProducts] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const statusLabels = {
    pending: { text: "Pending", className: "bg-yellow-100 text-yellow-600" },
    failed: { text: "Failed", className: "bg-[#c51236]/20 text-red-600" },
    picked: { text: "Picked", className: "bg-[#dff7ee]/80 text-pryclr" },
  };

  const fetchUpgradeOrders = async () => {
    setIsLoading(true);
    try {
        const response = await axios.post(
            `${API_URL}/api/stockists/${user?.id}/user`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: {
                    transactions_page: currentPage,
                    perPage: perPage,
                },
            }
        );

      console.log("this response", response);

      if (response.status === 200) {
        const { data, current_page, last_page, per_page } = response.data.transactions;
        // console.log("data", data);
        setUpgradeOrders(data);
        setCurrentPage(current_page);
        setLastPage(last_page);
        setPerPage(per_page);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch upgrade orders."
        );
      }
    } catch (error) {
      if (error.response?.data?.message?.includes("unauthenticated")) {
        logout();
        toast.error("Session expired. Please login again.");
      }
      console.error("upgrade orders fetch error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred fetching upgrade orders."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.id) {
      console.log("Fetching orders for page:", currentPage);
      fetchUpgradeOrders();
    }
  }, [currentPage, token, user?.id]);

  const handleConfirmRegistrationClick = (order) => {
    setOrderToConfirm(order);
    setShowConfirmModal(true);
  };

  const performRegistrationConfirmation = async () => {
    if (!orderToConfirm?.orders?.id) return;

    setIsConfirming(true);
    setShowConfirmModal(false);
    const toastId = toast.loading(
      `Confirming upgrade product pickups for ${orderToConfirm?.user?.username}...`
    );

    try {
      const response = await axios.put(
        `${API_URL}/api/orders/${orderToConfirm.orders?.id}/confirm`,
        {}, // Empty body, as it's typically just a status update
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("reistration confirmation response", response);

      if (response.status === 200) {
        toast.success(
          response.data.message ||
            `upgrade product pickups for ${orderToConfirm?.user?.username} confirmed!`,
          { id: toastId }
        );
        fetchUpgradeOrders();
        await refreshUser();
      } else {
        throw new Error(
          response.data.message || "Failed to confirm upgrade product pickups."
        );
      }
    } catch (error) {
      if (error.response?.data?.message?.includes("unauthenticated")) {
        logout();
      }
      console.error("Confirm upgrade product pickups error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred confirming upgrade product pickups.",
        { id: toastId }
      );
    } finally {
      setIsConfirming(false);
      setOrderToConfirm(null);
    }
  };

  const filteredProducts = upgradeOrders.filter(
    (upgradeOrder) => upgradeOrder.transaction_type === "upgrade_products"
  );
  console.log("filteredProducts", filteredProducts);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-gray-700 uppercase">
            <tr>
              <th className="px-4 text-center">S/N</th>
              <th className="px-4 text-center whitespace-nowrap">
                Transaction type
              </th>
              <th className="px-4 text-center">ORD ID</th>
              <th className="px-4 text-center">Receiver Username</th>
              <th className="px-4 text-center">Amount</th>
              <th className="px-4 text-center">Date</th>
              <th className="px-4 text-center">Status</th>
              <th className="px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center p-8">
                  Loading...
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((upgradeOrder, index) => {
                const statusKey =
                  upgradeOrder?.orders?.delivery?.toLowerCase();
                const { text, className } = statusLabels[statusKey] || {
                  text: statusKey || "unknown",
                  className: "bg-gray-200 text-gray-600",
                };

                const serialNumber = (currentPage - 1) * perPage + (index + 1);
                // Determine if the action button should be enabled based on status
                const canConfirm = statusKey === "pending"; // Only allow confirming 'pending' orders

                return (
                  <tr
                    key={upgradeOrder.id}
                    className="border-b border-black/10 text-xs"
                  >
                    <td className="p-3 text-center">
                      {String(serialNumber).padStart(3, "0")}
                    </td>
                    <td className="px-4 py-2 text-center capitalize">
                      {`${formatTransactionType(
                        upgradeOrder?.transaction_type
                      )}` || "-"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {`${upgradeOrder?.ref_no}` || "-"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {`${upgradeOrder?.orders?.user?.username}` || "-"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {formatterUtility(Number(upgradeOrder?.amount)) ||
                        "-"}
                    </td>
                    <td className="px-4 py-2 text-center text-pryClr font-semibold">
                      {formatISODateToCustom(
                        upgradeOrder.created_at
                      ).split(" ")[0] || "-"}
                    </td>
                    <td className="py-6 text-center">
                      <div
                        className={`w-[100px] py-2 ${className} rounded-md text-center font-normal mx-auto border border-pryClr/15`}
                      >
                        {text}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex flex-row items-center justify-center gap-2">
                        <button
                          type="button"
                          title={`View products`}
                          disabled={isConfirming} // Disable if not pending or if confirming another order
                          onClick={() => {
                            console.log(upgradeOrder)
                            setSelectedOrder(upgradeOrder)
                          }}
                          className="text-pryClr text-xl cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-pryClr/10 transition-all duration-300 rounded-lg disabled:opacity-25 disabled:cursor-not-allowed"
                        >
                          <MdRemoveRedEye />
                        </button>
                        <button
                          type="button"
                          title={
                            canConfirm
                              ? `Confirm registration for ${upgradeOrder.ref_no}`
                              : `Registration already ${text}`
                          }
                          disabled={!canConfirm || isConfirming} // Disable if not pending or if confirming another order
                          onClick={() =>
                            handleConfirmRegistrationClick(upgradeOrder)
                          }
                          className="text-pryClr text-xl cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-pryClr/10 transition-all duration-300 rounded-lg disabled:opacity-25 disabled:cursor-not-allowed"
                        >
                          <GiCheckMark />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-8">
                  No registration orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {!isLoading && filteredProducts.length > 0 && !filteredProducts.length > 10 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={lastPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && orderToConfirm && (
        <Modal onClose={() => setShowConfirmModal(false)}>
          <ConfirmationDialog
            type="confirm"
            title="Confirm upgrade products pickup?"
            message={`Are you sure you want to confirm upgrade products order pickup ${
              orderToConfirm?.ref_no
            }?`}
            onConfirm={performRegistrationConfirmation}
            onCancel={() => {
              setShowConfirmModal(false);
              setOrderToConfirm(null);
            }}
            confirmButtonText={isConfirming ? "Confirming..." : "Confirm"}
            cancelButtonText="Cancel"
            isConfirming={isConfirming}
          />
        </Modal>
      )}

      {selectedOrder && (
        <Modal onClose={() => setSelectedOrder(null)}>
          <h3 className="font-bold text-center md:text-xl">
            Ref ID: {selectedOrder.ref_no}
          </h3>
          <ul className="space-y-2 md:text-lg text-base my-4">
            <li>
              <span className="font-medium">Receiver&apos;s Name: </span>
              {`${selectedOrder?.orders?.user?.first_name} ${selectedOrder?.orders?.user?.last_name}`}
            </li>
            <li>
                <span className="font-medium">Receiver&apos;s Username: </span>
                {selectedOrder?.orders?.user?.username}
            </li>
            <span className="font-bold">Contact Information:</span>
            <li>
                <span className="font-medium">Receiver&apos;s Email: </span>
                {selectedOrder?.orders?.user?.email}
            </li>
            <li>
                <span className="font-medium">Receiver&apos;s Phone: </span>
                {selectedOrder?.orders?.user?.mobile}
            </li>
            <span className="font-bold">Products purchased:</span>
            {selectedOrder?.orders?.products && selectedOrder.orders?.products.map((product) => (
              <ul key={product.id}>
                <li>
                  <span className="font-medium capitalize">product name: </span>
                  {product?.product_name}
                </li>
                <li>
                  <span className="font-medium capitalize">
                    product price:{" "}
                  </span>
                  {formatterUtility(Number(product?.price))}
                </li>
                <li>
                  <span className="font-medium capitalize">product PV: </span>
                  {product?.product_pv}
                </li>
                <li>
                  <span className="font-medium capitalize">
                    product quantity:{" "}
                  </span>
                  {product?.product_quantity}
                </li>
              </ul>
            ))}
          </ul>
          <li className="list-none mt-4 text-lg">
            <span className="font-medium">Order amount: </span>
            {formatterUtility(Number(selectedOrder.amount))}
          </li>
          <div
            className={`w-full py-2 mt-4 ${
              selectedOrder?.orders?.delivery === "picked"
                ? "bg-[#dff7ee]/80 text-pryclr"
                : selectedOrder?.orders?.delivery === "failed"
                ? "bg-[#c51236]/20 text-red-600"
                : "bg-yellow-100 text-yellow-600"
            } rounded-lg text-center font-normal mx-auto border border-pryClr/15`}
          >
            Status:{" "}
            {selectedOrder?.orders?.delivery === "picked"
              ? "Picked"
              : selectedOrder?.orders?.delivery === "failed"
              ? "Failed"
              : "Pending"}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UpgradeOrders;
