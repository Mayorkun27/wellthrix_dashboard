import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUser } from "../../context/UserContext";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modals/Modal";
import OverviewCards from "../../components/cards/OverviewCards";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const P2P = () => {
  const { user, token, logout, refreshUser } = useUser();
  const navigate = useNavigate();
  const [pin, setPin] = useState(['', '', '', '']);
  const [showPinModal, setShowPinModal] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [receiverId, setReceiverId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const formik = useFormik({
    initialValues: {
      user_id: user?.id || "",
      amount: "",
      recipient_username: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Amount is required")
        .min(100, "Minimum transfer amount is 100")
        .max(user?.e_wallet || 0, "Insufficient E-Wallet balance!"),
      recipient_username: Yup.string()
        .required("Recipient username is required")
        .min(3, "Username must be at least 3 characters"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (!receiverId) {
        toast.error("Please verify the recipient username first");
        return;
      }
      setSubmitting(true);
      try {
        const response = await axios.post(
          `${API_URL}/api/p2p`,
          {
            user_id: values.user_id,
            receiver_id: receiverId,
            amount: values.amount,
            wallet: "e_wallet",
            pin: pin.join(""),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          toast.success(response.data.message || "Transfer initiated successfully");
          refreshUser(token);
          navigate("/user/transactions");
        } else {
          throw new Error(response.data.message || "An error occurred during transfer.");
        }
      } catch (error) {
        if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
          logout();
        }
        console.error("Transfer error:", error.response?.data || error);
        toast.error(error.response?.data?.message || "An error occurred initiating transfer");
      } finally {
        setSubmitting(false);
        setShowPinModal(false);
        setPin(['', '', '', '']);
      }
    },
  });

  const handlePinChange = (index, value) => {
    if (value === '' || /^[0-9]$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 3) {
        document.getElementById(`pin-input-${index + 1}`).focus();
      }
    }
  };

  const handleUserSearch = async () => {
    if (!formik.values.recipient_username) {
      toast.error("Please enter a username to search");
      return;
    }
    setIsSearching(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/validate-username`,
        { username: formik.values.recipient_username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Validate username response:", response.data);
      const foundUser = response.data.data;
      if (response.status === 200 && foundUser && foundUser.id) {
        setRecipientName(`${foundUser.first_name || ''} ${foundUser.last_name || ''}`.trim());
        setReceiverId(foundUser.id);
        toast.success("User found!");
      } else {
        throw new Error("User not found in response data");
      }
    } catch (error) {
      setRecipientName("");
      setReceiverId(null);
      console.error("User search error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "User not found");
    } finally {
      setIsSearching(false);
    }
  };

  const isPinComplete = pin.every(digit => digit !== '');

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
        <OverviewCards
          amount={user?.e_wallet || 0}
          icon={
            <div className="bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl">
              <MdOutlineAccountBalanceWallet />
            </div>
          }
          walletType={"E-Wallet"}
        />
      </div>
      <div className="shadow-sm rounded-xl bg-white space-y-4 overflow-x-auto md:p-8 p-6">
        <h1 className="text-[22px] font-semibold tracking-tight">E-wallet Transfer</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.validateForm();
            setShowPinModal(true);
          }}
          className="grid md:grid-cols-2 grid-cols-1 lg:gap-x-8 lg:gap-y-4 gap-6"
        >
          <div className="w-full space-y-2">
            <label htmlFor="amount" className="text-sm mb-4">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter amount to transfer"
              className="w-full px-4 py-2.5 border border-pryClr/30 rounded-md mt-2 outline-0"
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-sm text-red-500">{formik.errors.amount}</p>
            )}
          </div>
          <div className="w-full space-y-2">
            <label htmlFor="recipient_username" className="text-sm mb-4">Recipient Username</label>
            <div className="flex gap-2">
              <input
                type="text"
                id="recipient_username"
                name="recipient_username"
                value={formik.values.recipient_username}
                onChange={(e) => {
                  formik.handleChange(e);
                  setRecipientName("");
                  setReceiverId(null);
                }}
                onBlur={formik.handleBlur}
                placeholder="Enter recipient's username"
                className="w-full px-4 py-2.5 border border-pryClr/30 rounded-md mt-2 outline-0"
              />
              <button
                type="button"
                onClick={handleUserSearch}
                disabled={isSearching}
                className="bg-pryClr text-white px-4 py-2.5 rounded-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? "Searching..." : "Done"}
              </button>
            </div>
            {formik.touched.recipient_username && formik.errors.recipient_username && (
              <p className="text-sm text-red-500">{formik.errors.recipient_username}</p>
            )}
          </div>
          <div className="md:col-span-2 col-span-1 w-full space-y-2">
            <label htmlFor="recipient_name" className="text-sm mb-4 text-center">Recipient Name</label>
            <input
              type="text"
              id="recipient_name"
              value={recipientName}
              disabled
              placeholder="Recipient name will appear here"
              className="w-full px-4 py-2.5 border border-pryClr/30 rounded-md mt-2 outline-0 bg-gray-100 cursor-not-allowed text-center"
            />
          </div>
          <div className="md:col-span-2 col-span-1 text-center">
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid || !receiverId}
              className="mt-8 bg-pryClr text-white capitalize text-sm lg:w-1/2 w-[300px] h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Transfer
            </button>
          </div>
        </form>
      </div>

      {showPinModal && (
        <Modal onClose={() => setShowPinModal(false)}>
          <div className="w-full text-center">
            <h3 className="text-2xl font-bold">Confirm Transaction</h3>
            <p className="md:text-base text-xs">Enter your PIN to complete this transfer</p>
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
                    if (e.key === 'Backspace' && !e.target.value && index > 0) {
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
              onClick={formik.handleSubmit}
              disabled={!isPinComplete || formik.isSubmitting}
              className="mt-8 bg-pryClr text-secClr font-medium lg:w-1/2 w-full h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Confirming..." : "Confirm"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default P2P;