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
import axios from 'axios';
import { toast } from 'sonner';
import { useUser } from '../../../context/UserContext';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const StepOne = ({ nextStep, formData, updateFormData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { token, logout } = useUser();
  console.log("token from context", token)

  const [selectedPackage, setSelectedPackage] = useState(formData.selectedPackage || null);
  const [sponsor, setSponsor] = useState(formData.sponsor || '');
  const [placement, setPlacement] = useState(formData.placement || '');
  const [leg, setleg] = useState(formData.leg || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const packages = [
    { id: 1, name: "Spark Package", price: "10,500", currency: "NGN", pointValue: "8PV", iconColor: "text-pryClr", buttonColor: "bg-pryClr hover:bg-pryClrDark", icon: <LuSparkle className="text-3xl" />, link: "/login" },
    { id: 2, name: "Rise Package", price: "28,000", currency: "NGN", pointValue: "24PV", iconColor: "text-accClr", buttonColor: "bg-accClr hover:bg-pryClrDark", icon: <AiOutlineRise className="text-3xl" />, link: "/login" },
    { id: 3, name: "Star Package", price: "44,000", currency: "NGN", pointValue: "40PV", iconColor: "text-pryClr", buttonColor: "bg-pryClr hover:bg-pryClrDark", icon: <FaRegStar className="text-3xl" />, link: "/login" },
    { id: 4, name: "Super Package", price: "98,000", currency: "NGN", pointValue: "80PV", iconColor: "text-accClr", buttonColor: "bg-accClr hover:bg-pryClrDark", icon: <IoShieldCheckmarkOutline className="text-3xl" />, link: "/login" },
    { id: 5, name: "Thrive Package", price: "264,000", currency: "NGN", pointValue: "240PV", iconColor: "text-pryClr", buttonColor: "bg-pryClr hover:bg-pryClrDark", icon: <CgArrowTopRight className="text-3xl" />, link: "/login" },
    { id: 6, name: "Thrix Package", price: "528,000", currency: "NGN", pointValue: "480PV", iconColor: "text-accClr", buttonColor: "bg-accClr hover:bg-pryClrDark", icon: <VscGraph className="text-3xl" />, link: "/login" },
    { id: 7, name: "Crown Package", price: "1,100,000", currency: "NGN", pointValue: "1,000PV", iconColor: "text-pryClr", buttonColor: "bg-pryClr hover:bg-pryClrDark", icon: <LuCrown className="text-3xl" />, link: "/login" },
  ];

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    updateFormData({ ...formData, selectedPackage: pkg });
  };

  const handleRegInit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/api/registration/initiate`, {}, {
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("reg init response", response)

      if (response.status === 200 && response.data.success) {
        toast.success("Downline Registration initialized successfully!.");
        const newSessionId = response.data.session_id;
        console.log("newSessionId", newSessionId)
        setCurrentSessionId(newSessionId);
        setTimeout(() => {
          handleSubmit(newSessionId);
        }, 1500);
      } else {
        throw new Error(response.data.message || "Failed to initialize registration.");
      }

    } catch (error) {
      if (error.response?.data?.message?.includes("unauthenticated")) {
        logout();
      }
      console.error("API submission error:", error);
      toast.error(error.response?.data?.message || "An error occurred initializing registration!.");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (sessionIdFromInit) => {
    const toastId = toast.loading("Processing step one")
    if (!sessionIdFromInit) {
      toast.error("Session Id is required to continue!. Please try again!.");
      return;
    }

    const dataToSubmit = {
      plan: selectedPackage.id,
      leg: leg,
      sponsor: sponsor,
      placement: placement,
      sessionId: sessionIdFromInit
    };

    try {
      const response = await axios.post(`${API_URL}/api/registration/step-1`, dataToSubmit, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": `application/json`,
          'Content-Type': 'application/json',
          "X-Session-ID": sessionIdFromInit,
        },
      });

      console.log("step 1 response", response)

      if (response.status === 200) {
        toast.success(response.data.message || "Step 1 recorded successfully", { id: toastId });
        nextStep(sessionIdFromInit);
      } else {
        throw new Error(response.data.message || "API call failed for Step 1");
      }

    } catch (error) {
      if (error.response?.data?.message?.toLowerCase() === "unauthenticated") {
        logout();
      }
      console.error("API submission error:", error);
      toast.error(error.response?.data?.message || "An error occurred submitting Step 1", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePositionSelection = (selection) => {
    setleg(selection)
  }

  const isFormValid = selectedPackage && sponsor.trim() !== '' && placement.trim() !== '';

  return (
    <div className='w-full flex flex-col gap-4 mt-6'>
      <div className='w-full flex flex-col gap-4 md:gap-6 rounded-2xl bg-white shadow-xl px-4 md:px-6 py-6'>
        <div>
          <p className='text-2xl font-bold text-gray-800'>Sponsor</p>
        </div>

        <div className='w-full'>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="relative">
              <label htmlFor="spot" className="block text-lg md:text-2xl font-medium mb-2">
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
                  onChange={(e) => setSponsor(e.target.value)}
                  value={sponsor}
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="placement" className="block text-lg md:text-2xl font-medium mb-2">
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
                  onChange={(e) => setPlacement(e.target.value)}
                  value={placement}
                />
              </div>
            </div>

            <div className="relative lg:col-span-1 md:col-span-2">
              <label htmlFor="placement" className="block text-lg md:text-2xl font-medium mb-2">
                Position
              </label>
              <div className="relative flex items-center gap-6">
                <button
                  type='button'
                  onClick={() => handlePositionSelection("left")}
                  className={`w-full h-12 border-2 border-pryClr cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 rounded-lg ${leg === "left" ? "bg-pryClr text-secClr" : "bg-transparent text-black"} transition-all duration-500`}  
                >Left</button>
                <button
                  type='button'
                  onClick={() => handlePositionSelection("right")}
                  className={`w-full h-12 border-2 border-pryClr cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 rounded-lg ${leg === "right" ? "bg-pryClr text-secClr" : "bg-transparent text-black"} transition-all duration-500`}  
                >Right</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleRegInit} className='w-full flex flex-col gap-4 md:gap-6 rounded-2xl bg-white shadow-xl px-4 md:px-6 py-6'>
        <div>
          <p className='text-xl md:text-2xl font-bold text-gray-800'>Pick Your Products</p>
        </div>

        <div className="w-full">
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

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`
              text-xl bg-pryClr rounded-xl text-white px-6 py-3 transition-colors
              ${(!isFormValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pryClrDark'}
            `}
          >
            {isSubmitting ? 'Loading...' : 'Next 1'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepOne;