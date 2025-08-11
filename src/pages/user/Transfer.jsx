import React, { useState } from 'react'
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

const Transfer = () => {

    const { user, token, logout } = useUser();
    const navigate = useNavigate();
    const [pin, setPin] = useState(['', '', '', '']);
    const [showPinModal, setShowPinModal] = useState(false);

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
            pin: "",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            amount: Yup.number()
                .required("Amount is required")
                .min(1, "Amount must be greater than 0")
                .max(user?.earning_wallet, "Insufficient balance!"),
            from: Yup.string()
                .required("Wallet to transfer from is required"),
            to: Yup.string()
                .required("Wallet to transfer to is required"),
            pin: Yup.string()
                .required("Pin is required")
                .length(4, "Pin must be 4 digits long"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            console.log("transfer values", values);
            setSubmitting(true)

            try {
                
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
                <h3 className='text-xl font-semibold'>Transfer Funds</h3>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    setShowPinModal(true);
                }}>
                    <div className="space-y-1">
                        <label htmlFor="from" className='text-sm font-semibold'>Transfer From</label>
                        <select
                            id="from"
                            name="from"
                            value={formik.values.from}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full p-3 border rounded-lg ${formik.touched.from && formik.errors.from ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select Wallet</option>
                            <option value="earning_wallet">Earnings Wallet</option>
                            <option value="incentive_wallet">Incentive Wallet</option>
                        </select>
                        {formik.touched.from && formik.errors.from && (
                            <div className='text-red-500 text-sm'>{formik.errors.from}</div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Transfer