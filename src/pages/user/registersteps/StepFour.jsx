import React, { useEffect } from 'react'

const StepFour = ({ prevStep, nextStep, formData }) => {

      useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <div className='w-full flex flex-col gap-4 mt-6'>
      <div className='w-full flex flex-col gap-4 md:gap-6 rounded-2xl bg-white shadow-xl px-4 md:px-6 py-6'>
        <div>
          <p className='text-xl md:text-2xl font-bold text-gray-800'>Sponsor And Product</p>
        </div>
        <div className='w-full rounded-xl bg-pryClr/20 shadow-xl px-4 md:px-6 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Product</p>
            <p className='text-lg md:text-xl font-bold'>{formData.selectedPackage?.name || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Sponsor</p>
            <p className='text-lg md:text-xl font-bold'>{formData.sponsor || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>BV</p>
            <p className='text-lg md:text-xl font-bold'>{formData.selectedPackage?.pointValue?.replace('PV', '') || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Price</p>
            <p className='text-lg md:text-xl font-bold'>N{formData.selectedPackage?.price || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Total Amount</p>
            <p className='text-lg md:text-xl font-bold'>N{formData.selectedPackage?.price || 'N/A'}</p>
          </div>
        </div>

        <div>
          <p className='text-xl md:text-2xl font-bold text-gray-800'>Contact Information</p>
        </div>
        <div className='w-full rounded-xl bg-pryClr/5 border border-black shadow-xl px-4 md:px-6 py-6 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>First Name</p>
            <p className='text-lg md:text-xl font-bold'>{formData.firstName || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Last Name</p>
            <p className='text-lg md:text-xl font-bold'>{formData.lastName || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Gender</p>
            <p className='text-lg md:text-xl font-bold'>{formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Country</p>
            <p className='text-lg md:text-xl font-bold'>{formData.country || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>State</p>
            <p className='text-lg md:text-xl font-bold'>{formData.state || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>City</p>
            <p className='text-lg md:text-xl font-bold'>{formData.city || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Mobile</p>
            <p className='text-lg md:text-xl font-bold'>{formData.mobile || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Email</p>
            <p className="text-lg md:text-xl font-bold break-all">{formData.email || 'N/A'}</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-sm md:text-lg text-black/70'>Date of Birth</p>
            <p className='text-lg md:text-xl font-bold'>{formData.dob || 'N/A'}</p>
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
          type='button'
          onClick={nextStep}
          className='text-xl rounded-xl text-white px-6 py-3 transition-colors bg-pryClr hover:bg-pryClrDark'
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default StepFour