import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdChat, MdFormatListBulletedAdd, MdLogout, MdOutlineContactMail, MdOutlineDashboard, MdOutlineFileUpload, MdOutlineLoyalty, MdOutlineUnsubscribe } from 'react-icons/md';
import { CgDigitalocean } from 'react-icons/cg';
import { PiCardsThreeFill, PiNetwork } from 'react-icons/pi';
import { BiMoneyWithdraw } from "react-icons/bi";
import assets from '../../assets/assests';
import { SlUserFollow } from 'react-icons/sl';
import { FaMoneyBillTransfer, FaPlugCircleBolt, FaRankingStar, FaRegCircleUser, FaUsers } from 'react-icons/fa6';
import { GiShoppingBag } from 'react-icons/gi';
import { GrAnnounce, GrTransaction } from "react-icons/gr";
import { TbTruckDelivery } from 'react-icons/tb';
import { VscPackage } from 'react-icons/vsc';
import { useUser } from '../../context/UserContext';
import { BsSignpost } from 'react-icons/bs';
import { TbReport, TbAward } from "react-icons/tb";

const LeftNav = ({ setIsOpen }) => {

    const { user, logout } = useUser()

    const navItems = [
        {
            name: 'Dashboard',
            icon: <MdOutlineDashboard size={20} />,
            path: '/user/overview',
            role: ["user"]
        },
        {
            name: 'Dashboard',
            icon: <MdOutlineDashboard size={20} />,
            path: '/admin/overview',
            role: ["admin"]
        },
        {
            name: 'Users',
            icon: <FaUsers size={20} />,
            path: '/admin/allusers',
            role: ["admin"]
        },
        {
            name: 'Network',
            icon: <PiNetwork size={20} />,
            path: '/user/network',
            role: ["user"]
        },
        {
            name: 'Register',
            icon: <SlUserFollow className="-skew-x-1" size={20} />,
            path: '/user/register',
            role: ["user"]
        },
        {
            name: 'Deposit',
            icon: <BiMoneyWithdraw size={20} />,
            path: '/user/deposit',
            role: ["user"]
        },
        {
            name: 'Transfer Funds',
            icon: <GrTransaction size={20} />,
            path: '/user/transfer',
            role: ["user"]
        },
        {
            name: 'Transactions',
            icon: <PiCardsThreeFill size={20} />,
            path: '/user/transactions',
            role: ["user"]
        },
        {
            name: 'Digital',
            icon: <CgDigitalocean size={20} />,
            path: '/user/recharge',
            role: ["user"]
        },
        {
            name: 'Recharge History',
            icon: <FaPlugCircleBolt size={20} />,
            path: '/user/rechargehistory',
            role: ["user"]
        },
        {
            name: 'Repurchase Mall',
            icon: <GiShoppingBag size={20} />,
            path: '/user/products',
            role: ["user"]
        },
        {
            name: 'E-wallet Transfer',
            icon: <FaMoneyBillTransfer size={20} />,
            path: '/user/ewallettransfer',
            role: ["user"]
        },
        {
            name: 'Transaction',
            icon: <GrTransaction size={20} />,
            path: '/admin/managetransactions',
            role: ["admin"]
        },
        {
            name: 'Announcement',
            icon: <GrAnnounce size={20} />,
            path: '/admin/manageannouncement',
            role: ["admin"]
        },
        {
            name: 'Sales Report',
            icon: <TbReport size={20} />,
            path: '/admin/salesreport',
            role: ["admin"]
        },
        {
            name: 'Testimonials',
            icon: <MdChat size={20} />,
            path: '/admin/managetestimonials',
            role: ["admin"]
        },
        {
            name: 'Product Upload',
            icon: <MdOutlineFileUpload size={20} />,
            path: '/admin/uploadproduct',
            role: ["admin"]
        },
        {
            name: 'Contact Input',
            icon: <MdOutlineContactMail size={20} />,
            path: '/admin/managecontacts',
            role: ["admin"]
        },
        {
            name: 'Subscribers',
            icon: <MdOutlineUnsubscribe size={20} />,
            path: '/admin/subscribers',
            role: ["admin"]
        },
        {
            name: 'Packages',
            icon: <VscPackage size={20} />,
            path: '/admin/managepackages',
            role: ["admin"]
        },
        {
            name: 'Stockist',
            icon: <TbTruckDelivery size={20} />,
            path: '/stockist/user/managestockist',
            role: ["user"]
        },
        {
            name: 'Profile',
            icon: <FaRegCircleUser size={20} />,
            path: '/user/profile',
            role: ["user"]
        },
        {
            name: 'Manage Stockists',
            icon: <TbTruckDelivery size={20} />,
            path: '/stockist/admin/managestockist',
            role: ["admin"]
        },
        {
            name: 'Loyalty Bonus',
            icon: <MdOutlineLoyalty size={20} />,
            path: '/admin/loyaltybonus',
            role: ["admin"]
        },
        {
            name: 'Milestone Bonus',
            icon: <BsSignpost size={20} />,
            path: '/admin/milestonebonus',
            role: ["admin"]
        },
        {
            name: 'Rankings',
            icon: <FaRankingStar size={20} />,
            path: '/admin/ranking',
            role: ["admin"]
        },
        {
            name: 'Promo Qualifiers',
            icon: <TbAward size={20} />,
            path: '/admin/promoqualifiers',
            role: ["admin"]
        },
        {
            name: 'Developer Form',
            icon: <MdFormatListBulletedAdd size={20} />,
            path: '/admin/devform',
            role: ["admin"]
        },
        {
            name: 'Form Requests',
            icon: <MdFormatListBulletedAdd size={20} />,
            path: '/sunmence/formrequests',
            role: ["sunmence"]
        },
    ];

    const filteredLinks = navItems.filter(navItem => (Array.isArray(navItem.role) && navItem.role.includes(user?.role)));
    
    return (
      <div className='bg-pryClr lg:w-full md:w-3/5 w-full h-full md:pt-4 pt-8 flex flex-col gap-'>
        <div className="flex items-center justify-center">
            <img src={assets.logo} alt="Wellthrix logo" className='w-2/5' />
        </div>
        <ul className='lg:mt-5 mt-8 flex flex-col gap-3 pb-2 border-b border-secClr/20 h-3/4 overflow-y-scroll no-scrollbar'>
            {
                filteredLinks.map(({ name, icon, path }, index) => (
                // navItems.map(({ name, icon, path }, index) => (
                    <NavLink
                        to={path}
                        key={index}
                        className={({ isActive }) => `
                            flex items-center md:ps-18 ps-24 gap-3 font-medium border-l-10 border-transparent text-white transition-all duration-300 hover:border-secClr hover:bg-secClr/30 px-4 py-3 cursor-pointer text-base
                            ${name.toLowerCase() === "stockist" && user?.stockist_enabled !== 1 && "linkDisabled"}
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
        <button
            type="button"
            onClick={logout}
            className='flex items-center gap-2 cursor-pointer justify-start m-4 text-secClr font-semibold'
        >
            <MdLogout />
            <span>Logout</span>
        </button>
      </div>
    );
};

export default LeftNav;