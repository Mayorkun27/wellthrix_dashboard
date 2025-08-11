import React, { useEffect, useRef, useState } from 'react'
import EwalletHistory from './transactions/EwalletHistory';
import EarningWalletHistory from './transactions/EarningWalletHistory';
import PurchaseWalletHistory from './transactions/PurchaseWalletHistory';
import IncentiveWalletHistory from './transactions/IncentiveWalletHistory';

const options = ['E-Wallet', 'Purchase Wallet', 'Earnings Wallet', 'Incentive Wallet'];

const Transactions = ({ selectedType }) => {

  return (
    <div className="space-y-6">
      {selectedType === 'E-Wallet' && <EwalletHistory />}
      {selectedType === 'Purchase Wallet' && <PurchaseWalletHistory />}
      {selectedType === 'Earnings Wallet' && <EarningWalletHistory />}
      {selectedType === 'Incentive Wallet' && <IncentiveWalletHistory />}
    </div>
  )
}

export default Transactions