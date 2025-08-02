import React from 'react';

const electricityHistory = [
  {
    id: 1,
    provider: 'IKEDC',
    token: 'G5W2',
    plan: '1 month',
    amount: '₦20,000',
  },
  {
    id: 2,
    provider: 'KAEDCO',
    token: 'G5W2',
    plan: '2 month',
    amount: '₦30,500',
  },
];

const ElectricityRecharges = () => {
  return (
    <div className="shadow-sm p-6 rounded bg-white overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Electricity Recharge History</h2>
      <table className="min-w-full">
        <thead>
          <tr className="text-black/70 text-[12px] uppercase text-left border-b border-black/20">
            <th className="p-3">ID</th>
            <th className="p-3">Provider</th>
            <th className="p-3">Token</th>
            <th className="p-3">Plan</th>
            <th className="p-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {electricityHistory.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 text-sm border-b border-black/10"
            >
              <td className="p-3">{String(item.id).padStart(3, '0')}</td>
              <td className="p-3">{item.provider}</td>
              <td className="p-3">{item.token}</td>
              <td className="p-3">{item.plan}</td>
              <td className="p-3 text-sm text-pryClr font-semibold">{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ElectricityRecharges;
