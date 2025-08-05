import React from 'react'
import assets from '../../assets/assests';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { IoIosCheckmark } from 'react-icons/io';

const ElectricityPurchase = ({ onProceed }) => {

    const earningsWalletBalance = 200

    const formik = useFormik({
        initialValues: {
            user_id: 5,
            transaction_type: "electricity",
            serviceID: "",
            amount: "",
            phone: "",
            variation_code: "",
            billersCode: "",
        },
        validationSchema: Yup.object({
            serviceID: Yup.string()
                .required("Service Provider is required"),
            phone: Yup.string()
                .required("Phone Number is required"),
            amount: Yup.number()
                .min(0, "Amount to purchase must be greater than 0")
                .max(earningsWalletBalance, "Insufficient balance!")
                .required("Amount is required"),
            variation_code: Yup.string()
                .required("Variation Code is required"),
            billersCode: Yup.string()
                .required("Billers Code is required"),
        }),
        onSubmit: (values) => {
            onProceed(values);
        }
    });
  
    const handleServiceProviderChange = (serviceID) => {
        formik.setFieldValue("serviceID", serviceID, true);
        formik.setFieldTouched("serviceID", true);
    };

    return (
        <form onSubmit={formik.handleSubmit} className='grid md:grid-cols-1 grid-cols-1 gap-4'>
            <h3 className='font-semibold text-xl'>Select Network</h3>
            <div className="flex flex-row justify-center md:gap-8 gap-4 my-3">
                <button
                    type='button'
                    onClick={() => handleServiceProviderChange("ikejaelectricity")}
                    className='w-[100px] cursor-pointer shadow-md relative outline-0'
                >
                    <div className={`bg-secClr w-full h-full overflow-hidden rounded-md group ${formik.values.serviceID === "ikejaelectricity" && "border-2 border-pryClr"}`}>
                        <img src={assets.ikejaelectricitylogo} alt="ikejaelectricity Logo" className='w-full h-full object-cover group-hover:scale-110 transition-all duration-300' />
                    </div>
                    {formik.values.serviceID === "ikejaelectricity" && <IoIosCheckmark className='absolute -top-5 -right-5 text-5xl' />}
                </button>
            </div>
            {formik.errors.serviceID && (<p>{formik.errors.serviceID}</p>)}
            <div className="my-3 gap-6 grid md:grid-cols-2 grid-cols-1">
                <div className="space-y-1">
                    <input 
                        type="number" 
                        name='amount'
                        id='amount'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='Amount in NGN'
                        className='bg-white h-[50px] indent-3 w-full rounded-md border-0 outline-0'
                    />
                    {formik.errors.amount && (<p className='text-red-800'>{formik.errors.amount}</p>)}
                </div>
                <div className="space-y-1">
                    <input 
                        type="tel" 
                        name='phone'
                        id='phone'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='Phone Number'
                        className='bg-white h-[50px] indent-3 w-full rounded-md border-0 outline-0'
                    />
                    {formik.errors.phone && (<p className='text-red-800'>{formik.errors.phone}</p>)}
                </div>
                <div className="space-y-1">
                    <select 
                        name='variation_code'
                        id='variation_code'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='Variation Code'
                        className='bg-white h-[50px] indent-3 w-full rounded-md border-0 outline-0'
                    >
                        <option selected disabled>Select Variation Code</option>
                    </select>
                    {formik.errors.variation_code && (<p className='text-red-800'>{formik.errors.variation_code}</p>)}
                </div>
                <div className="space-y-1">
                    <input 
                        type="text" 
                        name='billersCode'
                        id='billersCode'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='Enter Billers Code'
                        className='bg-white h-[50px] indent-3 w-full rounded-md border-0 outline-0'
                    />
                    {formik.errors.billersCode && (<p className='text-red-800'>{formik.errors.billersCode}</p>)}
                </div>
            </div>
            <div className="text-center">
                <button
                    type='submit'
                    disabled={!formik.isValid || formik.isSubmitting}
                    className='bg-pryClr text-secClr font-medium lg:w-1/2 w-full h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                >Proceed</button>
            </div>
        </form>
    )
}

export default ElectricityPurchase