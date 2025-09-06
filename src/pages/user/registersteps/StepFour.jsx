import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const StepFour = ({ prevStep, nextStep, formData, updateFormData, sessionId }) => {

   useEffect(() => {
      console.log('StepFour sessionId:', sessionId);
    }, [sessionId]);

  const { token, logout } = useUser()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    password_confirmation: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    terms_accepted: Yup.boolean()
      .required('You must agree to the terms and conditions')
      .oneOf([true], 'You must agree to the terms and conditions')
  });

  const formik = useFormik({
    initialValues: {
      username: formData.username || '',
      password: formData.password || '',
      password_confirmation: formData.password_confirmation || '',
      terms_accepted: formData.terms_accepted || false
    },
    validationSchema,
    onSubmit: async ( values, { setSubmitting } ) => {
      console.log("values to be posted", values)

      if (!sessionId) {
        toast.error('Session ID is missing. Please start over.');
        return;
      }

      setSubmitting(true);
      updateFormData(values);

      console.log('StepFour received sessionId:', sessionId);
      console.log('StepFour API payload:', values, { 'X-Session-ID': sessionId });
      try {
        const response = await axios.post(`${API_URL}/api/registration/step-4`, values, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": `application/json`,
            'Content-Type': 'application/json',
            "X-Session-ID": sessionId,
          }
        });

        console.log("step 4 response", response)

        if (response.status === 200 && response.data.success) {
          toast.success(response.data.message || "Step 4 data recorded successfully.");
          nextStep();
        } else {
          throw new Error(response.data.message || "Step 4 API call failed.");
        }
      } catch (error) {
        if (error.response?.data?.message?.includes("unauthenticated")) {
          logout();
        }
        console.error("Step Three submission error:", error);
        toast.error(error.response?.data?.message || "An error occurred submitting step 4 data.");
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} className='w-full flex flex-col gap-4 mt-6'>
      <div className='w-full flex flex-col gap-4 md:gap-6 rounded-2xl bg-white shadow-xl px-4 md:px-6 py-6'>
        <div>
          <p className='text-xl md:text-2xl font-bold text-gray-800'>Login Information</p>
        </div>
        
        <div className='w-full flex flex-col gap-4'>
          {/* Username */}
          <div className='flex flex-col'>
            <label htmlFor='username' className='text-sm font-medium text-gray-700 mb-1'>
              Username {formik.touched.username && formik.errors.username && (
                <span className='text-red-500 text-xs'> - {formik.errors.username}</span>
              )}
            </label>
            <input
              type='text'
              id='username'
              name='username'
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-12 px-4 py-2 border ${formik.touched.username && formik.errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr`}
            />
          </div>

          {/* Password and Confirm Password */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Password */}
            <div className='flex flex-col'>
              <label htmlFor='password' className='text-sm font-medium text-gray-700 mb-1'>
                Password {formik.touched.password && formik.errors.password && (
                  <span className='text-red-500 text-xs'> - {formik.errors.password}</span>
                )}
              </label>
              <input
                type='password'
                id='password'
                name='password'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>

            {/* Confirm Password */}
            <div className='flex flex-col'>
              <label htmlFor='password_confirmation' className='text-sm font-medium text-gray-700 mb-1'>
                Confirm Password {formik.touched.password_confirmation && formik.errors.password_confirmation && (
                  <span className='text-red-500 text-xs'> - {formik.errors.password_confirmation}</span>
                )}
              </label>
              <input
                type='password'
                id='password_confirmation'
                name='password_confirmation'
                value={formik.values.password_confirmation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border ${formik.touched.password_confirmation && formik.errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
          </div>

          {/* Password requirement text */}
          <p className='text-xs text-gray-500'>Password must be at least 8 characters</p>

          {/* Agree to Terms Checkbox */}
          <div className='flex items-center mt-2'>
            <input
              type='checkbox'
              id='terms_accepted'
              name='terms_accepted'
              checked={formik.values.terms_accepted}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='h-5 w-5 rounded border-gray-300 text-pryClr focus:ring-pryClr accent-pryClr'
            />
            <label htmlFor='terms_accepted' className='ml-2 text-sm text-gray-700'>
              I agree to the terms and conditions
              {formik.touched.terms_accepted && formik.errors.terms_accepted && (
                <span className='text-red-500 text-xs'> - {formik.errors.terms_accepted}</span>
              )}
            </label>
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
            type='submit'
            disabled={!formik.isValid || formik.isSubmitting}
            className={`text-xl rounded-lg cursor-pointer text-white px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              !formik.isValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-pryClr hover:bg-pryClrDark'
            }`}
          >
            {formik.isSubmitting ? "Saving..." : "Next"}
          </button>
        </div>
      </div>

    </form>
  );
};

export default StepFour;