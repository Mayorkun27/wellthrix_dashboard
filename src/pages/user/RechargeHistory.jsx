import React from 'react';
import AirtimeRecharges from './recharges/AirtimeRecharges';
import DataRecharges from './recharges/DataRecharges';
import ElectricityRecharges from './recharges/ElectricityRecharges';

const RechargeHistory = ({ selectedType }) => {
  return (
    <div className="space-y-6">
      {selectedType === 'Airtime' && <AirtimeRecharges />}
      {selectedType === 'Data' && <DataRecharges />}
      {selectedType === 'Electricity' && <ElectricityRecharges />}
    </div>
  );
};

export default RechargeHistory;