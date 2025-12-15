import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { formatterUtility } from '../../../utilities/formatterutility';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const StepSix = ({ prevStep, formData, updateFormData, sessionId }) => {
  
  console.log("sessionId received in StepSix:", sessionId); 
  console.log("formdata received in StepSix:", formData); 

  const { token, logout } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const completeRegistrationSteps = async () => {
    const toastId = toast.loading("Completing registration...")
    if (!sessionId) {
      toast.error("Session ID is missing. Cannot complete registration.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/registration/initiate/pay`, {}, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": `application/json`,
          'Content-Type': 'application/json',
          "X-Session-ID": sessionId,
        }
      });

      console.log("completion response", response);

      if (response.status === 200 && response.data.success) {
        toast.success(response.data.message || "Registration completed successfully.", { id: toastId });
        setIsSuccess(true)
      } else {
        throw new Error(response.data.message || "Registration completion failed.");
      }
    } catch (error) {
      if (error.response?.data?.message?.includes("unauthenticated")) {
        logout();
      }
      console.error("An error occurred completing registration:", error);
      toast.error(error.response?.data?.message || "An error occurred completing registration.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    updateFormData(null);
    setTimeout(() => {
      navigate("/user/overview");
    }, 500);
  }

  useEffect(() => {
    if (sessionId && token) {
      completeRegistrationSteps();
    }
  }, [sessionId, token]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='w-full flex flex-col gap-4 mt-6'>
      <div className='w-full flex flex-col gap-4 md:gap-6 rounded-2xl bg-white shadow-md px-4 md:px-6 py-6'>
        {isLoading && (
          <div className='flex flex-col items-center justify-center'>
            <div className="w-24 h-24 border-4 border-pryClr rounded-full border-t-transparent animate-spin"></div>
            <h3>Completing Registration</h3>
          </div>
        )}

        {isSuccess && (
          <div className='flex flex-col gap-2 items-center justify-center'>
            <div className='w-24 h-24 rounded-full bg-accClr flex justify-center items-center text-5xl mb-2'>🎉</div>
            <h3 className='font-semibold text-xl'>Registration completed successfully</h3>
            <h3><span className='capitalize'>{formData?.sponsor?.username}</span> has successfully sponsored <span className='capitalize'>{formData?.username}</span> on the <span className='capitalize'>{formData?.selectedPackage?.name}</span> package</h3>
                    
            <button
              type='button'
              onClick={handleFinish}
              className='mt-6 rounded-lg cursor-pointer text-white px-6 py-3 transition-colors bg-pryClr hover:bg-pryClrDark disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Back Home
            </button>
          </div>
        )}

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
            onClick={() => completeRegistrationSteps()}
            disabled={isLoading || !sessionId}
            className='text-xl rounded-lg cursor-pointer text-white px-6 py-3 transition-colors bg-pryClr hover:bg-pryClrDark disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? "Retrying..." : "Retry"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepSix;