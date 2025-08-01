import React from 'react'

const Overview = () => {

  const overviews = [
    {
      walletType: "E-Wallet",
      amount: "300000",
      icon: <div></div>,
      buttonText: "Fund Wallet",
      buttonType: 1,
      path: "/user/history"
    },
    {
      walletType: "Repurchase Wallet",
      amount: "300000",
      icon: <div></div>,
      buttonText: "Fund Wallet",
      buttonType: 1,
      path: "/user/history"
    },
    {
      walletType: "Bonus Wallet",
      amount: "25000000",
      icon: <div></div>,
      buttonText: "Fund Wallet",
      buttonType: 1,
      path: "/user/history"
    },
    {
      walletType: "Incentive Wallet",
      amount: "25000000",
      icon: <div></div>,
      buttonText: "Fund Wallet",
      buttonType: 1,
      path: "/user/history"
    },
    {
      walletType: "Total Credit",
      amount: "300000",
      icon: <div></div>,
      buttonText: "Fund Wallet",
      buttonType: 1,
      path: "/user/history"
    },
    {
      walletType: "Total Debit",
      amount: "300000",
      icon: <div></div>,
      buttonText: "Fund Wallet",
      buttonType: 1,
      path: "/user/history"
    },
  ]

  return (
    <div className='grid grid-cols-2'>
      <div className="grid"></div>
      <div className=""></div>
    </div>
  )
}

export default Overview