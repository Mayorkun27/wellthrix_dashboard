import React from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { GoSearch } from 'react-icons/go';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import FilterDropdown from '../../utilities/FilterDropdown';

const optionsRecharge = ['Airtime', 'Data', 'Electricity'];
const optionsTransactions = ['E-Wallet', 'Purchase Wallet', 'Earnings Wallet', 'Incentive Wallet', 'Withdraw History'];

const TopNav = ({ pageName, subText, selectedType, setSelectedType }) => {
  const [searchParam, setSearchParam] = React.useState('');
  const location = useLocation();
  const showSearchBar = ["/user/transactions", "/user/rechargehistory"].includes(location.pathname);
  const navigate = useNavigate();
  const { user } = useUser()
    
  const splittedFirstNameFirstLetter = user?.first_name.split("")[0]
  const splittedLastNameFirstLetter = user?.last_name.split("")[0]

  return (
    <div className="w-full flex gap-3 items-center justify-between">
      <div className="flex flex-col -leading-1">
        <h3 className="lg:text-xl md:text-2xl text-lg font-semibold line-clamp-1 capitalize">
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
            showSearchBar ? 'md:!flex hidden' : 'hidden'
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
          <FilterDropdown
            options={optionsRecharge}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
        )}

        {pageName === 'Transactions' && (
          <FilterDropdown
            options={optionsTransactions}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
        )}

        <button type="button">
          <IoMdNotificationsOutline className="text-pryClr md:text-3xl text-2xl" />
        </button>

        <Link
          to="/user/profile"
          className="md:w-11 w-10 md:h-11 h-10 rounded-full border border-pryClr bg-white overflow-hidden capitalize flex items-center justify-center"
        >
          <h3>{`${splittedFirstNameFirstLetter}${splittedLastNameFirstLetter}`}</h3>
        </Link>
      </div>
    </div>
  );
};

export default TopNav;