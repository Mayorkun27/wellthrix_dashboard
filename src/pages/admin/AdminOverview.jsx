import React, { useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext'
import { MdOutlineAccountBalanceWallet, MdOutlineSdCard } from 'react-icons/md'
import { IoWalletOutline } from 'react-icons/io5'
import { GiWallet } from 'react-icons/gi'
import { BsWallet2 } from 'react-icons/bs'
import { PiHandDeposit, PiHandWithdraw } from 'react-icons/pi'
import { ImUsers } from "react-icons/im";
import OverviewCards from '../../components/cards/OverviewCards'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL

const AdminOverview = () => {
  const { user, token } = useUser();
  const [overviewDetails, setOverviewDetails] = useState(null)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    const fetchOverviewDetails = async () => {
      setIsFetching(true)
      try {
        const response = await axios.get(`${API_URL}/`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        console.log("overview response", response)

        if (response.status === 200) {
          setOverviewDetails(response.data.data)
        } else {
          throw new Error(response.data.message || "Failed to get overview data.");
        }
        
      } catch (error) {
        if (error.response.data.message.toLowerCase() == "unauthenticated") {
          logout()
        }
        console.error("An error occured fetching overview data", error)
        toast.error("An error occured fetching overview data")
      } finally {
        setIsFetching(false)
      }
    }

    fetchOverviewDetails()
  })

  const overviews = [
    {
      walletType: "Total Users",
      amount: user?.e_wallet,
      icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
          <ImUsers />
        </div>,
      buttonText: "View all",
      buttonType: 1,
      path: "/admin/allusers",
      isAmount: false
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
      buttonText: "Transfer",
      buttonType: 1,
      path: "/user/transfer"
    },
    {
      walletType: "Incentive Wallet",
      amount: user?.incentive_wallet,
      icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
          <BsWallet2 />
        </div>,
      buttonText: "Withdraw",
      buttonType: 1,
      path: "/user/withdraw"
    },
    {
      walletType: "Total Credit",
      amount: user?.e_wallet,
      icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
          <PiHandDeposit />
        </div>,
      buttonText: "History",
      buttonType: 1,
      path: "/user/transactions"
    },
    {
      walletType: "Total Debit",
      amount: "0",
      icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
          <PiHandWithdraw />
        </div>,
      buttonText: "History",
      buttonType: 1,
      path: "/user/transactions"
    },
  ]

  return (
    <div className='grid lg:grid-cols-3 gap-6'>
      {
        overviews.map((overview, index) => (
          <OverviewCards key={index} {...overview} />
        ))
      }
    </div>
  )
}

export default AdminOverview