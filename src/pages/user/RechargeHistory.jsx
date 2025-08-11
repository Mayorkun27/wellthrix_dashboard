import React, { useRef, useEffect } from 'react';
import AirtimeRecharges from './recharges/AirtimeRecharges';
import DataRecharges from './recharges/DataRecharges';
import ElectricityRecharges from './recharges/ElectricityRecharges';

const options = ['Airtime', 'Data', 'Electricity'];

const RechargeHistory = ({ selectedType, setSelectedType }) => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="relative w-40" ref={dropdownRef}>
          {/* <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-full flex items-center justify-between border border-pryClr/50 rounded-full px-4 py-2 bg-white text-sm"
          >
            {selectedType}
            {isOpen ? (
              <span className="text-pryClr/50 text-xs">▲</span>
            ) : (
              <span className="text-pryClr/50 text-xs">▼</span>
            )}
          </button> */}

          {isOpen && (
            <ul className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => {
                    setSelectedType(option);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm ${
                    option === selectedType ? 'bg-gray-50 font-medium' : ''
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>


      {selectedType === 'Airtime' && <AirtimeRecharges />}
      {selectedType === 'Data' && <DataRecharges />}
      {selectedType === 'Electricity' && <ElectricityRecharges />}
    </div>
  );
};

export default RechargeHistory;
