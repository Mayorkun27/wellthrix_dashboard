import React, { useState, useEffect } from 'react';
import { FaArrowUpLong, FaUser, FaUsers } from 'react-icons/fa6';
import { useUser } from '../../../context/UserContext';
import { Link } from "react-router-dom";
import { ImArrowLeft, ImArrowRight } from 'react-icons/im';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ProfileInfoTab = () => {
  const { user, miscellaneousDetails, refreshUser } = useUser()

  useEffect(() => {
    refreshUser()
  }, [])

  const splittedFirstNameFirstLetter = user?.first_name.split("")[0]
  const splittedLastNameFirstLetter = user?.last_name.split("")[0]

  const statItems = [
    { 
      id: 1, 
      icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
        <FaUser />
      </div>, 
      title: 'Personal PV', 
      value: Number(user?.personal_pv)
      // + Number(user?.repurchase_pv)
    },
    { 
      id: 2, 
      icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
        <FaUsers />
      </div>, 
      title: 'Total PV', 
      value: Number(miscellaneousDetails?.totalPVLeft) + Number(miscellaneousDetails?.totalPVRight)
    },
    { 
      id: 3, 
      icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
        <ImArrowLeft />
      </div>, 
      title: 'Left PV', 
      value: miscellaneousDetails?.totalPVLeft 
    },
    { 
      id: 4, 
      icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
        <ImArrowRight />
      </div>, 
      title: 'Right PV', 
      value: miscellaneousDetails?.totalPVRight 
    },
  ];

  return (
    <div className='w-full flex flex-col gap-6'>
      <div className='w-full rounded-lg px-4 py-8 bg-pryClr/40 shadow-lg flex flex-col items-center gap-6 md:flex-row'>
        <div className='flex-[4] flex flex-col gap-4 items-center p-2'>
          <div className='w-52 h-52 rounded-full bg-[#D9D9D9] flex items-center justify-center'>
            <h3 className='font-extrabold uppercase text-8xl'>{`${splittedFirstNameFirstLetter}${splittedLastNameFirstLetter}`}</h3>
          </div>
          <div className='flex flex-col items-center'>
            <p className='text-xl font-bold text-center leading-6 md:text-2xl'>{user?.first_name} {user?.last_name}</p>
            <p className='text-xl text-black/80 font-semibold md:text-lg'>@{user?.username}</p>
          </div>
        </div>
        <div className='flex-[6] border-black md:border-l-3 flex flex-col gap-4 md:px-6 py-2'>
          <div className='w-full border-b-3 border-white'>
            <p className='md:text-lg mb-2'><span className='font-semibold'>Email: </span>{user?.email}</p>
          </div>
          <div className='w-full border-b-3 border-white'>
            <p className='md:text-lg mb-2'><span className='font-semibold'>First Name: </span>{user?.first_name}</p>
          </div>
          <div className='w-full border-b-3 border-white'>
            <p className='md:text-lg mb-2'><span className='font-semibold'>Last Name: </span>{user?.last_name}</p>
          </div>
          <div className='w-full border-b-3 border-white'>
            <p className='md:text-lg mb-2'><span className='font-semibold'>Username: </span>{user?.username}</p>
          </div>
          <div className='w-full border-b-3 border-white flex justify-between items-center'>
            <p className='md:text-lg mb-2 capitalize'><span className='font-semibold'>Package: </span>{miscellaneousDetails?.planDetails?.name}</p>
            <Link
              to="/user/upgrade"
              className="flex text-[#0F16D7] font-semibold items-center mb-2 md:text-lg text-sm"
            >
              <p>Upgrade</p>
              <FaArrowUpLong />
            </Link>
          </div>
          <div className='w-full border-b-3 border-white'>
            <p className='md:text-lg mb-2'><span className='font-semibold'>Current Rank: </span>{!user?.rank ? "No Rank" : user?.rank}</p>
          </div>
        </div>
      </div>

      <div className='w-full rounded-lg py-4 md:pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {statItems.map((item) => (
          <div
            key={item.id}
            className='w-full gap-2 flex flex-row items-center font-bold bg-pryClr/40 rounded-lg shadow-lg p-4'
          >
            <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
              {item.icon}
            </div>
            <div className="flex flex-col">
              <p className='md:text-xs text-xs text-white'>{item.title}</p>
              <p className='text-2xl md:text-3xl'>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileInfoTab;