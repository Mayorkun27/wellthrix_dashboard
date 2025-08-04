import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import { LuSparkle, LuCrown } from 'react-icons/lu';
import { AiOutlineRise } from 'react-icons/ai';
import { FaRegStar } from 'react-icons/fa';
import { IoShieldCheckmarkOutline } from 'react-icons/io5';
import { CgArrowTopRight } from 'react-icons/cg';
import { VscGraph } from 'react-icons/vsc';
import { FiSearch } from 'react-icons/fi';

const StepOne = ({ nextStep, formData, updateFormData }) => {

    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedPackage, setSelectedPackage] = useState(formData.selectedPackage || null);

  const packages = [
    {
      id: 1,
      name: "Spark Package",
      price: "10,500",
      currency: "NGN",
      pointValue: "8PV",
      iconColor: "text-pryClr",
      buttonColor: "bg-pryClr hover:bg-pryClrDark",
      icon: <LuSparkle className="text-3xl" />,
      link: "/login"
    },
    {
      id: 2,
      name: "Rise Package",
      price: "28,000",
      currency: "NGN",
      pointValue: "24PV",
      iconColor: "text-accClr",
      buttonColor: "bg-accClr hover:bg-pryClrDark",
      icon: <AiOutlineRise className="text-3xl" />,
      link: "/login"
    },
    {
      id: 3,
      name: "Star Package",
      price: "44,000",
      currency: "NGN",
      pointValue: "40PV",
      iconColor: "text-pryClr",
      buttonColor: "bg-pryClr hover:bg-pryClrDark",
      icon: <FaRegStar className="text-3xl" />,
      link: "/login"
    },
    {
      id: 4,
      name: "Super Package",
      price: "98,000",
      currency: "NGN",
      pointValue: "80PV",
      iconColor: "text-accClr",
      buttonColor: "bg-accClr hover:bg-pryClrDark",
      icon: <IoShieldCheckmarkOutline className="text-3xl" />,
      link: "/login"
    },
    {
      id: 5,
      name: "Thrive Package",
      price: "264,000",
      currency: "NGN",
      pointValue: "240PV",
      iconColor: "text-pryClr",
      buttonColor: "bg-pryClr hover:bg-pryClrDark",
      icon: <CgArrowTopRight className="text-3xl" />,
      link: "/login"
    },
    {
      id: 6,
      name: "Thrix Package",
      price: "528,000",
      currency: "NGN",
      pointValue: "480PV",
      iconColor: "text-accClr",
      buttonColor: "bg-accClr hover:bg-pryClrDark",
      icon: <VscGraph className="text-3xl" />,
      link: "/login"
    },
    {
      id: 7,
      name: "Crown Package",
      price: "1,100,000",
      currency: "NGN",
      pointValue: "1,000PV",
      iconColor: "text-pryClr",
      buttonColor: "bg-pryClr hover:bg-pryClrDark",
      icon: <LuCrown className="text-3xl" />,
      link: "/login"
    },
  ];

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    updateFormData({ selectedPackage: pkg });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className='w-full flex flex-col gap-4 mt-6'>
      <div className='w-full flex flex-col gap-4 md:gap-6 rounded-2xl bg-white shadow-xl px-4 md:px-6 py-6'>
        <div>
          <p className='text-xl md:text-2xl font-bold text-gray-800'>Sponsor</p>
        </div>

        <div className='w-full'>
          {/* Grid Container - changes from 1 column to 2 columns on lg screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Spot Search Input */}
            <div className="relative">
              <label htmlFor="spot" className="block text-xl md:text-2xl font-medium mb-2">
                Sponsor
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-pryClr" />
                </div>
                <input
                  type="text"
                  id="spot"
                  name="spot"
                  placeholder="Search for a sponsor"
                  className="block w-full h-12 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-pryClr focus:border-pryClr"
                  onChange={(e) => updateFormData({ sponsor: e.target.value })}
                  value={formData.sponsor || ''}
                />
              </div>
            </div>

            {/* Placement Search Input */}
            <div className="relative">
              <label htmlFor="placement" className="block text-xl md:text-2xl font-medium mb-2">
                Placement
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-pryClr" />
                </div>
                <input
                  type="text"
                  id="placement"
                  name="placement"
                  placeholder="Search for placement"
                  className="block w-full h-12 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-pryClr focus:border-pryClr"
                  onChange={(e) => updateFormData({ placement: e.target.value })}
                  value={formData.placement || ''}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4 md:gap-6 rounded-2xl bg-white shadow-xl px-4 md:px-6 py-6'>
        <div>
          <p className='text-xl md:text-2xl font-bold text-gray-800'>Pick Your Products</p>
        </div>

        <div className="w-full">
          {/* Package Cards - Horizontal Scroll */}
          <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-6 w-max px-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg)}
                  className={`
                    w-72 rounded-3xl px-6 py-8 flex flex-col gap-6 bg-white text-black cursor-pointer
                    border-2 ${selectedPackage?.id === pkg.id ? 'border-pryClr' : 'border-black/10'}
                    transition-all hover:shadow-lg
                  `}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold">{pkg.name}</p>
                    <div className={pkg.iconColor}>{pkg.icon}</div>
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <p className="font-bold text-4xl">
                      {pkg.price}
                      <span className="text-base font-normal">{pkg.currency}</span>
                    </p>
                    <p className="text-sm">Point Value: {pkg.pointValue}</p>
                  </div>
                  <div>
                    <div className={`w-full text-white ${pkg.buttonColor} flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors`}>
                      <BsArrowRight className="w-6 h-6" />
                      <span className="font-medium text-lg">Get Started</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={!selectedPackage}
            className={`
              text-xl bg-pryClr rounded-xl text-white px-6 py-3 transition-colors
              ${!selectedPackage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pryClrDark'}
            `}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepOne;