import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup"
import { useUser } from "../../context/UserContext";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OverviewCards from "../../components/cards/OverviewCards";
import { BsWallet2 } from "react-icons/bs";
import Modal from "../../components/modals/Modal";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Withdraw = () => {
  const { user, token, logout, refreshUser } = useUser();
  const navigate = useNavigate();
  const [pin, setPin] = useState(['', '', '', '']);
  const [showPinModal, setShowPinModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      user_id: user?.id || "",
      amount: "",
      bank_name: user?.bank_name || "",
      account_number: user?.account_number || "",
      account_name: user?.account_name || "",
      email: user?.email || "",
      withdraw_from: "",
    }, 
    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Amount is required")
        .min(100, "Minimum withdrawal amount is 100")
        .max(user?.incentive_wallet, "Insufficient funds in your incentive wallet"),
      withdraw_from: Yup.string()
        .required("Wallet to withdraw from is required")
        .oneOf(["incentive_wallet"], "Only incentive wallet is available for withdrawal"),
      bank_name: Yup.string()
        .required("Bank Name is required"),
      account_number: Yup.string()
        .required("Account number is required"),
      account_name: Yup.string()
        .required("Account name is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log("Values to be submitted", values)
      setSubmitting(true);

      try {
        const response = await axios.post(`${API_URL}/api/withdraw`, { ...values, pin: pin.join("") }, {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });

        console.log("withdrawal response", response)

        if (response.status === 201 && response.data.ok) {
          toast.success(response.data.message || `Withdrawal initiated successfully`);
          refreshUser(token);

          navigate("/user/transactions");

        } else {
          throw new Error(response.data.message || "An error occurred during withdrawal.");
        }
      } catch (error) {
        if (error.response?.data?.message?.toLowerCase() === "unauthenticated") {
          logout();
        }
        console.error("An error occurred initiating withdrawal", error);
        toast.error(error.response?.data?.message || "An error occurred initiating withdrawal");
      } finally {
        setSubmitting(false); 
        setShowPinModal(false);
        setPin(['', '', '', '']);
      }
    }
  })

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

  const isPinComplete = pin.every(digit => digit !== '');

  return (
    <>
      <div className="space-y-6">
        <div className="md:w-1/2 w-full">
          <OverviewCards
            amount={user?.incentive_wallet || 0}
            icon={
              <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
                <BsWallet2 />
              </div>
            }
            walletType={"Incentive Wallet"}
          />
        </div>
        <div className="shadow-sm rounded-xl bg-white overflow-x-auto p-8">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              formik.validateForm().then(errors => {
                if (Object.keys(errors).length === 0) {
                  setShowPinModal(true);
                } else {
                  toast.error("Please fix the errors before proceeding.");
                }
              })
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
                placeholder=""
                className="w-full px-4 py-2.5 border border-pryClr/30 rounded-md mt-2 outline-0"
              />
              {formik.touched.amount && formik.errors.amount && (
                <p className="text-sm text-red-500">{formik.errors.amount}</p>
              )}
            </div>
            <div className="w-full space-y-2">
              <label htmlFor="bank_name" className="text-sm mb-4">Bank Name</label>
              <input
                type="text"
                id="bank_name"
                name="bank_name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder=""
                className="w-full px-4 py-2.5 border border-pryClr/30 rounded-md mt-2 outline-0"
              />
              {formik.touched.bank_name && formik.errors.bank_name && (
                <p className="text-sm text-red-500">{formik.errors.bank_name}</p>
              )}
            </div>
            <div className="w-full space-y-2">
              <label htmlFor="account_number" className="text-sm mb-4">Account Number</label>
              <input
                type="text"
                id="account_number"
                name="account_number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder=""
                className="w-full px-4 py-2.5 border border-pryClr/30 rounded-md mt-2 outline-0"
              />
              {formik.touched.account_number && formik.errors.account_number && (
                <p className="text-sm text-red-500">{formik.errors.account_number}</p>
              )}
            </div>
            <div className="w-full space-y-2">
              <label htmlFor="account_name" className="text-sm mb-4">Account Name</label>
              <input
                type="text"
                id="account_name"
                name="account_name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder=""
                className="w-full px-4 py-2.5 border border-pryClr/30 rounded-md mt-2 outline-0"
              />
              {formik.touched.account_name && formik.errors.account_name && (
                <p className="text-sm text-red-500">{formik.errors.account_name}</p>
              )}
            </div>
            <div className="md:col-span-2 col-span-1 text-center">
              <button
                type="submit"
                className={`mt-8 bg-pryClr text-white capitalize text-sesm lg:w-1/2 w-[300px] h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                withdraw
              </button>
              </div>
          </form>
        </div>
      </div>

      {showPinModal && (
        <Modal onClose={() => setShowPinModal(false)}>
          <div className='w-full text-center'>
            <h3 className='text-2xl font-bold'>Confirm Transaction</h3>
            <p className='md:text-base text-xs'>Enter your pin to complete this transaction</p>
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
              className={`mt-8 bg-pryClr text-secClr font-medium lg:w-1/2 w-full h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {formik.isSubmitting ? "Confirming..." : "Confirm"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Withdraw;