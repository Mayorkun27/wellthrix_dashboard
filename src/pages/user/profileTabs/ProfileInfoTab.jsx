import React, { useState, useEffect } from 'react';
import { FaArrowUpLong } from 'react-icons/fa6';
import assets from '../../../assets/assests';
import { useUser } from '../../../context/UserContext';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ProfileInfoTab = () => {
  const searchParams = new URLSearchParams(useLocation().search);
  const comeToEditBank = searchParams.get("setbank");

  const { user, miscellaneousDetails, refreshUser } = useUser()

  useEffect(() => {
    refreshUser()
  }, [])

  const splittedFirstNameFirstLetter = user?.first_name.split("")[0]
  const splittedLastNameFirstLetter = user?.last_name.split("")[0]

  const statItems = [
    { id: 1, icon: assets.pic1, title: 'Total PV', value: user?.total_pv },
    { id: 3, icon: assets.pic3, title: 'Left PV', value: miscellaneousDetails?.totalPVLeft },
    { id: 4, icon: assets.pic4, title: 'Right PV', value: miscellaneousDetails?.totalPVRight },
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
            <p className='md:text-lg mb-2'><span className='font-semibold capitalize'>Package: </span>{miscellaneousDetails?.planDetails?.name}</p>
            <Link
              to="/user/upgrade"
              className="flex gap-1 text-[#0F16D7] font-semibold items-center mb-2 md:text-lg"
            >
              <p>Upgrade</p>
              <FaArrowUpLong />
            </Link>
          </div>
          <div className='w-full border-b-3 border-white'>
            <p className='md:text-lg mb-2'><span className='font-semibold'>Current Rank: </span>No Rank Achieved</p>
          </div>
        </div>
      </div>

      <div className='w-full rounded-lg py-8 md:pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {statItems.map((item) => (
          <div
            key={item.id}
            className='w-full gap-2 flex flex-row items-center font-bold bg-pryClr/40 rounded-lg shadow-lg p-4'
          >
            <img src={item.icon} className='w-12' alt={item.title} />
            <div className="flex flex-col">
              <p className='md:text-base text-sm text-white'>{item.title}</p>
              <p className='text-5xl md:text-5xl'>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileInfoTab;