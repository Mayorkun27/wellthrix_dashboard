import React from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { GoSearch } from 'react-icons/go';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import FilterDropdown from '../../utilities/FilterDropdown';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import { useCart } from '../../context/CartContext';

const optionsRecharge = ['Airtime', 'Data', 'Electricity'];
const optionsTransactions = ['E-Wallet', 'Purchase Wallet', 'Earnings Wallet', 'Incentive Wallet', 'Withdraw History', 'Product History'];

const TopNav = ({ pageName, subText, selectedType, setSelectedType }) => {
  const [searchParam, setSearchParam] = React.useState('');
  const location = useLocation();
  const showSearchBar = ["/user/transactions", "/user/rechargehistory"].includes(location.pathname);
  const navigate = useNavigate();
  const { user } = useUser()
  const { cartItems } = useCart()
    
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

      <div className="flex items-center md:gap-5 gap-3">
        <form
          hidden
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

        <Link 
          to={"/user/overview"}
          type="button">
          <IoMdNotificationsOutline className="text-pryClr md:text-3xl text-2xl" />
        </Link>

        <Link
          to={"/user/products/cart"}
          className='relative'
        >
          <HiOutlineShoppingCart className="text-pryClr md:text-3xl text-2xl" />
          {cartItems.length > 0 && (
            <span
              className="absolute -top-1 -right-1.5 bg-red-500 text-white text-xs font-semibold rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center"
            >
              {cartItems.length > 9 ? '9+' : cartItems.length}
            </span>
          )}
        </Link>

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