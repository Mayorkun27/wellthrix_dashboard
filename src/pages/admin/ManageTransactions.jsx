import React, { useState } from 'react';
import ManualDeposit from './transactions/manual/ManualDeposit';
import AutomatedDeposit from './transactions/automated/AutomatedDeposit';
import ManualWithdraw from './transactions/manual/ManualWithdraw';
import AutomatedWithdraw from './transactions/automated/AutomatedWithdraw';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ManageTransactions = () => {
  const [activeTab, setActiveTab] = useState('manual-withdraw');

  const statusColors = {
    Successful: 'text-[#2F5318] bg-[#DFF7EE]/15 border border-[#2F5318]/15',
    Pending: 'text-[#BF1235] bg-[#C51236]/20 border border-[#2F5318]/15',
  };

  const maskAccountNumber = (accountNo) => {
    if (accountNo.length >= 4) {
      return accountNo.slice(0, 2) + '**' + accountNo.slice(4);
    }
    return accountNo;
  };


  const renderComponent = () => {
    if (activeTab === "manual-deposit") {
      return <ManualDeposit />
    } else if (activeTab === "automated-deposit") {
      return <AutomatedDeposit />
    } else if (activeTab === "manual-withdraw") {
      return <ManualWithdraw />
    } else if (activeTab === "automated-withdraw") {
      return <AutomatedWithdraw />
    } else {
      return <ManualDeposit />
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex overflow-x-scroll no-scrollbar gap-8 mb-4">
        <button
          onClick={() => setActiveTab('manual-deposit')}
          className={`text-lg font-bold cursor-pointer pb-1 whitespace-nowrap outline-0 ${activeTab === 'manual-deposit' ? 'text-xl text-pryClr border-b-2 border-pryClr' : 'text-black/50'}`}
          aria-selected={activeTab === 'manual-deposit'}
          role="tab"
        >
          Deposit 
          {/* &#40;Manual&#41; */}
        </button>
        {/* <button
          onClick={() => setActiveTab('automated-deposit')}
          className={`disabledforNow2 text-lg font-bold cursor-pointer pb-1 whitespace-nowrap outline-0 ${activeTab === 'automated-deposit' ? 'text-xl text-pryClr border-b-2 border-pryClr' : 'text-black/50'}`}
          aria-selected={activeTab === 'automated-deposit'}
          role="tab"
        >
          Deposit &#40;A&#41;
        </button> */}
        <button
          onClick={() => setActiveTab('manual-withdraw')}
          className={`text-lg font-bold cursor-pointer pb-1 whitespace-nowrap outline-0 ${activeTab === 'manual-withdraw' ? 'text-xl text-pryClr border-b-2 border-pryClr' : 'text-black/50'}`}
          aria-selected={activeTab === 'manual-withdraw'}
          role="tab"
        >
          Withdraw 
          {/* &#40;Manual&#41; */}
        </button>
        {/* <button
          onClick={() => setActiveTab('automated-withdraw')}
          className={`disabledforNow2 text-lg font-bold cursor-pointer pb-1 whitespace-nowrap outline-0 ${activeTab === 'automated-withdraw' ? 'text-xl text-pryClr border-b-2 border-pryClr' : 'text-black/50'}`}
          aria-selected={activeTab === 'automated-withdraw'}
          role="tab"
        >
          Withdraw &#40;A&#41;
        </button> */}
      </div>
      <div className="w-full overflow-hidden rounded-lg shadow-sm">
        {renderComponent()}
      </div>
    </div>
  );
};

export default ManageTransactions;