import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdOutlineDashboard } from 'react-icons/md';
import { CgDigitalocean } from 'react-icons/cg';
import { PiCardsThreeFill, PiNetwork } from 'react-icons/pi';
import assets from '../../assets/assests';
import { SlUserFollow } from 'react-icons/sl';
import { FaPlugCircleBolt } from 'react-icons/fa6';

const LeftNav = ({ setIsOpen }) => {

    const navItems = [
        {
            name: 'Dashboard',
            icon: <MdOutlineDashboard size={20} />,
            path: '/user/overview',
            role: "realtor"
        },
        {
            name: 'Network',
            icon: <PiNetwork size={20} />,
            path: '/user/network',
            role: "realtor"
        },
        {
            name: 'Transactions',
            icon: <PiCardsThreeFill size={20} />,
            path: '/user/transactions',
            role: "realtor"
        },
        {
            name: 'Digital',
            icon: <CgDigitalocean size={20} />,
            path: '/user/digtal',
            role: "realtor"
        },
        {
            name: 'Register',
            icon: <SlUserFollow className="-skew-x-1" size={20} />,
            path: '/user/register',
            role: "realtor"
        },
        {
            name: 'Recharge History',
            icon: <FaPlugCircleBolt size={20} />,
            path: '/user/rechargehistory',
            role: "realtor"
        }
    ];

    return (
      <div className='bg-pryClr lg:w-full md:w-3/5 w-full h-full py-4 md:pt-4 pt-8 flex flex-col gap-4'>
        <>
            <div className="flex items-center justify-center">
              <img src={assets.logo} alt="Wellthrix logo" className='w-2/5' />
            </div>
            <ul className='lg:mt-5 mt-8 flex flex-col gap-3'>
                {
                    navItems.map(({ name, icon, path }, index) => (
                        <NavLink
                            to={path}
                            key={index}
                            className={({ isActive }) => `
                                flex items-center md:ps-18 ps-24 gap-3 font-medium border-l-10 border-transparent text-white transition-all duration-300 hover:border-secClr hover:bg-secClr/30 px-4 py-3 cursor-pointer text-base
                                ${isActive ? 'bg-secClr/30 !border-secClr text-white' : ''}
                            `}
                            onClick={() => setIsOpen(false)}
                        >
                            <span>{icon}</span>
                            <span>{name}</span>
                        </NavLink>
                    ))
                }
            </ul>
        </>
      </div>
    );
};

export default LeftNav;