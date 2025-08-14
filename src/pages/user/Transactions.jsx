import React, { useEffect, useRef, useState } from 'react'
import EwalletHistory from './transactions/EwalletHistory';
import EarningWalletHistory from './transactions/EarningWalletHistory';
import PurchaseWalletHistory from './transactions/PurchaseWalletHistory';
import IncentiveWalletHistory from './transactions/IncentiveWalletHistory';
import WithdrawHistory from './transactions/WithdrawHistory';
import ProductsPurchaseHistory from './transactions/ProductsPurchaseHistory';

const Transactions = ({ selectedType }) => {

  return (
    <div className="space-y-6">
      {selectedType === 'E-Wallet' && <EwalletHistory />}
      {selectedType === 'Purchase Wallet' && <PurchaseWalletHistory />}
      {/* {selectedType === 'Earnings Wallet' && <EarningWalletHistory />}
      {selectedType === 'Incentive Wallet' && <IncentiveWalletHistory />} */}
      {selectedType === 'Withdraw History' && <WithdrawHistory />}
      {selectedType === 'Product History' && <ProductsPurchaseHistory />}
    </div>
  )
}

export default Transactions