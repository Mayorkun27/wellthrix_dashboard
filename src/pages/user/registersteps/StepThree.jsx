import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const StepThree = ({ prevStep, nextStep, formData, updateFormData }) => {

      useEffect(() => {
      window.scrollTo(0, 0);
    }, []);


  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    agreeToTerms: Yup.boolean()
      .required('You must agree to the terms and conditions')
      .oneOf([true], 'You must agree to the terms and conditions')
  });

  const formik = useFormik({
    initialValues: {
      username: formData.username || '',
      password: formData.password || '',
      confirmPassword: formData.confirmPassword || '',
      agreeToTerms: formData.agreeToTerms || false
    },
    validationSchema,
    onSubmit: (values) => {
      updateFormData(values);
      nextStep();
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
              <label htmlFor='confirmPassword' className='text-sm font-medium text-gray-700 mb-1'>
                Confirm Password {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <span className='text-red-500 text-xs'> - {formik.errors.confirmPassword}</span>
                )}
              </label>
              <input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
          </div>

          {/* Password requirement text */}
          <p className='text-xs text-gray-500'>Password must be at least 8 characters</p>

          {/* Agree to Terms Checkbox */}
          <div className='flex items-center mt-2'>
            <input
              type='checkbox'
              id='agreeToTerms'
              name='agreeToTerms'
              checked={formik.values.agreeToTerms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='h-5 w-5 rounded border-gray-300 text-pryClr focus:ring-pryClr'
            />
            <label htmlFor='agreeToTerms' className='ml-2 text-sm text-gray-700'>
              I agree to the terms and conditions
              {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                <span className='text-red-500 text-xs'> - {formik.errors.agreeToTerms}</span>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className='flex justify-between mt-4'>
        <button
          type='button'
          onClick={prevStep}
          className='text-xl bg-gray-300 hover:bg-gray-400 rounded-xl text-gray-700 px-6 py-3 transition-colors'
        >
          Back
        </button>
        <button
          type='submit'
          disabled={!formik.isValid || formik.isSubmitting}
          className={`text-xl rounded-xl text-white px-6 py-3 transition-colors ${
            !formik.isValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-pryClr hover:bg-pryClrDark'
          }`}
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default StepThree;