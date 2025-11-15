import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import { formatterUtility } from "../../utilities/formatterutility";
import OverviewCards from "../../components/cards/OverviewCards";
import { TbTruckDelivery } from "react-icons/tb";
import Modal from "../../components/modals/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import PickUps from "./user/PickUps";
import History from "./user/History";
import RegistrationOrders from "./user/RegistrationOrders";
import Inventory from "./user/Inventory";
import UpgradeOrders from "./user/UpgradeOrders";

const API_URL = import.meta.env.VITE_API_BASE_URL || "";

const Stockist = () => {
  const { token, logout, user, refreshUser } = useUser();
  const [activeTab, setActiveTab] = useState("register");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const navigate = useNavigate();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [showPinModal, setShowPinModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    refreshUser();
  }, []);

  const formik = useFormik({
    initialValues: {
      user_id: user?.id,
      amount: "",
      from: "stockist_balance",
      to: "earning_wallet",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Amount is required!.")
        .min(100, `Minimum amount to withdraw is ${formatterUtility(100)}`)
        .max(user?.stockist_balance, `Insufficient funds!`),
    }),
    onSubmit: async (values) => {
      // console.log("stockist withdraw values", values);
      // console.log("Validation successful, showing pin modal");
      setShowWithdrawModal(false);
      setShowPinModal(true); // ✅ show pin modal
      setPin(["", "", "", ""]);
    },
  });

  const handleWithdraw = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/stockist/withdraw`,
        { ...formik.values, pin: pin.join("") },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("withdrawal response", response);

      if (response.status === 200) {
        toast.success(
          response.data.message || `Withdraw initiated successfully`
        );
        navigate("/user/transactions");
      } else {
        throw new Error(
          response.data.message || "An error occurred moving funds."
        );
      }
    } catch (error) {
      if (
        error.response?.data?.message?.toLowerCase().includes("unauthenticated")
      ) {
        logout();
      }
      console.error("An error occurred moving funds", error);
      toast.error(
        error.response?.data?.message || "An error occurred moving funds"
      );
    } finally {
      setIsSubmitting(false);
      setPin(["", "", "", ""]);
    }
  };

  const handlePinChange = (index, value) => {
    if (value === "" || /^[0-9]$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 3) {
        document.getElementById(`pin-input-${index + 1}`).focus();
      }
    }
  };

  const isPinComplete = pin.every((digit) => digit !== "");

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm grid md:grid-cols-2 grid-cols-1 gap-8">
      {/* Header Section */}
      <div>
        <OverviewCards
          amount={user?.stockist_balance || 0}
          icon={
            <div className="bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl">
              <TbTruckDelivery />
            </div>
          }
          walletType={"Stockist Balance"}
        />
      </div>
      <div className="flex items-center md:justify-end justify-center md:-mt-0 -mt-4">
        <button
          type="button"
          onClick={() => setShowWithdrawModal(true)}
          className="bg-accClr px-4 h-[40px] md:w-max w-3/4 rounded-md font-medium cursor-pointer"
        >
          Withdraw
        </button>
      </div>

      {/* Tabs Section */}
      <div className="md:col-span-2">
        <div className="flex md:justify-end justify-start gap-4 overflow-x-scroll no-scrollbar">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 h-[40px] font-semibold cursor-pointer rounded-lg md:text-base text-sm whitespace-nowrap ${
              activeTab === "inventory"
                ? "bg-pryClr text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab("pickup")}
            className={`px-4 h-[40px] font-semibold cursor-pointer rounded-lg md:text-base text-sm whitespace-nowrap ${
              activeTab === "pickup"
                ? "bg-pryClr text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Repurchase Orders
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`px-4 h-[40px] font-semibold cursor-pointer rounded-lg md:text-base text-sm whitespace-nowrap ${
              activeTab === "register"
                ? "bg-pryClr text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Registration Orders
          </button>
          <button
            onClick={() => setActiveTab("upgrade")}
            className={`px-4 h-[40px] font-semibold cursor-pointer rounded-lg md:text-base text-sm whitespace-nowrap ${
              activeTab === "upgrade"
                ? "bg-pryClr text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Upgrade Orders
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 h-[40px] font-semibold cursor-pointer rounded-lg md:text-base text-sm whitespace-nowrap ${
              activeTab === "history"
                ? "bg-pryClr text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Transaction History
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full md:col-span-2">
        {activeTab === "pickup" ? (
          <PickUps />
        ) : activeTab === "history" ? (
          <History />
        ) : activeTab === "inventory" ? (
          <Inventory stockistId={user?.id} />
        ) : activeTab === "upgrade" ? (
          <UpgradeOrders stockistId={user?.id} />
        ) : (
          <RegistrationOrders />
        )}
      </div>

      {showWithdrawModal && (
        <Modal onClose={() => setShowWithdrawModal(false)}>
          <form onSubmit={formik.handleSubmit} className="text-center">
            <h3 className="text-2xl font-bold">Move Stockist balance</h3>
            <p className="md:text-base text-xs">
              Move from your stockist balance to your earnings wallet
            </p>
            <div className="space-y-1 text-start mt-8">
              <label className="block text-sm font-medium" htmlFor="amount">
                Enter amount to move
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-3 border rounded-lg border-gray-300 outline-0"
              />
              {formik.touched.amount && formik.errors.amount && (
                <p className="text-sm text-red-600">{formik.errors.amount}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-8 bg-pryClr text-secClr font-medium w-full h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Withdraw
            </button>
          </form>
        </Modal>
      )}

      {showPinModal && (
        <Modal onClose={() => setShowPinModal(false)}>
          <div className="w-full text-center">
            <h3 className="text-2xl font-bold">Confirm Transaction</h3>
            <p className="md:text-base text-xs">
              Enter your pin to complete this transaction
            </p>
            <div className="w-full flex justify-center md:gap-8 gap-4 px-4 mt-8">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="password"
                  maxLength={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pin[index]}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  className="w-14 h-14 md:w-16 md:h-16 bg-[#D9D9D9] rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#2F5318] border border-gray-300"
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !e.target.value && index > 0) {
                      document.getElementById(`pin-input-${index - 1}`).focus();
                    }
                  }}
                  id={`pin-input-${index}`}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={!isPinComplete || isSubmitting}
              className={`mt-8 bg-pryClr text-secClr font-medium lg:w-1/2 w-full h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? "Confirming..." : "Confirm"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Stockist;
