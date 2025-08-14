import React, { useState, useEffect } from 'react';
import { LuSparkle, LuCrown } from 'react-icons/lu';
import { AiOutlineRise } from 'react-icons/ai';
import { FaRegStar, FaLock } from 'react-icons/fa';
import { IoShieldCheckmarkOutline } from 'react-icons/io5';
import { CgArrowTopRight } from 'react-icons/cg';
import { VscGraph } from 'react-icons/vsc';
import { GiFire } from 'react-icons/gi';
import axios from 'axios';
import { toast } from 'sonner';
import { useUser } from '../../context/UserContext';
import { formatterUtility } from '../../utilities/Formatterutility';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

const packageIcons = {
  spark: LuSparkle,
  rise: AiOutlineRise,
  star: FaRegStar,
  super: IoShieldCheckmarkOutline,
  thrive: CgArrowTopRight,
  thrix: VscGraph,
  crown: LuCrown,
  default: GiFire,
};

const UpgradePackage = () => {
  const { user, token, logout } = useUser();
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);

  // Fetch all packages
  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/plans`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (response.status === 200) {
        const fetchedPackages = response.data.data.data || [];
        setPackages(fetchedPackages);
        // Find the current package based on user.plan
        const current = fetchedPackages.find((pkg) => pkg.id === user.plan);
        setCurrentPackage(current || null);
      } else {
        throw new Error(response.data.message || 'Failed to fetch packages.');
      }
    } catch (error) {
      if (error.response?.data?.message?.includes('unauthenticated')) logout();
      toast.error(error.response?.data?.message || 'Failed to fetch packages.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle package upgrade
  const handleUpgrade = async () => {
    if (!selectedPackage) {
      toast.error('Please select a package to upgrade.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/upgrade-plan`,
        {
          user_id: user.id,
          upgrade_plan_id: selectedPackage.id,
        },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );
      if (response.status === 200) {
        toast.success(`Successfully upgraded to ${selectedPackage.name} package!`);
        setCurrentPackage(selectedPackage);
        setSelectedPackage(null);
        // Refresh packages to ensure data consistency
        await fetchPackages();
      } else {
        throw new Error(response.data.message || 'Failed to upgrade package.');
      }
    } catch (error) {
      if (error.response?.data?.message?.includes('unauthenticated')) logout();
      toast.error(error.response?.data?.message || 'Failed to upgrade package.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPackage = (pkg) => {
    // Calculate the additional amount needed
    const additionalAmount = Number(pkg.price) - Number(currentPackage?.price || 0);
    if (additionalAmount > Number(user.e_wallet)) {
      toast.error(
        `Insufficient balance: ${formatterUtility(Number(user.e_wallet))} available, ${formatterUtility(
          additionalAmount
        )} required.`
      );
      return;
    }
    setSelectedPackage(pkg);
    toast.success(`Selected ${pkg.name} package.`);
  };

  // Fetch packages on mount
  useEffect(() => {
    if (token) {
      fetchPackages();
    }
  }, [token]);

  return (
    <div className="w-full bg-white shadow-sm rounded-lg flex flex-col gap-8 p-4 md:p-8">
      {/* Current Package Section */}
      <div className="w-full flex flex-col gap-4">
        <p className="font-semibold text-lg md:text-2xl">Current Package</p>
        <div className="w-full p-4 md:p-8 bg-pryClr rounded-lg shadow-sm flex justify-between items-center">
          {isLoading || !currentPackage ? (
            <div className="border-4 border-t-transparent animate-spin mx-auto rounded-full w-[50px] h-[50px]"></div>
          ) : (
            <>
              <div className="flex gap-2 items-center">
                {(() => {
                  const Icon = packageIcons[currentPackage.name.toLowerCase()] || packageIcons.default;
                  return <Icon className="text-6xl text-secClr" />;
                })()}
                <div className="flex flex-col gap-1">
                  <p className="text-lg md:text-2xl font-semibold text-secClr capitalize">{currentPackage.name} Package</p>
                  <p className="text-xs md:text-base text-secClr">Point Value: {currentPackage.point_value}pv</p>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-secClr">{formatterUtility(Number(currentPackage.price))} NGN</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* All Packages Section */}
      <div className="w-full flex flex-col gap-4">
        <p className="font-semibold text-lg md:text-2xl">Choose a plan to upgrade</p>
        <div className="flex w-full overflow-x-auto scrollbar-hide gap-6 pb-4">
          {isLoading ? (
            <div className="border-4 border-t-transparent animate-spin mx-auto rounded-full w-[100px] h-[100px]"></div>
          ) : packages.length > 0 ? (
            packages.map((pkg, index) => {
              const Icon = packageIcons[pkg.name.toLowerCase()] || packageIcons.default;
              // Check if package is current or lower-priced (downgrade prevention)
              const isDisabled =
                Number(pkg.price) <= Number(currentPackage?.price || 0) ||
                Number(pkg.price) - Number(currentPackage?.price || 0) > Number(user.e_wallet);
              const additionalAmount = Number(pkg.price) - Number(currentPackage?.price || 0);
              return (
                <div
                  key={pkg.id}
                  onClick={() => !isDisabled && handleSelectPackage(pkg)}
                  className={`
                    min-w-80 relative overflow-hidden z-1 h-max rounded-3xl p-6 flex flex-col gap-3 bg-white text-black
                    border-2 ${selectedPackage?.id === pkg.id ? 'border-pryClr' : 'border-black/10'}
                    transition-all ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
                  `}
                  aria-disabled={isDisabled}
                  title={
                    isDisabled
                      ? Number(pkg.price) <= Number(currentPackage?.price || 0)
                        ? Number(pkg.price) === Number(currentPackage?.price || 0)
                          ? 'This is your current package.'
                          : 'Downgrading is not allowed.'
                        : `Insufficient balance: ${formatterUtility(Number(user.e_wallet))} available`
                      : ''
                  }
                >
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold capitalize">{pkg.name} Package</p>
                    <Icon className={`text-3xl ${index % 2 === 0 ? 'text-accClr' : 'text-pryClr'}`} />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <p className={`font-bold text-4xl ${index % 2 === 0 ? 'text-accClr' : 'text-pryClr'}`}>
                      {formatterUtility(Number(pkg.price))}
                      <span className="text-base font-normal"> NGN</span>
                    </p>
                    <p className="text-sm">Point Value: {pkg.point_value}pv</p>
                  </div>
                  {isDisabled && (
                    <div className="absolute inset-0 bg-black/70 p-6 z-5 text-secClr font-bold text-xl opacity-100 flex flex-col gap-2 items-center justify-center text-center">
                      <FaLock className="size-10" />
                      <h3 className="leading-5">
                        {Number(pkg.price) <= Number(currentPackage?.price || 0)
                          ? Number(pkg.price) === Number(currentPackage?.price || 0)
                            ? 'Current Package'
                            : 'Downgrade Not Allowed'
                          : `Insufficient balance: `}
                        {Number(pkg.price) > Number(currentPackage?.price || 0) && (
                          <span className="text-accClr">{formatterUtility(additionalAmount)}</span>
                        )}
                      </h3>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No packages available.</p>
          )}
        </div>
        {/* Upgrade Button */}
        {selectedPackage && (
          <div className="flex justify-end">
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className={`
                px-6 py-2 bg-pryClr text-secClr font-semibold rounded-lg
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accClr'}
              `}
            >
              {isLoading ? 'Upgrading...' : 'Upgrade'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradePackage;