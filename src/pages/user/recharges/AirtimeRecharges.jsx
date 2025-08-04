import React from 'react';

const rechargeHistory = [
  {
    id: 1,
    phone: '08012345678',
    network: 'MTN',
    type: 'VTU',
    amount: '₦500',
    orderId: 'ORD123456',
    date: '2025/08/01',
  },
  {
    id: 2,
    phone: '08123456789',
    network: 'Airtel',
    type: 'Share & Sell',
    amount: '₦200',
    orderId: 'ORD123457',
    date: '2025/08/01',
  },
];

const AirtimeRecharges = () => {
  return (
    <div className="shadow-sm p-6 rounded bg-white overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Airtime Recharge History</h2>
      <table className="min-w-full">
        <thead>
          <tr className=" text-black/70 text-[12px] uppercase text-left border-b border-black/20">
            <th className="p-3">ID</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Network</th>
            <th className="p-3">Type</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Order ID</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {rechargeHistory.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 text-sm border-b border-black/10">
              <td className="p-3">{String(item.id).padStart(3, '0')}</td>
              <td className="p-3">{item.phone}</td>
              <td className="p-3">{item.network}</td>
              <td className="p-3">{item.type}</td>
              <td className="p-3">{item.amount}</td>
              <td className="p-3">{item.orderId}</td>
              <td className="p-3 text-sm text-pryClr font-semibold">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AirtimeRecharges;
