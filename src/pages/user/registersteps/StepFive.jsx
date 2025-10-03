import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { useUser } from '../../../context/UserContext';
import { formatterUtility } from '../../../utilities/formatterutility';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const StepFive = ({ prevStep, nextStep, formData, sessionId }) => {

  useEffect(() => {
    console.log('StepFive sessionId:', sessionId);
    console.log('StepFive formData:', formData);
  }, [sessionId, formData]);

  const [ registerOverview, setRegisterOverview ] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const { token, logout } = useUser()

  useEffect(() => {
    const fetchStepsSummary = async () => {
      if (!sessionId) {
        toast.error('Session ID is missing. Please start over.');
        return;
      }

      setIsLoading(true)
      console.log('StepFive received sessionId:', sessionId);
      console.log({ 'X-Session-ID': sessionId });
      try {
        const response = await axios.get(`${API_URL}/api/registration/overview`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": `application/json`,
            'Content-Type': 'application/json',
            "X-Session-ID": sessionId,
          }
        });

        console.log("overview response", response)

        if (response.status === 200 && response.data.success) {
          toast.success(response.data.message || "Overview data fetched successfully.");
          setRegisterOverview(response.data.data)
        } else {
          throw new Error(response.data.message || "Overview API call failed.");
        }
      } catch (error) {
        if (error.response?.data?.message?.includes("unauthenticated")) {
          logout();
        }
        console.error("An error occured fetching overview:", error);
        toast.error(error.response?.data?.message || "An error occurred fetching overview data.");
      } finally {
        setIsLoading(false)
      }
    }

    fetchStepsSummary()
  }, [token])

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleProceed = () => {
    nextStep()
  }

  if (isLoading) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <div className='w-full flex flex-col gap-4 mt-6'>
      <div className='w-full flex flex-col gap-4 md:gap-6 rounded-2xl bg-white shadow-md px-4 md:px-6 py-6'>
        <div>
          <p className='text-xl md:text-2xl font-bold text-gray-800'>Sponsor And Product</p>
        </div>
        <div className='w-full rounded-xl bg-pryClr/20 shadow-md px-4 md:px-6 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Package</p>
            <p className='text-lg md:text-xl font-bold capitalize'>{formData?.selectedPackage?.name || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Sponsor</p>
            <p className='text-lg md:text-xl font-bold capitalize'>{formData?.sponsor.username || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>PV</p>
            <p className='text-lg md:text-xl font-bold capitalize'>{formData?.selectedPackage?.point_value+"PV" || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Price</p>
            <p className='text-lg md:text-xl font-bold capitalize'>{formatterUtility(Number(formData?.selectedPackage?.price)) || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Total Amount</p>
            <p className='text-lg md:text-xl font-bold capitalize'>{formatterUtility(Number(formData?.selectedPackage?.price)) || 'N/A'}</p>
          </div>
        </div>

        <div>
          <p className='text-xl md:text-2xl font-bold text-gray-800'>Contact Information</p>
        </div>
        <div className='w-full rounded-xl bg-pryClr/5 border border-black/20 shadow-md px-4 md:px-6 py-6 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>First Name</p>
            <p className='text-lg md:text-xl font-bold'>{registerOverview?.step_3.first_name || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Last Name</p>
            <p className='text-lg md:text-xl font-bold'>{registerOverview?.step_3.last_name || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Gender</p>
            <p className='text-lg md:text-xl font-bold'>{registerOverview?.step_3.gender ? registerOverview?.step_3.gender.charAt(0).toUpperCase() + registerOverview?.step_3.gender.slice(1) : 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Country</p>
            <p className='text-lg md:text-xl font-bold'>{registerOverview?.step_3.country || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>State</p>
            <p className='text-lg md:text-xl font-bold'>{registerOverview?.step_3.state || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>City</p>
            <p className='text-lg md:text-xl font-bold'>{registerOverview?.step_3.city || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Mobile</p>
            <p className='text-lg md:text-xl font-bold'>{registerOverview?.step_3.mobile || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Email</p>
            <p className="text-lg md:text-xl font-bold break-all">{registerOverview?.step_3.email || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Date of Birth</p>
            <p className='text-lg md:text-xl font-bold'>{registerOverview?.step_3.date_of_birth || 'N/A'}</p>
          </div>
        </div>

        <div>
          <p className='text-xl md:text-2xl font-bold text-gray-800'>Login Information</p>
        </div>
        <div className='w-full rounded-xl bg-pryClr/5 border border-black/20 shadow-md px-4 md:px-6 py-6 grid grid-cols-2 gap-4 md:gap-6'>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Username</p>
            <p className='text-lg md:text-xl font-bold'>{registerOverview?.step_4.username || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Password</p>
            <p className='text-lg md:text-xl font-bold'>{registerOverview?.step_4.password || 'N/A'}</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className='flex justify-between mt-4'>
          <button
            type='button'
            onClick={prevStep}
            className='text-xl bg-black hover:bg-black/80 rounded-lg cursor-pointer text-secClr px-6 py-3 transition-colors'
          >
            Back
          </button>
          <button
            type='button'
            onClick={handleProceed}
            className='thissguyyy text-xl rounded-lg cursor-pointer text-white px-6 py-3 transition-colors bg-pryClr hover:bg-pryClrDark'
          >
            Next
          </button>
        </div>
      </div>

    </div>
  )
}

export default StepFive