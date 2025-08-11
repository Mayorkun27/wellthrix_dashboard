// import React, { useState } from "react";
// import assets from "../../assets/assests";
// import OverviewCards from "../../components/cards/OverviewCards";
// import { useUser } from "../../context/UserContext";
// import { MdOutlineAccountBalanceWallet, MdPayment } from "react-icons/md";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import Modal from "../../components/modals/Modal";
// import { toast } from "sonner";
// import axios from "axios";

// const Deposit = () => {
//   const [isSelected, setIsSelected] = useState(false);
//   const { user, token, logout } = useUser()
//   const [pin, setPin] = useState(['', '', '', '']);
//   const [showPinModal, setShowPinModal] = useState(false);
//   const [isloading, setIsLoading] = useState(false)

//   const formik = useFormik({
//     initialValues: {
//       user_id: user?.id || "",
//       amount: "",
//       email: user?.email || "",
//       payment_method: "manual",
//       proof_of_payment: null,
//     },
//     enableReinitialize: true,
//     validationSchema: Yup.object({
//       amount: Yup.number()
//         .required("Amount is required")
//         .min(100, "Minimum deposit amount is ₦100"),
//       email: Yup.string().email("Invalid email format").required("Email is required"),
//       proof_of_payment: Yup.mixed()
//         .required('Proof of payment is required')
//     }),
//     onSubmit: async (values, { setSubmitting }) => {
//       console.log("Deposit form values", values);
//       setSubmitting(true)

//       const formData = new FormData();
//       formData.append('user_id', values.user_id);
//       formData.append('amount', values.amount);
//       formData.append('email', values.email);
//       formData.append('payment_method', values.payment_method);
      
//       // Add the PIN to the formData object
//       formData.append('pin', pin.join(''));
      
//       if (values.proof_of_payment) {
//         formData.append('proof_of_payment', values.proof_of_payment);
//       }
      
//       try {
//         const formDataObject = {};
//         for (let [key, value] of formData.entries()) {
//             formDataObject[key] = value;
//         }

//         console.log("formDataObject", formDataObject)

//         const response = await axios.post(`${API_URL}/api/wallets/fund/initiate`, { ...formData, pin: pin.join('')}, {
//           headers: {
//             "Authorization": `Bearer ${token}`,
//           }
//         });

//         console.log("deposit response", response)

//         if (response.status === 200) {
//           toast.success(response.data.message || `Deposit successful`)
//           setTimeout(() => {
//             navigate("/user/transactions")
//           }, 2000)
//         }

//       } catch (error) {
//         if (error.response.data.message.toLowerCase() == "unauthenticated") {
//           logout()
//         }
//         console.error("An error occured initiating deposit", error)
//         toast.error(error.response.data.message || "An error occured initiating deposit")
//       } finally {
//         setSubmitting(false)
//         setShowPinModal(false);
//         setPin(['', '', '', '']);
//       }
//     }
//   })

//   const handlePinChange = (index, value) => {
//     if (value === '' || /^[0-9]$/.test(value)) {
//       const newPin = [...pin];
//       newPin[index] = value;
//       setPin(newPin);

//       if (value && index < 3) {
//         document.getElementById(`pin-input-${index + 1}`).focus();
//       }
//     }
//   };

//   const isPinComplete = pin.every(digit => digit !== '');

//   return (
//     <div className="space-y-4">
//       <div className="md:w-1/2 w-full">
//         <OverviewCards
//           amount={user?.e_wallet || 0}
//           icon={
//             <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
//               <MdOutlineAccountBalanceWallet />
//             </div>
//           }
//           walletType={"E-Wallet"}
//         /> 
//       </div>
//       <div className="shadow-sm rounded bg-white overflow-x-auto p-8">
//         <h1 className="text-[22px] font-semibold">Deposit Funds</h1>
//         <form onSubmit={formik.handleSubmit}>
//           <div className="w-full mt-5">
//             <label htmlFor="text" className="text-[16px] font-medium">
//               Amount
//             </label>
//             <input
//               required
//               type="number"
//               id="amount"
//               name="amount"
//               value={formik.values.amount}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               placeholder={`${"₦"} 0.00`}
//               className="w-full px-4 h-[50px] border border-pryClr rounded-md mt-2 outline-0"
//             />
//             {formik.touched.amount && formik.errors.amount && (
//               <p className="text-red-600">{formik.errors.amount}</p>
//             )}
//           </div>
//           <input 
//             type="file" 
//             className="border mt-5" 
//             id="proof_of_payment"
//             name="proof_of_payment"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//           />
//           {formik.touched.proof_of_payment && formik.errors.proof_of_payment && (
//               <p className="text-red-600">{formik.errors.proof_of_payment}</p>
//             )}
//           <p className="text-black mt-6 mb-3">Deposit Method</p>
//           <div className="bg-pryClr/20 px-5 py-8 rounded-lg flex items-center justify-between border border-black/50">
//             <div className="flex lg:gap-5 gap-4 items-center">
//               <MdPayment className={"text-4xl text-pryClr"} />
//               <div>
//                 <p className="text-[14px]">Paystack</p>
//                 <p className="text-[12px]">
//                   Pay securely with your card or bank account
//                 </p>
//               </div>
//             </div>

