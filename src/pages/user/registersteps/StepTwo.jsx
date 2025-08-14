import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getCountryCallingCode, isValidPhoneNumber } from 'libphonenumber-js';
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const StepTwo = ({ prevStep, nextStep, formData, updateFormData, sessionId }) => {

  useEffect(() => {
    console.log('StepTwo sessionId:', sessionId);
  }, [sessionId]);

  const { token, logout } = useUser()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState({
    countries: false,
    states: false,
    cities: false
  });
  const [error, setError] = useState(null);
  const [countryCodeMap, setCountryCodeMap] = useState({});
  const [stockists, setStockists] = useState([]);
  const [isFetchingStockists, setIsFetchingStockists] = useState(false);

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    date_of_birth: Yup.string()
      .required('Date of birth is required'),
      // .matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Must be in MM/DD/YYYY format'),
    gender: Yup.string().required('Gender is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    email: Yup.string()
      .email('Must be a valid email address')
      .required('Email is required'),
    mobile: Yup.string()
      .required('Mobile number is required')
      .test('valid-phone', 'Must be a valid phone number for the selected country', function (value) {
        const { country } = this.parent;
        if (!country || !value) return false;
        const isoCode = countryCodeMap[country];
        if (!isoCode) return false;
        return isValidPhoneNumber(value, isoCode);
      }),
    stockist: Yup.string().required('Stockist is required'),
  });

  const formik = useFormik({
    initialValues: {
      first_name: formData.first_name || '',
      last_name: formData.last_name || '',
      date_of_birth: formData.date_of_birth || '',
      gender: formData.gender || '',
      country: formData.country || '',
      state: formData.state || '',
      city: formData.city || '',
      stockist: formData.stockist || '',
      mobile: formData.mobile || '',
      email: formData.email || ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log("values to be posted", values)

      if (!sessionId) {
        toast.error('Session ID is missing. Please start over.');
        return;
      }
      setSubmitting(true);
      updateFormData(values);

      console.log('StepTwo received sessionId:', sessionId);
      console.log('StepTwo API payload:', values, { 'X-Session-ID': sessionId });
      try {
        const response = await axios.post(`${API_URL}/api/registration/step-2`, values, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": `application/json`,
            'Content-Type': 'application/json',
            "X-Session-ID": sessionId,
          }
        });

        console.log("step 2 response", response)

        if (response.status === 200 && response.data.success) {
          toast.success(response.data.message || "Step 2 data recorded successfully.");
          nextStep();
        } else {
          throw new Error(response.data.message || "Step 2 API call failed.");
        }
      } catch (error) {
        if (error.response?.data?.message?.includes("unauthenticated")) {
          logout();
        }
        console.error("Step Two submission error:", error);
        toast.error(error.response?.data?.message || "An error occurred submitting step 2 data.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Fetch countries and ISO codes on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(prev => ({ ...prev, countries: true }));
      setError(null);
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries');
        const result = await response.json();
        if (result.error) throw new Error(result.msg);

        // Map country names to ISO codes and sort countries alphabetically
        const countryMap = {};
        const countryList = result.data
          .map(c => ({ name: c.country, isoCode: c.iso2 }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        countryList.forEach(c => {
          countryMap[c.name] = c.isoCode;
        });

        setCountries(countryList.map(c => c.name));
        setCountryCodeMap(countryMap);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to load countries. Please try again later.');
      } finally {
        setLoading(prev => ({ ...prev, countries: false }));
      }
    };
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (formik.values.country) {
      const fetchStates = async () => {
        setLoading(prev => ({ ...prev, states: true }));
        setError(null);
        try {
          const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: formik.values.country })
          });
          const result = await response.json();
          if (result.error) throw new Error(result.msg);
          
          const stateList = result.data?.states?.map(s => s.name) || [];
          setStates(stateList);
          setCities([]);
          formik.setFieldValue('state', '');
          formik.setFieldValue('city', '');
        } catch (err) {
          console.error('Error fetching states:', err);
          setError('Failed to load states for selected country.');
          setStates([]);
          setCities([]);
          formik.setFieldValue('state', '');
          formik.setFieldValue('city', '');
        } finally {
          setLoading(prev => ({ ...prev, states: false }));
        }
      };
      fetchStates();
    } else {
      setStates([]);
      setCities([]);
      formik.setFieldValue('state', '');
      formik.setFieldValue('city', '');
    }
  }, [formik.values.country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (formik.values.country && formik.values.state) {
      const fetchCities = async () => {
        setLoading(prev => ({ ...prev, cities: true }));
        setError(null);
        try {
          const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              country: formik.values.country,
              state: formik.values.state
            })
          });
          const result = await response.json();
          if (result.error) throw new Error(result.msg);
          
          setCities(result.data || []);
          formik.setFieldValue('city', '');
        } catch (err) {
          console.error('Error fetching cities:', err);
          setError('Failed to load cities for selected state.');
          setCities([]);
          formik.setFieldValue('city', '');
        } finally {
          setLoading(prev => ({ ...prev, cities: false }));
        }
      };
      fetchCities();
    } else {
      setCities([]);
      formik.setFieldValue('city', '');
    }
  }, [formik.values.state, formik.values.country]);

  useEffect(() => {
    const fetchStockist = async () => {
      setIsFetchingStockists(true)
      try {
        const response = await axios.get(`${API_URL}/api/stockists`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        console.log(response)
        if (response.status === 200 && response.data.success) {
          console.log(response.data.data.data)
          setStockists(response.data.data.data)
        }
        
      } catch (error) {
        if (error.response.data.message.toLowerCase() == "unauthenticated") {
          logout()
        }
        console.error("An error occured fetching stockists", error)
        toast.error("An error occured fetching stockists")
      } finally {
        setIsFetchingStockists(false)
      }
    }

    fetchStockist()
  }, [])

  // const formatDate = (value) => {
  //   console.log("value", value)
  //   const numbers = value.replace(/\D/g, '');
  //   let formattedValue = '';
  //   if (numbers.length > 0) formattedValue = numbers.slice(0, 2);
  //   if (numbers.length > 2) formattedValue += '/' + numbers.slice(2, 4);
  //   if (numbers.length > 4) formattedValue += '/' + numbers.slice(4, 8);
  //   return formattedValue;
  // };

  // const handleDateChange = (e) => {
  //   const formattedValue = formatDate(e.target.value);
  //   formik.setFieldValue('date_of_birth', formattedValue);
  // };

  // Get dynamic placeholder for mobile input
  const getMobilePlaceholder = () => {
    const country = formik.values.country;
    if (!country || !countryCodeMap[country]) return 'Enter phone number';
    const countryCode = getCountryCallingCode(countryCodeMap[country]);
    return `${countryCode}XXXXXXXXXX`;
  };

  return (
    <form onSubmit={formik.handleSubmit} className='w-full flex flex-col gap-4 mt-6'>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      
      <div className='w-full flex flex-col gap-4 md:gap-6 rounded-2xl bg-white shadow-xl px-4 md:px-6 py-6'>
        <div>
          <p className='text-xl md:text-2xl font-bold text-gray-800'>Contact Information</p>
        </div>

        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* First Name */}
          <div className='flex flex-col'>
            <label htmlFor='first_name' className='text-sm font-medium text-gray-700 mb-1'>
              First Name {formik.touched.first_name && formik.errors.first_name && (
                <span className='text-red-500 text-xs'> - {formik.errors.first_name}</span>
              )}
            </label>
            <input
              type='text'
              id='first_name'
              name='first_name'
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-12 px-4 py-2 border ${formik.touched.first_name && formik.errors.first_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr`}
            />
          </div>

          {/* Last Name */}
          <div className='flex flex-col'>
            <label htmlFor='last_name' className='text-sm font-medium text-gray-700 mb-1'>
              Last Name {formik.touched.last_name && formik.errors.last_name && (
                <span className='text-red-500 text-xs'> - {formik.errors.last_name}</span>
              )}
            </label>
            <input
              type='text'
              id='last_name'
              name='last_name'
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-12 px-4 py-2 border ${formik.touched.last_name && formik.errors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr`}
            />
          </div>

          {/* Date of Birth */}
          <div className='flex flex-col'>
            <label htmlFor='date_of_birth' className='text-sm font-medium text-gray-700 mb-1'>
              Date of Birth (MM/DD/YYYY) {formik.touched.date_of_birth && formik.errors.date_of_birth && (
                <span className='text-red-500 text-xs'> - {formik.errors.date_of_birth}</span>
              )}
            </label>
            <input
              type='date'
              id='date_of_birth'
              name='date_of_birth'
              value={formik.values.date_of_birth}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder='MM/DD/YYYY'
              maxLength={10}
              className={`h-12 px-4 py-2 border ${formik.touched.date_of_birth && formik.errors.date_of_birth ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr`}
            />
          </div>

          {/* Gender */}
          <div className='flex flex-col'>
            <label htmlFor='gender' className='text-sm font-medium text-gray-700 mb-1'>
              Gender {formik.touched.gender && formik.errors.gender && (
                <span className='text-red-500 text-xs'> - {formik.errors.gender}</span>
              )}
            </label>
            <select
              id='gender'
              name='gender'
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-12 px-4 py-2 border ${formik.touched.gender && formik.errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr`}
            >
              <option value=''>Select Gender</option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
            </select>
          </div>

          {/* Country */}
          <div className='flex flex-col'>
            <label htmlFor='country' className='text-sm font-medium text-gray-700 mb-1'>
              Country {formik.touched.country && formik.errors.country && (
                <span className='text-red-500 text-xs'> - {formik.errors.country}</span>
              )}
            </label>
            <select
              id='country'
              name='country'
              value={formik.values.country}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setFieldValue('state', '');
                formik.setFieldValue('city', '');
                formik.setFieldValue('mobile', '');
              }}
              onBlur={formik.handleBlur}
              disabled={loading.countries}
              className={`h-12 px-4 py-2 border disabled:opacity-50 disabled:cursor-not-allowed ${formik.touched.country && formik.errors.country ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr`}
            >
              <option value=''>{loading.countries ? 'Loading countries...' : 'Select Country'}</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div className='flex flex-col'>
            <label htmlFor='state' className='text-sm font-medium text-gray-700 mb-1'>
              State {formik.touched.state && formik.errors.state && (
                <span className='text-red-500 text-xs'> - {formik.errors.state}</span>
              )}
            </label>
            <select
              id='state'
              name='state'
              value={formik.values.state}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setFieldValue('city', '');
              }}
              onBlur={formik.handleBlur}
              disabled={!formik.values.country || loading.states}
              className={`h-12 px-4 py-2 border disabled:opacity-50 disabled:cursor-not-allowed ${formik.touched.state && formik.errors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr`}
            >
              <option value=''>
                {loading.states
                  ? 'Loading states...'
                  : !formik.values.country
                  ? 'Select country first'
                  : states.length === 0
                  ? 'No states available'
                  : 'Select State'}
              </option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className='flex flex-col'>
            <label htmlFor='city' className='text-sm font-medium text-gray-700 mb-1'>
              City {formik.touched.city && formik.errors.city && (
                <span className='text-red-500 text-xs'> - {formik.errors.city}</span>
              )}
            </label>
            <select
              id='city'
              name='city'
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.state || loading.cities}
              className={`h-12 px-4 py-2 border disabled:opacity-50 disabled:cursor-not-allowed ${formik.touched.city && formik.errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr`}
            >
              <option value=''>
                {loading.cities
                  ? 'Loading cities...'
                  : !formik.values.state
                  ? 'Select state first'
                  : cities.length === 0
                  ? 'No cities available'
                  : 'Select City'}
              </option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile */}
          <div className='flex flex-col'>
            <label htmlFor='mobile' className='text-sm font-medium text-gray-700 mb-1'>
              Mobile {formik.touched.mobile && formik.errors.mobile && (
                <span className='text-red-500 text-xs'> - {formik.errors.mobile}</span>
              )}
            </label>
            <input
              type='text'
              id='mobile'
              name='mobile'
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={getMobilePlaceholder()}
              className={`h-12 px-4 py-2 border ${formik.touched.mobile && formik.errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr`}
            />
          </div>

          {/* Email */}
          <div className='flex flex-col'>
            <label htmlFor='email' className='text-sm font-medium text-gray-700 mb-1'>
              Email {formik.touched.email && formik.errors.email && (
                <span className='text-red-500 text-xs'> - {formik.errors.email}</span>
              )}
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder='Enter your email'
              className={`h-12 px-4 py-2 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr`}
            />
          </div>

          {/* Stockist */}
          <div className='flex flex-col'>
            <label htmlFor='stockist' className='text-sm font-medium text-gray-700 mb-1'>
              Stockist {formik.touched.stockist && formik.errors.stockist && (
                <span className='text-red-500 text-xs'> - {formik.errors.stockist}</span>
              )}
            </label>
            <select
              id='stockist'
              name='stockist'
              value={formik.values.stockist || ""}
              disabled={isFetchingStockists}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-12 px-4 py-2 border ${formik.touched.stockist && formik.errors.stockist ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-pryClr focus:border-pryClr disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <option value='' disabled>Select Stockist</option>
              {
                stockists.map((item) => (
                  <option value={item.id}>{item.name} at {item.location}</option>
                ))
              }
            </select>
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
            {formik.isSubmitting ? "Saving..." : "Next 2"}
          </button>
        </div>
      </div>

    </form>
  );
};

export default StepTwo;