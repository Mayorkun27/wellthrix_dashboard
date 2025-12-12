import React, { useEffect, useState } from 'react'
import OverviewCards from '../../components/cards/OverviewCards'
import { Link } from 'react-router-dom'
import { MdOutlineAccountBalanceWallet, MdOutlineSdCard } from 'react-icons/md'
import { IoWalletOutline } from 'react-icons/io5'
import { GiElectric, GiWallet } from 'react-icons/gi'
import { BsWallet2 } from 'react-icons/bs'
import { PiHandDeposit, PiHandWithdraw } from 'react-icons/pi'
import ReferralCards from '../../components/cards/ReferralCards'
import DigitalCards from '../../components/cards/DigitalCards'
import AnnouncementBoard from '../../components/AnnouncementBoard'
import { CgData } from 'react-icons/cg'
import ListTwo from '../../components/lists/ListTwo'
import TopEarners from './overviewsubpages/TopEarners'
import TopRecruiters from './overviewsubpages/TopRecruiters'
import TopPerformance from './overviewsubpages/TopPerformance'
import Earning from './overviewsubpages/Earning'
import EarningBonus from './overviewsubpages/EarningBonus'
import IndirectBonus from './overviewsubpages/IndirectBonus'
import Expenses from './overviewsubpages/Expenses'
import { useUser } from '../../context/UserContext'
import axios from 'axios'
import { toast } from 'sonner'
import { HiOutlineShoppingCart } from 'react-icons/hi2'
import PromoOne from './promos/PromoOne'
import PromoTwo from './promos/PromoTwo'
import PromoThree from './promos/PromoThree'
import { isDatePast } from '../../utilities/dateUtils'
import PromoFour from './promos/PromoFour'
import { FaGift, FaWaveSquare } from 'react-icons/fa6'

const API_URL = import.meta.env.VITE_API_BASE_URL

