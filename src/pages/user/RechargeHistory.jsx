import React, { useState } from 'react';
import AirtimeRecharges from './recharges/AirtimeRecharges';
import DataRecharges from './recharges/DataRecharges';
import ElectricityRecharges from './recharges/ElectricityRecharges';

const RechargeHistory = () => {
  const [selectedType, setSelectedType] = useState('Airtime');

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="Airtime">Airtime</option>
          <option value="Data">Data</option>
          <option value="Electricity">Electricity</option>
        </select>
      </div>

      {/* Conditional Rendering */}
      {selectedType === 'Airtime' && <AirtimeRecharges />}
      {selectedType === 'Data' && <DataRecharges />}
      {selectedType === 'Electricity' && <ElectricityRecharges />}
    </div>
  );
};

export default RechargeHistory;
