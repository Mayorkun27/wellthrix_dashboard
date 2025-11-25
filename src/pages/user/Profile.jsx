import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import ProfileInfoTab from './profileTabs/ProfileInfoTab';
import PasswordResetTab from './profileTabs/PasswordResettab';
import PinResetTab from './profileTabs/PinResetTab';
import PersonalDetailsForm from './profileTabs/PersonalDetailsForm';
import ContactDetailsForm from './profileTabs/ContactDetailsForm';
import BankDetailsForm from './profileTabs/BankDetailsForm';
import MyRankProgress from './profileTabs/MyRankProgress';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const searchParams = new URLSearchParams(useLocation().search);
  const getRole = searchParams.get("destination");

  useEffect(() => {
    if (getRole === "toclaim") {
      setActiveTab("rank");
    }
  }, [searchParams])

  const { refreshUser } = useUser()

  useEffect(() => {
    refreshUser()
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfoTab />;
      case 'rank':
        return <MyRankProgress />;
      case 'password':
        return <PasswordResetTab />;
      case 'pin':
        return <PinResetTab />;
      case 'personal':
        return <PersonalDetailsForm />;
      case 'contact':
        return <ContactDetailsForm />
      case 'bank':
        return <BankDetailsForm />
      default:
        return <PersonalDetailsForm />;
    }
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full space-y-6">
        <div className="flex items-center gap-10 overflow-x-auto snap-x snap-mandatory hr-scroll py-4 rounded-xl bg-white px-6">
          <button
            className={`text-lg md:text-xl whitespace-nowrap font-medium cursor-pointer pb-1 snap-center ${activeTab === 'profile' ? 'text-pryClr border-b-2 font-bold border-pryClr' : 'text-pryClr/60 transition-all duration-300'
              }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`text-lg md:text-xl whitespace-nowrap font-medium cursor-pointer pb-1 snap-center ${activeTab === 'rank' ? 'text-pryClr border-b-2 font-bold border-pryClr' : 'text-pryClr/60 transition-all duration-300'
              }`}
            onClick={() => setActiveTab('rank')}
          >
            My Rank Progress
          </button>
          <button
            className={`text-lg md:text-xl whitespace-nowrap font-medium cursor-pointer pb-1 snap-center ${activeTab === 'password' ? 'text-pryClr border-b-2 font-bold border-pryClr' : 'text-pryClr/60 transition-all duration-300'
              }`}
            onClick={() => setActiveTab('password')}
          >
            Password Reset
          </button>
          <button
            className={`text-lg md:text-xl whitespace-nowrap font-medium cursor-pointer pb-1 snap-center ${activeTab === 'pin' ? 'text-pryClr border-b-2 font-bold border-pryClr' : 'text-pryClr/60 transition-all duration-300'
              }`}
            onClick={() => setActiveTab('pin')}
          >
            Pin Reset
          </button>
          <button
            className={`text-lg md:text-xl whitespace-nowrap font-medium cursor-pointer pb-1 snap-center ${activeTab === 'personal' ? 'text-pryClr border-b-2 border-pryClr' : 'text-pryClr/60 transition-all duration-300'
              }`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Details
          </button>
          <button
            className={`text-lg md:text-xl whitespace-nowrap font-medium cursor-pointer pb-1 snap-center ${activeTab === 'contact' ? 'text-pryClr border-b-2 border-pryClr' : 'text-pryClr/60 transition-all duration-300'
              }`}
            onClick={() => setActiveTab('contact')}
          >
            Contact Details
          </button>
          <button
            className={`text-lg md:text-xl whitespace-nowrap font-medium cursor-pointer pb-1 snap-center ${activeTab === 'bank' ? 'text-pryClr border-b-2 border-pryClr' : 'text-pryClr/60 transition-all duration-300'
              }`}
            onClick={() => setActiveTab('bank')}
          >
            Bank Details
          </button>
        </div>
        <div className="bg-white shadow-md rounded-xl">
          <div className="p-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;