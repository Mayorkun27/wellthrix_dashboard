import React, { useState, useRef, useEffect } from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { GoSearch } from 'react-icons/go';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const options = ['Airtime', 'Data', 'Electricity'];

const TopNav = ({ pageName, subText, selectedType, setSelectedType }) => {
  const [searchParam, setSearchParam] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const location = useLocation();
  const dontShowSearchBar = ['/user/overview'].includes(location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full flex gap-3 items-center justify-between">
    
      <div className="flex flex-col -leading-1">
        <h3 className="lg:text-xl md:text-2xl text-lg font-semibold line-clamp-1">
          {pageName}
        </h3>
        {subText && (
          <p className="text-black/50 md:text-base text-xs line-clamp-1">
            {subText}
          </p>
        )}
      </div>

      <div className="flex items-center md:gap-4 gap-2">
      
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
            placeholder="Search History"
            className="indent-2 w-[200px] h-[40px] border-0 outline-0"
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
          />
          <GoSearch size={22} className="text-pryClr/50" />
        </form>


        {pageName === 'Recharge History' && (
          <div className="relative w-40 p-3" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="w-full flex items-center justify-between border border-pryClr/50 rounded-full px-4 py-2 bg-transparent text-sm text-black/80"
            >
              {selectedType}
              {isOpen ? (
                <FaChevronUp className="text-pryClr/50 text-xs" />
              ) : (
                <FaChevronDown className="text-pryClr/50 text-xs" />
              )}
            </button>

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
        )}

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
