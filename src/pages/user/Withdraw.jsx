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
import { MdPayment } from "react-icons/md";
import assets from "../../assets/assests";

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
      withdraw_from: "incentive_wallet",
      method: "manual",
    }, 
    enableReinitialize: true,
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
      method: Yup.string()
        .oneOf(['manual', 'paystack'], 'Invalid payment method')
        .required('Payment method is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log("Values to be submitted", values)
      setSubmitting(true);

      console.log(pin.join(""))
      console.log(values.account_number.toString())
      console.log(typeof values.account_number.toString())
      console.log(typeof pin.join(""))

      try {
        const response = await axios.post(`${API_URL}/api/withdraw`, { ...values, account_number: String(values.account_number), pin: pin.join("") }, {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });

        console.log("withdrawal response", response)

        if (response.status === 200) {
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
        <div className="shadow-sm rounded-xl bg-white overflow-x-auto md:p-8 p-6">
          <h1 className="text-[22px] font-semibold tracking-tight md:flex hidden">Withdraw Funds</h1>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setShowPinModal(true);
            }}
            className="grid md:grid-cols-2 grid-cols-1 lg:gap-x-8 lg:gap-y-4 gap-6"
          >
            <p className="text-black md:col-span-2 col-span-1 md:mt-6 font-medium tracking-tight">Withdraw Method</p>
            <div className="flex md:flex-row flex-col gap-4 md:col-span-2 col-span-1 mb-5">
              {/* Paystack Option */}
              <div
                onClick={() => formik.setFieldValue("method", "paystack")}
                className={`flex-1 bg-pryClr/20 md:px-4 px-2 md:py-8 py-6 rounded-lg flex items-center justify-between border ${formik.values.method === 'paystack' ? 'border-pryClr/30 shadow-md' : 'border-black/50'} cursor-pointer`}
              >
                 <div className="flex lg:gap-2 gap-4 items-center">
                    <MdPayment className={"md:text-4xl text-3xl text-pryClr"} />
                    <div>
                      <p className="md:text-[14px] text-xs font-medium">Paystack</p>
                      <p className="md:text-[12px] text-[10px]">
                        Pay securely with your card or bank account
                      </p>
                    </div>
                  </div>
                <div className="w-9 h-9 p-2 relative bg-pryClr rounded-full flex items-center justify-center">
                  <div className="bg-white w-full h-full rounded-full"></div>
                  {formik.values.method === 'paystack' && (
                    <img src={assets.mark} alt="" className="scale-125 w-3 h-3 absolute top-1/2 -translate-y-2/3 left-1/2 -translate-x-2/5" />
                  )}
                </div>
              </div>

              {/* Manual Payment Option */}
              <div
                onClick={() => formik.setFieldValue("method", "manual")}
                className={`flex-1 bg-pryClr/20 md:px-4 px-2 md:py-8 py-6 rounded-lg flex items-center justify-between border ${formik.values.method === 'manual' ? 'border-pryClr/30 shadow-md' : 'border-black/50'} cursor-pointer`}
              >
                <div className="flex lg:gap-2 gap-4 items-center">
                  <MdPayment className={"md:text-4xl text-3xl text-pryClr"} />
                  <div>
                    <p className="md:text-[14px] text-xs font-medium">Manual</p>
                    <p className="md:text-[12px] text-[10px]">
                      Pay via bank transfer and upload proof
                    </p>
                  </div>
                </div>
                <div className="w-9 h-9 p-2 relative bg-pryClr rounded-full flex items-center justify-center">
                  <div className="bg-white w-full h-full rounded-full"></div>
                  {formik.values.method === 'manual' && (
                    <img src={assets.mark} alt="" className="scale-125 w-3 h-3 absolute top-1/2 -translate-y-2/3 left-1/2 -translate-x-2/5" />
                  )}
                </div>
              </div>
            </div>
            <div className="w-full space-y-2">
              <label htmlFor="amount" className="text-sm mb-4">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter amount to withdraw"
                className="w-full px-4 py-2.5 border border-pryClr/30 rounded-md mt-2 outline-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
                value={formik.values.bank_name}
                disabled
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder=""
                className="w-full px-4 py-2.5 border border-pryClr/30 rounded-md mt-2 outline-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
                value={formik.values.account_number}
                disabled
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder=""
                className="w-full px-4 py-2.5 border border-pryClr/30 rounded-md mt-2 outline-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
                value={formik.values.account_name}
                disabled
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder=""
                className="w-full px-4 py-2.5 border border-pryClr/30 rounded-md mt-2 outline-0 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {formik.touched.account_name && formik.errors.account_name && (
                <p className="text-sm text-red-500">{formik.errors.account_name}</p>
              )}
            </div>
            <div className="md:col-span-2 col-span-1 text-center">
              <button
                type="submit"
                disabled={formik.isSubmitting}
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