//             <div
//               onClick={() => setIsSelected(!isSelected)}
//               className="w-9 h-9 bg-pryClr rounded-full flex items-center justify-center cursor-pointer"
//             >
//               <div className="bg-secClr w-5 h-5 rounded-full flex items-center justify-center">
//                 {isSelected && (
//                   <img
//                     src={assets.mark}
//                     alt=""
//                     className="w-3 h-3 text-secClr"
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={() => setShowPinModal(true)}
//             disabled={!formik.isValid || formik.isSubmitting}
//             className={`mt-8 bg-pryClr text-secClr font-medium w-full h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
//           >
//             Confirm Deposit
//           </button>
//         </form>
//       </div>

//       {showPinModal && (
//         <Modal onClose={() => setShowPinModal(false)}>
//           <div className='w-full text-center'>
//             <h3 className='text-2xl font-bold'>Confirm Transaction</h3>
//             <p className='md:text-base text-xs'>Enter your pin to complete this transaction</p>
//             <div className="w-full flex justify-center md:gap-8 gap-4 px-4 mt-8">
//               {[0, 1, 2, 3].map((index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   maxLength={1}
//                   inputMode="numeric"
//                   pattern="[0-9]*"
//                   value={pin[index]}
//                   onChange={(e) => handlePinChange(index, e.target.value)}
//                   className="w-14 h-14 md:w-16 md:h-16 bg-[#D9D9D9] rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#2F5318] border border-gray-300"
//                   onKeyDown={(e) => {
//                     if (e.key === 'Backspace' && !e.target.value && index > 0) {
//                       document.getElementById(`pin-input-${index - 1}`).focus();
//                     }
//                   }}
//                   id={`pin-input-${index}`}
//                   autoFocus={index === 0}
//                 />
//               ))}
//             </div>
//             <button
//               type="button"
//               onClick={formik.handleSubmit}
//               disabled={!isPinComplete || isloading}
//               className={`mt-8 bg-pryClr text-secClr font-medium lg:w-1/2 w-full h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
//             >
//               {formik.isSubmitting ? "Confirming..." : "Confirm"}
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default Deposit;



