import React, { useState, useEffect } from 'react';
import { FaArrowUpLong } from 'react-icons/fa6';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const API_URL = import.meta.env.VITE_API_BASE_URL

const PersonalDetailsEditTab = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries')
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error fetching countries:', data.msg);
          return;
        }
        console.log('Countries fetched:', data.data);
        setCountries(data.data || []);
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  const handleCountryChange = (event, setFieldValue) => {
    const country = event.target.value;
    console.log('Selected country:', country);
    setFieldValue('country', country);
    setFieldValue('state', '');
    setFieldValue('city', '');
    setStates([]);
    setCities([]);
    if (country) {
      fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            console.error('Error fetching states:', data.msg);
            setStates([]);
            return;
          }
          console.log('States fetched for', country, ':', data.data?.states);
          setStates(data.data?.states || []);
        })
        .catch(error => {
          console.error('Error fetching states:', error);
          setStates([]);
        });
    }
  };

  const handleStateChange = (event, country, setFieldValue) => {
    const state = event.target.value;
    console.log('Selected state:', state);
    setFieldValue('state', state);
    setFieldValue('city', '');
    setCities([]);
    if (country && state) {
      fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, state }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            console.error('Error fetching cities:', data.msg);
            setCities([]);
            return;
          }
          console.log('Cities fetched for', state, ':', data.data);
          setCities(data.data || []);
        })
        .catch(error => {
          console.error('Error fetching cities:', error);
          setCities([]);
        });
    }
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    gender: Yup.string().required('Gender is required'),
    dob: Yup.date()
      .required('Date of Birth is required')
      .max(new Date(), 'Date of Birth cannot be in the future'),
    addressLine1: Yup.string().required('Address Line 1 is required'),
    addressLine2: Yup.string(),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    mobileNumber: Yup.string()
      .required('Mobile Number is required')
      .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid mobile number'),
    bankName: Yup.string().required('Bank Name is required'),
    accountHolder: Yup.string().required('Account Holder is required'),
    accountNumber: Yup.string()
      .required('Account Number is required')
      .matches(/^\d{8,20}$/, 'Account Number must be 8-20 digits'),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log('Submitting:', values);
    setTimeout(() => {
      alert('Details updated successfully!');
      resetForm();
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="p-6 bg-white rounded-b-lg">
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          gender: '',
          dob: '',
          addressLine1: '',
          addressLine2: '',
          country: '',
          state: '',
          city: '',
          mobileNumber: '',
          bankName: '',
          accountHolder: '',
          accountNumber: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, dirty, setFieldValue, values }) => (
          <Form className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <Field
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <Field
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <Field
                    as="select"
                    id="gender"
                    name="gender"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage name="gender" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <Field
                    id="dob"
                    name="dob"
                    type="date"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="dob" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Contact Details</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
                    Address Line 1
                  </label>
                  <Field
                    id="addressLine1"
                    name="addressLine1"
                    type="text"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="addressLine1" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
                    Address Line 2
                  </label>
                  <Field
                    id="addressLine2"
                    name="addressLine2"
                    type="text"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="addressLine2" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <Field
                      as="select"
                      id="country"
                      name="country"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => handleCountryChange(e, setFieldValue)}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.iso2} value={country.country}>
                          {country.country}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="country" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <Field
                      as="select"
                      id="state"
                      name="state"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => handleStateChange(e, values.country, setFieldValue)}
                      disabled={!values.country}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.state_code} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="state" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <Field
                      as="select"
                      id="city"
                      name="city"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      disabled={!values.state}
                    >
                      <option value="">Select City</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="city" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>
                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <Field
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="mobileNumber" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                    Bank Name
                  </label>
                  <Field
                    as="select"
                    id="bankName"
                    name="bankName"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Bank</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.name}>
                        {bank.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="bankName" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                    Account Number
                  </label>
                  <Field
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    inputMode="numeric"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="accountNumber" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label htmlFor="accountHolder" className="block text-sm font-medium text-gray-700">
                    Account Holder
                  </label>
                  <Field
                    id="accountHolder"
                    name="accountHolder"
                    type="text"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="accountHolder" component="div" className="mt-1 text-sm text-red-600" />
                </div>

              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!isValid || !dirty || isSubmitting}
                className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg md:text-xl font-medium text-white bg-pryClr hover:bg-pryClr/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pryClr ${!isValid || !dirty ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Update Details'
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};


export default PersonalDetailsEditTab;