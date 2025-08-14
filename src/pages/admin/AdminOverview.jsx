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
import { toast } from 'sonner'
import AnnouncementBoard from '../../components/AnnouncementBoard'

const API_URL = import.meta.env.VITE_API_BASE_URL

const AdminOverview = () => {
  const { user, token } = useUser();
  const [overviewDetails, setOverviewDetails] = useState(null)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    const fetchOverviewDetails = async () => {
      setIsFetching(true)
      try {
        const response = await axios.get(`${API_URL}/api/admin/stat`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        console.log("overview response", response)

        if (response.status === 200) {
          setOverviewDetails(response.data)
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
  }, [token])

  const overviews = [
    {
      walletType: "Total Users",
      amount: overviewDetails?.total_users,
      icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
          <ImUsers />
        </div>,
      buttonText: "View all",
      buttonType: 1,
      path: "/admin/allusers",
      isAmount: false
    },
    {
      walletType: "Pending deposit",
      amount: overviewDetails?.pending_e_wallet,
      icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
          <IoWalletOutline />
        </div>,
      buttonText: "View Queue",
      buttonType: 1,
      path: "/admin/managetransactions",
      isAmount: false
    },
    {
      walletType: "Total Credit",
      amount: overviewDetails?.total_credit,
      icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
          <PiHandWithdraw />
        </div>,
      buttonText: "View History",
      buttonType: 1,
      path: "/admin/managetransactions"
    },
    {
      walletType: "Total Debit",
      amount: overviewDetails?.total_debit,
      icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
          <PiHandDeposit />
        </div>,
      buttonText: "View History",
      buttonType: 1,
      path: "/admin/managetransactions"
    },
  ]

  return (
    <div className='space-y-8'>
      <div className='grid lg:grid-cols-2 gap-6'>
        {
          overviews.map((overview, index) => (
            <OverviewCards key={index} {...overview} />
          ))
        }
      </div>
      <div className="w-full bg-white md:p-6 p-4 rounded-lg shadow-sm">
        <h3 className='md:text-2xl text-lg mb-2 font-semibold tracking-[-0.1em]'>Announcement Board</h3>
        <div className="overflow-y-scroll md:max-h-[77vh] max-h-[65vh] pe-2 styled-scrollbar">
            <AnnouncementBoard />
        </div>
      </div>
    </div>
  )
}

export default AdminOverview