const Overview = () => {

  const [performanceTab, setPerformanceTab] = useState("topearner")
  const [expensesAndExpensesTab, setExpensesAndExpensesTab] = useState("earning")

  const [referrals, setReferrals] = useState([])

  const { user, token, logout, refreshUser, checkPendingRanks, hasPendingRank, miscellaneousDetails } = useUser()
  const [refreshPromos, setRefreshPromos] = useState(false)
  const [isGettingProgress, setIsGettingProgress] = useState(false)
  const [pendingRefreshes, setPendingRefreshes] = useState(0);

  useEffect(() => {
    if (token) {
      refreshUser();
      checkPendingRanks(token);
    }
  }, [token]);
  
  const splittedFirstNameFirstLetter = user?.first_name.split("")[0]
  const splittedLastNameFirstLetter = user?.last_name.split("")[0]

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
      walletType: "Repurchase Wallet",
      amount: user?.purchased_wallet,
      icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
          <IoWalletOutline />
        </div>,
      // buttonText: "Purchase Now",
      // buttonType: 1
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
      amount: user?.total_credit,
      icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
          <PiHandDeposit />
        </div>,
      buttonText: "History",
      buttonType: 1,
      path: "/user/transactions"
    },
    {
      walletType: "Total Debit",
      amount: user?.total_debit,
      icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
          <PiHandWithdraw />
        </div>,
      buttonText: "History",
      buttonType: 1,
      path: "/user/transactions"
    },
  ]

  const fetchReferrals = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/referrals/latest`, {
        headers: {
          "Authorization" : `Bearer ${token}`,
        }
      })

      // // console.log("My refs response", response)

      if (response.status === 200) {
        setReferrals(response.data.data)
      } else {
        throw new Error(response.data.message || "Failed to get latest referrals.");
      }
      
    } catch (error) {
      if (error?.response?.data?.message.toLowerCase() == "unauthenticated") {
        logout()
      }
      console.error("An error occured fetching referrals", error)
      toast.error("An error occured fetching referrals")
    }
  }

  useEffect(() => {
    if (token) fetchReferrals();
  }, [token])

  const digitalProducts = [
    {
      icon: <MdOutlineSdCard />,
      item: "Buy Airtime",
      path: "/user/recharge",
    },
    {
      icon: <CgData />,
      item: "Buy Data Bundle",
      path: "/user/recharge",
    },
    {
      icon: <GiElectric />,
      item: "Pay Electricity Bill",
      path: "/user/recharge",
    },
  ]

  const bpb = [
    {
      position: "L",
      identifier: "Left Carry",
      point: 0
    },
    {
      position: "R",
      identifier: "Right Carry",
      point: 25
    },
  ]

  const rap = [
    {
      position: "L",
      identifier: "Left Carry",
      point: 0
    },
    {
      position: "R",
      identifier: "Right Carry",
      point: 25
    },
  ]

  const uap = [
    {
      position: "P",
      identifier: "Personal PV",
      point: 0
    },
    {
      position: "G",
      identifier: "Group PV",
      point: 25
    },
  ]

  const refreshAllPromos = () => {
    setIsGettingProgress(true);
    setPendingRefreshes(2); // Adjust if you add/remove promos
    setRefreshPromos(prev => !prev);
  };

  const handleRefreshComplete = () => {
    setPendingRefreshes(prev => {
      const newCount = prev - 1;
      if (newCount <= 0) {
        setIsGettingProgress(false);
      }
      return newCount;
    });
  };

  const promoOneExpired = isDatePast("2025-10-01")
  const promoTwoExpired = isDatePast("2025-11-01")
  const promoThreeExpired = isDatePast("2025-11-01")
  const promoFourExpired = isDatePast("2025-11-27")

  return (
    <div className='grid md:grid-cols-6 grid-cols-1 gap-6 items-'>
      {/* Overviews */}
      <div className="lg:col-span-2 md:col-span-3 grid grid-cols-1 lg:gap-2 gap-4 h-full lg:my-1">
        {
          overviews.slice(0, 3).map((overview, index) => (
            <div className="h-full" key={index}>
              <OverviewCards {...overview} />
            </div>
          ))
        }
      </div>
      <div className="lg:col-span-2 md:col-span-3 grid grid-cols-1 lg:gap-2 gap-4 h-full lg:my-1">
        {
          overviews.slice(3, 6).map((overview, index) => (
            <div className="h-full" key={index}>
              <OverviewCards {...overview} />
            </div>
          ))
        }
      </div>
      {/* Profile */}
      <div className="lg:col-span-2 md:col-span-6 grid lg:grid-cols-1 md:grid-cols-2 lg:gap-2 gap-4 h-full lg:my-1">
        <OverviewCards 
          amount={user?.unilevel_wallet}
          walletType={"Unilevel Wallet"}
          icon={
            <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
              <HiOutlineShoppingCart />
            </div>
          }
        />
        <OverviewCards 
          amount={user?.total_earning}
          walletType={"Total Earnings"}
          icon={
            <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
              <HiOutlineShoppingCart />
            </div>
          }
          bgType={2}
        />
        <div className="lg:col-span-1 md:col-span-2 flex lg:flex-row md:flex-row flex-col gap-4 items-center lg:justify-start justify-center">
          <div className="shadow-md lg:w-[90px] md:w-[230px] lg:h-[80px] md:h-[230px] w-[200px] h-[200px] lg:rounded-xl rounded-full bg-accClr overflow-hidden flex items-center justify-center">
            <h3 className='lg:text-4xl md:text-8xl text-6xl text-pryClr font-extrabold uppercase'>{splittedFirstNameFirstLetter+splittedLastNameFirstLetter}</h3>
          </div>
          <div className="flex flex-col md:items-start items-center lg:gap-0 gap-1">
            <h3 className='font-bold'>@{user?.username}</h3>
            <div className="flex lg:flex-row md:flex-col flex-row items-start justify-between md:gap-2 gap-2 text-xs">
              <p>Package: <span className='font-bold uppercase'>{miscellaneousDetails?.planDetails?.name}</span></p>
              <p>Rank: <span className='font-bold uppercase'>{user?.rank || "No rank"}</span></p>
            </div>
            <Link to={"/user/upgrade"} className="whitespace-nowrap bg-pryClr text-secClr lg:h-[40px] h-[50px] flex items-center justify-center px-4 mt-2 rounded-lg lg:text-xs">Upgrade Package</Link>
          </div>
        </div>
      </div>
      {hasPendingRank && (
        <div className="md:col-span-6">
          <div className="p-4 bg-accClr shadow-md border border-pryClr/20 rounded-lg flex items-center justify-between">
            <div className='flex items-center gap-4'>
                <FaGift className="text-white animate-bounce" size={24} />
                <div>
                    <h4 className='font-bold text-white'>Hey <span className='capitalize'>{user?.first_name}</span> </h4>
                    <p className='text-sm text-white'>You have an Unclaimed Rank Reward!.</p>
                </div>
            </div>
            <Link 
              to={"/user/profile?destination=toclaim"}
              className="px-4 py-2 bg-pryClr text-white font-semibold rounded-md"
            >
              Claim Now
            </Link>
          </div>
        </div>
      )}
      <div className="flex md:flex-row flex-col items-center md:col-span-6 gap-6">
        {/* New Refs */}
        <div className="lg:my-1 md:w-1/2 w-full h-full">
          <div className="bg-white md:px-6 py-4 p-4 rounded-lg shadow-sm h-full">
            <h3 className='md:text-xl text-lg mb-3 font-semibold'>New members</h3>
            <div className="grid gap-4">
              {
                referrals.length <= 0 ? (
                  <div className='flex flex-col gap-4 items-center justify-center font-medium'>
                    <h3>You dont have any referral yet!.</h3>
                    <Link
                      to={"/user/register"}
                      className='bg-pryClr h-[45px] text-secClr rounded-lg shadow-sm text-sm flex items-center justify-center px-4'
                    >Register a referral</Link>
                  </div>
                ) : (
                  referrals.map((referral, index) => (
                    <ReferralCards key={index} {...referral} />
                  ))
                )
              }
            </div>
          </div>
        </div>
        {/* Announcement Board */}
        <div className="lg:my-1 md:w-1/2 w-full h-full">
          <div className="bg-white md:px-6 py-4 p-4 rounded-lg shadow-sm h-full">
            <h3 className='md:text-xl text-lg mb-2 font-semibold tracking-tighter'>Announcement Board</h3>
            <div className="h-[80%] overflow-y-scroll pe-2 styled-scrollbar">
              <AnnouncementBoard />
            </div>
          </div>
        </div>
      </div>


      {/* Promo */}
      <div className="md:col-span-6 lg:my-1">
        <div className="bg-white md:p-6 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className='md:text-xl text-base font-semibold'>Ongoing Promo&#40;s&#41;</h3>
            <button 
              className="whitespace-nowrap bg-accClr text-secClr lg:h-[40px] md:h-[50px] h-[40px] flex items-center justify-center md:px-4 px-2 rounded-lg lg:text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              onClick={refreshAllPromos}
              disabled={isGettingProgress}
            >
              {isGettingProgress ? "Refreshing Progress..." :"Refresh Progress(es)"}
            </button>
          </div>

          <div className='space-y-8'>
            {!promoFourExpired && (<PromoFour refresh={refreshPromos} onComplete={handleRefreshComplete} />)}
            {!promoThreeExpired && (<PromoThree refresh={refreshPromos} onComplete={handleRefreshComplete} />)}
            {!promoTwoExpired && (<PromoTwo refresh={refreshPromos} onComplete={handleRefreshComplete} />)}
            {!promoOneExpired && (<PromoOne refresh={refreshPromos} onComplete={handleRefreshComplete} />)}
          </div>
        </div>
      </div>

      {/* Digital Products */}
      <div hidden className="lg:col-span-6 lg:my-1">
        <div className="bg-white md:p-6 p-4 rounded-lg shadow-sm">
          <h3 className='md:text-xl text-lg mb-6 font-semibold'>Digital Links</h3>
          <div className="lg:grid grid-cols-3 flex items-center jstify-between gap-6 overflow-x-scroll no-scrollbar">
            {
              digitalProducts.map((digitalProduct, index) => (
                <div key={index} className="lg:w-full md:min-w-2/5 min-w-10/12 rounded-lg overflow-hidden group hover:scale-95 transition-all duration-300">
                  <DigitalCards {...digitalProduct} />
                </div>
              ))
            }
          </div>
        </div>
      </div>
      {/* Binary Pairing Point */}
      <div hidden className="lg:col-span-2 lg:my-1">
        <div className="bg-white md:p-6 p-4 rounded-lg shadow-sm">
          <h3 className='text-lg mb-4 font-semibold'>Binary Pairing Bonus</h3>
          <div className="grid items-center jstify-between gap-2 overflow-x-scroll no-scrollbar">
            {
              bpb.map((point, index) => (
                <ListTwo type={1} key={index} {...point} />
              ))
            }
          </div>
        </div>
      </div>
      {/* Rank Award Point */}
      <div hidden className="lg:col-span-2 lg:my-1">
        <div className="bg-white md:p-6 p-4 rounded-lg shadow-sm">
          <h3 className='text-lg mb-4 font-semibold'>Rank Award Points</h3>
          <div className="grid items-center jstify-between gap-2 overflow-x-scroll no-scrollbar">
            {
              rap.map((point, index) => (
                <ListTwo type={2} key={index} {...point} />
              ))
            }
          </div>
        </div>
      </div>
      {/* Unilevel Award Point */}
      <div hidden className="lg:col-span-2 lg:my-1">
        <div className="bg-white md:p-6 p-4 rounded-lg shadow-sm">
          <h3 className='text-lg mb-4 font-semibold'>Unilevel Award Points</h3>
          <div className="grid items-center jstify-between gap-2 overflow-x-scroll no-scrollbar">
            {
              uap.map((point, index) => (
                <ListTwo type={1} key={index} {...point} />
              ))
            }
          </div>
        </div>
      </div>
      {/* Team Performance */}
      <div hidden className="lg:col-span-6 lg:my-1">
        <div className="bg-white md:p-6 p-4 rounded-lg shadow-sm">
          <h3 className='md:text-xl text-lg mb-2 font-semibold'>Team Performance</h3>
          <div className="flex overflow-x-scroll gap-10 mb-8 items-center justify-between no-scrollbar">
            <button 
              onClick={() => setPerformanceTab("topearner")}
              className={`whitespace-nowrap cursor-pointer border-b-2 border-transparent transition-all duration-100 hover:border-pryClr font-semibold text-black/60 ${performanceTab === "topearner" && "text-pryClr border-b-2 border-b-pryClr"} pb-0.5`}
            >Top Earners</button>
            <button 
              onClick={() => setPerformanceTab("toprecruiter")}
              className={`whitespace-nowrap cursor-pointer border-b-2 border-transparent transition-all duration-100 hover:border-pryClr font-semibold text-black/60 ${performanceTab === "toprecruiter" && "text-pryClr border-b-2 border-b-pryClr"} pb-0.5`}
            >Top Recriuters</button>
            <button 
              onClick={() => setPerformanceTab("topperformance")}
              className={`whitespace-nowrap cursor-pointer border-b-2 border-transparent transition-all duration-100 hover:border-pryClr font-semibold text-black/60 ${performanceTab === "topperformance" && "text-pryClr border-b-2 border-b-pryClr"} pb-0.5`}
            >Top Performance</button>
          </div>
          <div className="lg:grid grid-cols-3 flex items-center jstify-between gap-6 overflow-x-scroll no-scrollbar">
            {
              performanceTab === "toprecruiter" 
                ? <TopRecruiters />
                : performanceTab === "topperformance"
                  ? <TopPerformance />
                  : <TopEarners />
            }
          </div>
        </div>
      </div>
      {/* Earning & Expenses */}
      <div hidden className="lg:col-span-6 lg:my-1">
        <div className="bg-white md:p-6 p-4 rounded-lg shadow-sm">
          <h3 className='md:text-xl text-lg mb-2 font-semibold'>Earning & Expenses</h3>
          <div className="flex overflow-x-scroll gap-10 mb-8 items-center justify-between no-scrollbar">
            <button 
              onClick={() => setExpensesAndExpensesTab("earning")}
              className={`whitespace-nowrap cursor-pointer border-b-2 border-transparent transition-all duration-100 hover:border-pryClr font-semibold text-black/60 ${expensesAndExpensesTab === "earning" && "text-pryClr border-b-2 border-b-pryClr"} pb-0.5`}
            >Earning</button>
            <button 
              onClick={() => setExpensesAndExpensesTab("expenses")}
              className={`whitespace-nowrap cursor-pointer border-b-2 border-transparent transition-all duration-100 hover:border-pryClr font-semibold text-black/60 ${expensesAndExpensesTab === "expenses" && "text-pryClr border-b-2 border-b-pryClr"} pb-0.5`}
            >Expenses</button>
            <button 
              onClick={() => setExpensesAndExpensesTab("earningBonus")}
              className={`whitespace-nowrap cursor-pointer border-b-2 border-transparent transition-all duration-100 hover:border-pryClr font-semibold text-black/60 ${expensesAndExpensesTab === "earningBonus" && "text-pryClr border-b-2 border-b-pryClr"} pb-0.5`}
            >Earning Bonus</button>
            <button 
              onClick={() => setExpensesAndExpensesTab("indirectBonus")}
              className={`whitespace-nowrap cursor-pointer border-b-2 border-transparent transition-all duration-100 hover:border-pryClr font-semibold text-black/60 ${expensesAndExpensesTab === "indirectBonus" && "text-pryClr border-b-2 border-b-pryClr"} pb-0.5`}
            >Indirect Bonus</button>
          </div>
          <div className="lg:grid grid-cols-3 flex items-center jstify-between gap-6 overflow-x-scroll no-scrollbar">
            {
              expensesAndExpensesTab === "expenses" 
                ? <Expenses />
                : expensesAndExpensesTab === "earningBonus"
                  ? <EarningBonus />
                  : expensesAndExpensesTab === "indirectBonus"
                      ? <IndirectBonus />
                      : <Earning />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview