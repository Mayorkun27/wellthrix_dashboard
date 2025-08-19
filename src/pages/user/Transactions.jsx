import React, { useEffect, useRef, useState } from 'react'
import EwalletHistory from './transactions/EwalletHistory';
import EarningWalletHistory from './transactions/EarningWalletHistory';
import PurchaseWalletHistory from './transactions/PurchaseWalletHistory';
import IncentiveWalletHistory from './transactions/IncentiveWalletHistory';
import WithdrawHistory from './transactions/WithdrawHistory';
import ProductsPurchaseHistory from './transactions/ProductsPurchaseHistory';
import P2PHistory from './transactions/P2PHistory';

const Transactions = ({ selectedType }) => {

  return (
    <div className="space-y-6">
      {selectedType === 'E-Wallet' && <EwalletHistory />}
      {selectedType === 'Purchase Wallet' && <PurchaseWalletHistory />}
      {selectedType === 'Earnings History' && <EarningWalletHistory />}
      {/* {selectedType === 'Incentive Wallet' && <IncentiveWalletHistory />} */}
      {selectedType === 'Withdraw History' && <WithdrawHistory />}
      {selectedType === 'Product History' && <ProductsPurchaseHistory />}
      {selectedType === 'E-wallet transfers' && <P2PHistory />}
    </div>
  )
}

export default Transactions