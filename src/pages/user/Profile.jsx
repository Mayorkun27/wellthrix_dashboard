import React, { useState, useEffect } from 'react';
import { FaArrowUpLong } from 'react-icons/fa6';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import assets from '../../assets/assests'; // Ensure this path is correct in your project
import { useUser } from '../../context/UserContext';
import ProfileInfoTab from './profileTabs/ProfileInfoTab';
import PasswordResetTab from './profileTabs/PasswordResettab';
import PinResetTab from './profileTabs/PinResetTab';
import PersonalDetailsEditTab from './profileTabs/PersonalDetailsEditTab';


// Main Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfoTab />;
      case 'password':
        return <PasswordResetTab />;
      case 'pin':
        return <PinResetTab />;
      case 'personal':
        return <PersonalDetailsEditTab />;
      default:
        return <ProfileInfoTab />;
    }
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full">
        <div className="bg-white shadow-md rounded-lg">
          <div className="flex overflow-x-auto border-b border-gray-200 snap-x snap-mandatory">
            <button
              className={`flex-1 py-6 px-4 text-center font-medium text-base sm:text-lg cursor-pointer snap-center ${activeTab === 'profile' ? 'border-b-2 border-pryClr text-pryClr font-bold' : 'text-pryClr hover:text-pryClr/70'
                }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`flex-1 py-6 px-4 text-center font-medium text-base sm:text-lg cursor-pointer snap-center ${activeTab === 'password' ? 'border-b-2 border-pryClr text-pryClr font-bold' : 'text-pryClr hover:text-pryClr/70'
                }`}
              onClick={() => setActiveTab('password')}
            >
              Password Reset
            </button>
            <button
              className={`flex-1 py-6 px-4 text-center font-medium text-base sm:text-lg cursor-pointer snap-center ${activeTab === 'pin' ? 'border-b-2 border-pryClr text-pryClr font-bold' : 'text-pryClr hover:text-pryClr/70'
                }`}
              onClick={() => setActiveTab('pin')}
            >
              Pin Reset
            </button>
            <button
              className={`flex-1 py-6 px-4 text-center font-medium text-base sm:text-lg cursor-pointer snap-center ${activeTab === 'personal' ? 'border-b-2 border-pryClr text-pryClr font-bold' : 'text-pryClr hover:text-pryClr/70'
                }`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Details
            </button>
          </div>
          <div className="p-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;