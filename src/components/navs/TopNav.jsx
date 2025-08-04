import React, { useState } from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { GoSearch } from 'react-icons/go';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const TopNav = ({ pageName, subText }) => {
  const [searchParam, setSearchParam] = useState('');

  const location = useLocation();
  const dontShowSearchBar = ["/user/overview"].includes(location.pathname);

  const navigate = useNavigate();

  return (
    <div className="w-full flex gap-3 items-center justify-between">
      <div className="flex flex-col -leading-1">
        <h3 className="lg:text-xl md:text-2xl text-lg font-semibold line-clamp-1">
          {pageName}
        </h3>
        {subText && (
          <p className="text-black/50 md:text-base text-xs line-clamp-1">{subText}</p>
        )}
      </div>

      <div className="flex items-center md:gap-4 gap-2">
        {/* Search Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearchParam('');
          }}
          className={`gap-2 items-center border border-pryClr/50 rounded-full px-4 ${
            dontShowSearchBar ? 'hidden' : 'md:!flex hidden'
          }`}
        >
          <input
            type="text"
            placeholder="Search"
            className="indent-2 w-[200px] h-[40px] border-0 outline-0"
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
          />
          <GoSearch size={22} className="text-pryClr/50" />
        </form>

        {/* Notification Icon */}
        <button type="button">
          <IoMdNotificationsOutline className="text-pryClr md:text-3xl text-2xl" />
        </button>

        {/* Profile Link */}
        <Link
          to="/user/profile"
          className="md:w-11 w-10 md:h-11 h-10 rounded-full border border-pryClr bg-white overflow-hidden flex items-center justify-center"
        >
          <h3>DB</h3>
        </Link>
      </div>
    </div>
  );
};

export default TopNav;
