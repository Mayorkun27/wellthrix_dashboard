import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';
import { fetchPaystackBanks, resolveAccountNumber } from '../../../utilities/paystackHelper';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const StepFour = ({ prevStep, nextStep, formData, updateFormData, sessionId }) => {
  // console.log("formData on dstep 4", formData)
  const [banks, setBanks] = useState([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);
  const [isResolving, setIsResolving] = useState(false);
  const [selectedBankCode, setSelectedBankCode] = useState('');

  const { token, logout } = useUser();

  useEffect(() => {
    window.scrollTo(0, 0);
    const getBanks = async () => {
      setIsLoadingBanks(true);
      try {
        const fetchedBanks = await fetchPaystackBanks();
        setBanks(fetchedBanks);
      } catch (error) {
        toast.error("Failed to load banks.");
      } finally {
        setIsLoadingBanks(false);
      }
    };
    getBanks();
  }, []);

  // const validationSchema = Yup.object().shape({
  //   username: Yup.string().required('Username is required'),
  //   password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  //   password_confirmation: Yup.string().required('Please confirm your password').oneOf([Yup.ref('password'), null], 'Passwords must match'),
  //   terms_accepted: Yup.boolean().required('You must agree to the terms and conditions').oneOf([true], 'You must agree to the terms and conditions'),
  //   bank_name: Yup.string().required('Bank Name is required'),
  //   account_number: Yup.string()
  //     .required('Account Number is required')
  //     .matches(/^\d{8,20}$/, "Account Number must be 8-20 digits"),
  //   account_name: Yup.string().required('Account Name is required'),
  //   usdt_wallet: Yup.string().required('USDT Wallet is required'),
  // });

  const validationSchema = Yup.object().shape({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
      password_confirmation: Yup.string().required('Please confirm your password').oneOf([Yup.ref('password'), null], 'Passwords must match'),
      terms_accepted: Yup.boolean().required('You must agree to the terms and conditions').oneOf([true], 'You must agree to the terms and conditions'),

      bank_name: Yup.string().when('$country', {
        is: (country) => country && country.toLowerCase() === 'nigeria',
        then: (schema) => schema.required('Bank Name is required for Nigerian accounts'),
        otherwise: (schema) => schema.notRequired(),
      }),

      account_number: Yup.string().when('$country', {
        is: (country) => country && country.toLowerCase() === 'nigeria',
        then: (schema) => schema
          .required('Account Number is required for Nigerian accounts')
          .matches(/^\d{8,20}$/, "Account Number must be 8-20 digits"),
        otherwise: (schema) => schema.notRequired(),
      }),

      account_name: Yup.string().when('$country', {
        is: (country) => country && country.toLowerCase() === 'nigeria',
        then: (schema) => schema.required('Account Name is required for Nigerian accounts'),
        otherwise: (schema) => schema.notRequired(),
      }),

      usdt_wallet: Yup.string().when('$country', {
        is: (country) => country && country.toLowerCase() !== 'nigeria',
        then: (schema) => schema.required('USDT Wallet is required for non-Nigerian residents'),
        otherwise: (schema) => schema.notRequired(),
      }),
    });

  const formik = useFormik({
    initialValues: {
      username: formData.username || '',
      password: formData.password || '',
      password_confirmation: formData.password_confirmation || '',
      terms_accepted: formData.terms_accepted || false,
      bank_name: formData.bank_name || '',
      account_number: formData.account_number || '',
      account_name: formData.account_name || '',
      usdt_wallet: formData.usdt_wallet || '',
    },
    validationSchema,
    validationContext: { country: formData.country },
    onSubmit: async (values, { setSubmitting }) => {
      if (!sessionId) {
        toast.error('Session ID is missing. Please start over.');
        return;
      }
      setSubmitting(true);
      updateFormData(values);
      try {
        const response = await axios.post(`${API_URL}/api/registration/step-4`, values, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": `application/json`,
            'Content-Type': 'application/json',
            "X-Session-ID": sessionId,
          }
        });
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
        console.error("Step Four submission error:", error);
        toast.error(error.response?.data?.message || "An error occurred submitting step 4 data.");
      } finally {
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    const resolveAccount = async () => {
      if (formik.values.account_number.length === 10 && selectedBankCode) {
        setIsResolving(true);
        try {
          const resolvedData = await resolveAccountNumber(formik.values.account_number, selectedBankCode);
          if (resolvedData && resolvedData.account_name) {
            formik.setFieldValue('account_name', resolvedData.account_name);
            toast.success("Account name resolved successfully!");
          } else {
            formik.setFieldValue('account_name', '');
            toast.error("Could not resolve account name. Please check details.");
          }
        } catch (error) {
          toast.error("An error occurred while resolving the account.");
        } finally {
          setIsResolving(false);
        }
      }
    };

    const handler = setTimeout(() => {
        resolveAccount();
    }, 500);

    return () => {
        clearTimeout(handler);
    };
}, [formik.values.account_number, selectedBankCode]);

  const handleBankChange = (event) => {
    const selectedName = event.target.value;
    const selectedBank = banks.find(bank => bank.name === selectedName);
    
    formik.setFieldValue('bank_name', selectedName);
    
    if (selectedBank) {
      setSelectedBankCode(selectedBank.code);
    } else {
      setSelectedBankCode('');
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className='w-full flex flex-col gap-4 mt-6'>
      <div className='w-full flex flex-col gap-4 md:gap-8 rounded-2xl bg-white shadow-xl px-4 md:px-6 py-6'>
        {/* Login Information Section */}
        <div className='space-y-6'>
          <div>
            <p className='text-xl md:text-2xl font-bold text-gray-800'>Login Information</p>
          </div>
          <div className='w-full flex flex-col gap-4'>
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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
            <p className='text-xs text-gray-500'>Password must be at least 8 characters</p>
          </div>
        </div>

        {/* Payment Information Section */}
        <div className='space-y-6'>
          <div>
            <p className='text-xl md:text-2xl font-bold text-gray-800'>Payment Information</p>
          </div>
          {
            formData.country.toLowerCase() === "nigeria" ? (
              <div className='w-full flex flex-col gap-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex flex-col'>
                    <label htmlFor='bank_name' className='text-sm font-medium text-gray-700 mb-1'>
                      Bank Name {formik.touched.bank_name && formik.errors.bank_name && (
                        <span className='text-red-500 text-xs'> - {formik.errors.bank_name}</span>
                      )}
                    </label>
                    <select
                      id="bank_name"
                      name="bank_name"
                      onChange={handleBankChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.bank_name}
                      disabled={isLoadingBanks}
                      className="p-3 h-[50px] w-full border border-pryClr/20 rounded-md outline-0 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">{isLoadingBanks ? "Loading Banks..." : "Select Bank"}</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.name}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='flex flex-col'>
                    <label htmlFor='account_number' className='text-sm font-medium text-gray-700 mb-1'>
                      Account Number {formik.touched.account_number && formik.errors.account_number && (
                        <span className='text-red-500 text-xs'> - {formik.errors.account_number}</span>
                      )}
                    </label>
                    <input
                      type='text'
                      inputMode='numeric'
                      id='account_number'
                      name='account_number'
                      value={formik.values.account_number}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`h-12 px-4 py-2 border ${formik.touched.account_number && formik.errors.account_number ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr`}
                    />
                  </div>
                </div>
                <div className='flex flex-col'>
                  <label htmlFor='account_name' className='text-sm font-medium text-gray-700 mb-1'>
                    Account Name {formik.touched.account_name && formik.errors.account_name && (
                      <span className='text-red-500 text-xs'> - {formik.errors.account_name}</span>
                    )}
                  </label>
                  <input
                    type='text'
                    id='account_name'
                    name='account_name'
                    value={isResolving ? 'Resolving...' : formik.values.account_name}
                    readOnly
                    className={`h-12 px-4 py-2 border cursor-not-allowed ${isResolving ? 'opacity-50' : ''} ${formik.touched.account_name && formik.errors.account_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr`}
                  />
                </div>
              </div>
            ) : (
              <div className='w-full flex flex-col gap-4'>
                <div className='flex flex-col'>
                  <label htmlFor='usdt_wallet' className='text-sm font-medium text-gray-700 mb-1'>
                    USDT Wallet {formik.touched.usdt_wallet && formik.errors.usdt_wallet && (
                      <span className='text-red-500 text-xs'> - {formik.errors.usdt_wallet}</span>
                    )}
                  </label>
                  <input
                    type='text'
                    id='usdt_wallet'
                    name='usdt_wallet'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.usdt_wallet}
                    className={`h-12 px-4 py-2 border ${formik.touched.usdt_wallet && formik.errors.usdt_wallet ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr`}
                  />
                </div>
                  
              </div>
            )
          }
        </div>

        {/* Terms and Conditions */}
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
            disabled={!formik.isValid || formik.isSubmitting || isResolving}
            className={`text-xl rounded-lg cursor-pointer text-white px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              !formik.isValid || isResolving ? 'bg-gray-400 cursor-not-allowed' : 'bg-pryClr hover:bg-pryClrDark'
            }`}
          >
            {isResolving ? 'Resolving Account...' : formik.isSubmitting ? "Saving..." : "Next"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default StepFour;
