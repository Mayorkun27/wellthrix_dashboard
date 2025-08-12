import React, { useEffect, useState } from 'react'
import { MdOutlineAccountBalanceWallet } from 'react-icons/md'
import { IoWalletOutline } from 'react-icons/io5'
import { GiWallet } from 'react-icons/gi'
import { BsWallet2 } from 'react-icons/bs'
import { useUser } from '../../context/UserContext'
import OverviewCards from '../../components/cards/OverviewCards'
import { useFormik } from 'formik'
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Modal from '../../components/modals/Modal'
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Transfer = () => {

    const { user, token, logout, refreshUser } = useUser();
    const navigate = useNavigate();
    const [pin, setPin] = useState(['', '', '', '']);
    const [showPinModal, setShowPinModal] = useState(false);

    useEffect(() => {
        refreshUser(token)
    }, [token])

    const overviews = [
        {
            walletType: "E-Wallet",
            amount: user?.e_wallet,
            icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
                <MdOutlineAccountBalanceWallet />
                </div>,
            buttonText: "Fund Wallet",
            buttonType: 1,
            path: "/user/deposit"
        },
        {
            walletType: "Purchase Wallet",
            amount: user?.purchased_wallet,
            icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
                <IoWalletOutline />
                </div>,
            buttonText: "Purchase Now",
            buttonType: 1,
            path: "/user/products"
        },
        {
            walletType: "Earnings Wallet",
            amount: user?.earning_wallet,
            icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
                <GiWallet />
                </div>,
            buttonText: "Withdraw/Transfer",
            buttonType: 1,
            path: "/user/history"
        },
        {
            walletType: "Incentive Wallet",
            amount: user?.incentive_wallet,
            icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
                <BsWallet2 />
                </div>,
            buttonText: "",
            buttonType: 1,
            path: "/user/history"
        },
    ]

    const formik = useFormik({
        initialValues: {
            user_id: user?.id || "",
            amount: "",
            from: "",
            to: "",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            amount: Yup.number()
                .required("Amount is required")
                .min(1, "Amount must be greater than 0")
                .when('from', {
                    is: 'e_wallet',
                    then: (schema) => schema.max(user?.e_wallet, 'Insufficient E-Wallet balance!'),
                    otherwise: (schema) => schema.max(user?.earning_wallet, 'Insufficient Earning Wallet balance!')
                }),
            from: Yup.string()
                .required("Wallet to transfer from is required"),
            to: Yup.string()
                .required("Wallet to transfer to is required"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            console.log("transfer values", values);
            setSubmitting(true)
            console.log("pin", pin)

            let endpoint = "";
            if (values.from === "e_wallet") {
                endpoint = "wallet/funds"
            } else if (values.from === "earning_wallet") {
                endpoint = "earning/fund/initiate"
            } else {
                toast.error("Invalid from wallet selected");
                setSubmitting(false)
                return;
            }

            console.log("sending req to endpoint", API_URL+"/api/"+endpoint)

            try {
                const response = await axios.post(`${API_URL}/api/${endpoint}`, { ...values, pin: pin.join('') }, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json",
                    }
                });

                console.log("transfer response", response)

                if (response.status === 200 && response.data.ok) {
                    toast.success(response.data.message || `Funds transfer successful`);
                    setTimeout(() => {
                        navigate("/user/transactions");
                    }, 2000);
                } else {
                    throw new Error(response.data.message || "An error occurred transferring funds.");
                }
                
            } catch (error) {
                if (error.response?.data?.message?.toLowerCase() === "unauthenticated") {
                    logout();
                }
                console.error("An error occurred transferring funds", error);
                toast.error(error.response?.data?.message || "An error occurred transferring funds");
            } finally {
                setTimeout(() => {
                    setSubmitting(false);
                    setShowPinModal(false);
                    setPin(['', '', '', '']);
                }, 2000);
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
        <div className='space-y-8'>
            <div className="lg:col-span-4 grid gap-4 md:grid-cols-2 grid-cols-1">
                {
                    overviews.map((overview, index) => (
                        <OverviewCards key={index} {...overview} />
                    ))
                }
            </div>
            <div className="bg-white p-6 rounded-xl">
                <h3 className='text-xl font-semibold mb-4'>Transfer Funds</h3>
                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        setShowPinModal(true);
                    }}
                    className='flex flex-col gap-4'
                >
                    <div className="space-y-1">
                        <label htmlFor="from" className='text-sm font-medium'>Transfer From</label>
                        <select
                            id="from"
                            name="from"
                            value={formik.values.from}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            defaultValue={""}
                            className={`w-full p-3 border rounded-lg ${formik.touched.from && formik.errors.from ? 'border-red-500' : 'border-gray-300'} outline-0`}
                        >
                            <option value="" disabled>Select target wallet</option>
                            <option value="e_wallet">E-Wallet</option>
                            <option value="earning_wallet">Earning Wallet</option>
                        </select>
                        {formik.touched.from && formik.errors.from && (
                            <div className='text-red-500 text-sm'>{formik.errors.from}</div>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="to" className='text-sm font-medium'>Transfer to</label>
                        <select
                            id="to"
                            name="to"
                            value={formik.values.to}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            defaultValue={""}
                            className={`w-full p-3 border rounded-lg ${formik.touched.to && formik.errors.to ? 'border-red-500' : 'border-gray-300'} outline-0`}
                        >
                            <option value="" disabled>Select destination wallet</option>
                            <option value="purchased_wallet">Purchase Wallet</option>
                        </select>
                        {formik.touched.to && formik.errors.to && (
                            <div className='text-red-500 text-sm'>{formik.errors.to}</div>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="amount" className='text-sm font-medium'>Transfer amount</label>
                        <input
                            type='number'
                            id="amount"
                            name="amount"
                            value={formik.values.amount}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full p-3 border rounded-lg ${formik.touched.amount && formik.errors.amount ? 'border-red-500' : 'border-gray-300'} outline-0`}
                        />
                        {formik.touched.amount && formik.errors.amount && (
                            <div className='text-red-500 text-sm'>{formik.errors.amount}</div>
                        )}
                    </div>
                    <button
                        type='submit'
                        onClick={() => setShowPinModal(true)}
                        disabled={!formik.isValid || formik.isSubmitting}
                        className='bg-pryClr text-white px-4 mt-6 h-[50px] rounded-lg hover:bg-pryClr/80 transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        Proceed
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
        </div>
    )
}

export default Transfer