import React, { useState } from "react";
import assets from "../../assets/assests";
import OverviewCards from "../../components/cards/OverviewCards";
import { useUser } from "../../context/UserContext";
import { MdOutlineAccountBalanceWallet, MdPayment } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "../../components/modals/Modal";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Deposit = () => {
  const { user, token, logout } = useUser();
  const navigate = useNavigate();
  const [pin, setPin] = useState(['', '', '', '']);
  const [showPinModal, setShowPinModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      user_id: user?.id || "",
      amount: "",
      email: user?.email || "",
      payment_method: "manual",
      proof_of_payment: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Amount is required")
        .min(100, "Minimum deposit amount is ₦100"),
      email: Yup.string().email("Invalid email format").required("Email is required"),
      proof_of_payment: Yup.mixed()
        .when('payment_method', {
          is: (payment_method) => payment_method && payment_method === "manual",
          then: (schema) => schema
            .required('Proof of payment is required'),
            otherwise: (schema) => schema.notRequired()
        }),
      payment_method: Yup.string()
        .oneOf(['manual', 'paystack'], 'Invalid payment method')
        .required('Payment method is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('user_id', values.user_id);
      formData.append('amount', values.amount);
      formData.append('email', values.email);
      formData.append('payment_method', values.payment_method);
      formData.append('pin', pin.join(''));

      if (values.proof_of_payment) {
        formData.append('proof_of_payment', values.proof_of_payment);
      }

      try {
        const response = await axios.post(`${API_URL}/api/wallets/fund/initiate`, formData, {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });

        console.log("deposit response", response)

        if (response.status === 201 && response.data.ok) {
          toast.success(response.data.message || `Deposit successful`);
          if (response.data.authorization_url) {
            setTimeout(() => {
              toast.info("Redirecting to payment gateway...");
              setTimeout(() => {
                window.location.href = response.data.authorization_url;
              }, 1000);
            }, 1000);
          } else {
            setTimeout(() => {
              navigate("/user/transactions");
            }, 2000);
          }
        } else {
          throw new Error(response.data.message || "An error occurred during deposit.");
        }
      } catch (error) {
        if (error.response?.data?.message?.toLowerCase() === "unauthenticated") {
          logout();
        }
        console.error("An error occurred initiating deposit", error);
        toast.error(error.response?.data?.message || "An error occurred initiating deposit");
      } finally {
        setTimeout(() => {
          setSubmitting(false);
          setShowPinModal(false);
          setPin(['', '', '', '']);
        }, 2000);
      }
    }
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

  const isPinComplete = pin.every(digit => digit !== '');

  return (
    <div className="space-y-4">
      <div className="md:w-1/2 w-full">
        <OverviewCards
          amount={user?.e_wallet || 0}
          icon={
            <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
              <MdOutlineAccountBalanceWallet />
            </div>
          }
          walletType={"E-Wallet"}
        />
      </div>
      <div className="shadow-sm rounded-xl bg-white overflow-x-auto p-8">
        <h1 className="text-[22px] font-semibold">Deposit Funds</h1>
        <form onSubmit={(e) => { e.preventDefault(); setShowPinModal(true); }}>
          <p className="text-black mt-6 mb-3 font-medium">Deposit Method</p>
          <div className="flex gap-4">
            {/* Paystack Option */}
            <div
              onClick={() => formik.setFieldValue("payment_method", "paystack")}
              className={`flex-1 bg-pryClr/20 px-4 py-8 rounded-lg flex items-center justify-between border ${formik.values.payment_method === 'paystack' ? 'border-pryClr/30 shadow-md' : 'border-black/50'} cursor-pointer`}
            >
              <div className="flex lg:gap-2 gap-4 items-center">
                <MdPayment className={"text-4xl text-pryClr"} />
                <div>
                  <p className="text-[14px] font-medium">Paystack</p>
                  <p className="text-[12px]">
                    Pay securely with your card or bank account
                  </p>
                </div>
              </div>
              <div className="w-9 h-9 p-2 relative bg-pryClr rounded-full flex items-center justify-center">
                <div className="bg-white w-full h-full rounded-full"></div>
                {formik.values.payment_method === 'paystack' && (
                  <img src={assets.mark} alt="" className="scale-125 w-3 h-3 absolute top-1/2 -translate-y-2/3 left-1/2 -translate-x-2/5" />
                )}
              </div>
            </div>

            {/* Manual Payment Option */}
            <div
              onClick={() => formik.setFieldValue("payment_method", "manual")}
              className={`flex-1 bg-pryClr/20 px-4 py-8 rounded-lg flex items-center justify-between border ${formik.values.payment_method === 'manual' ? 'border-pryClr/30 shadow-md' : 'border-black/50'} cursor-pointer`}
            >
              <div className="flex lg:gap-2 gap-4 items-center">
                <MdPayment className={"text-4xl text-pryClr"} />
                <div>
                  <p className="text-[14px] font-medium">Manual</p>
                  <p className="text-[12px]">
                    Pay via bank transfer and upload proof
                  </p>
                </div>
              </div>
              <div className="w-9 h-9 p-2 relative bg-pryClr rounded-full flex items-center justify-center">
                <div className="bg-white w-full h-full rounded-full"></div>
                {formik.values.payment_method === 'manual' && (
                  <img src={assets.mark} alt="" className="scale-125 w-3 h-3 absolute top-1/2 -translate-y-2/3 left-1/2 -translate-x-2/5" />
                )}
              </div>
            </div>
          </div>
          {formik.touched.payment_method && formik.errors.payment_method && (
            <p className="text-red-600">{formik.errors.payment_method}</p>
          )}
          <div className="w-full mt-5">
            <label htmlFor="amount" className="text-[16px] font-medium">
              Amount
            </label>
            <input
              required
              type="number"
              id="amount"
              name="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={`${"₦"} 0.00`}
              className="w-full px-4 h-[50px] border border-pryClr rounded-md mt-2 outline-0"
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-red-600">{formik.errors.amount}</p>
            )}
          </div>
          {
            formik.values.payment_method === "manual" && (
              <div className="w-full mt-5">
                <label htmlFor="proof_of_payment" className="text-[16px] font-medium">
                  Proof of Payment
                </label>
                <input
                  type="file"
                  className="w-full px-4 py-3 border border-pryClr rounded-md mt-2 outline-0"
                  id="proof_of_payment"
                  name="proof_of_payment"
                  onChange={(event) => {
                    formik.setFieldValue("proof_of_payment", event.currentTarget.files[0]);
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.proof_of_payment && formik.errors.proof_of_payment && (
                  <p className="text-red-600">{formik.errors.proof_of_payment}</p>
                )}
              </div>
            )
          }

          <button
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
            className={`mt-8 bg-pryClr text-secClr font-medium w-full h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Confirm Deposit
          </button>
        </form>
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
                  type="password" // Use type="password" for security
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
    </div>
  );
};

export default Deposit;