import React, { useState, useEffect } from 'react';
import { FaArrowUpLong } from 'react-icons/fa6';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import assets from '../../assets/assests'; // Ensure this path is correct in your project
import { useUser } from '../../context/UserContext';


// Profile Component
const Profile = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [banks, setBanks] = useState([]);
  
  const { user } = useUser()
    
  const splittedFirstNameFirstLetter = user?.first_name.split("")[0]
  const splittedLastNameFirstLetter = user?.last_name.split("")[0]

  // Fetch countries on component mount
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

  // Mock bank data
  useEffect(() => {
    const mockBanks = [
      { id: 1, name: 'Bank of America' },
      { id: 2, name: 'Chase Bank' },
      { id: 3, name: 'Wells Fargo' },
      { id: 4, name: 'Citibank' },
    ];
    setBanks(mockBanks);
  }, []);

  const statItems = [
    { id: 1, icon: assets.pic1, title: 'Personal PV', value: '500' },
    { id: 2, icon: assets.pic2, title: 'Group PV', value: '700' },
    { id: 3, icon: assets.pic3, title: 'Left Camry', value: '800' },
    { id: 4, icon: assets.pic4, title: 'Right Camry', value: '200' },
  ];

  return (
    <div className='w-full flex flex-col gap-6'>
      <div className='w-full rounded-lg px-4 py-8 bg-pryClr/40 shadow-lg flex flex-col gap-6 md:flex-row'>
        <div className='flex-[4] flex flex-col gap-6 items-center'>
          <div className='w-52 h-52 rounded-full bg-[#D9D9D9] flex items-center justify-center'>
            <h3 className='font-bold uppercase text-8xl'>{`${splittedFirstNameFirstLetter}${splittedLastNameFirstLetter}`}</h3>
          </div>
          <div className='flex flex-col items-center'>
            <p className='text-xl textppryClr font-semibold md:text-2xl'>{user?.first_name}{user?.last_name}</p>
            <p className='text-xl font-semibold md:text-xl'>@{user?.username}</p>
          </div>
        </div>
        <div className='flex-[6] border-black md:border-l-3 flex flex-col gap-4 md:px-6'>
          <div className='w-full border-b-3 border-white'>
            <p className='md:text-2xl mb-2'><span className='font-semibold'>Email: </span>{user?.email}</p>
          </div>
          <div className='w-full border-b-3 border-white'>
            <p className='md:text-2xl mb-2'><span className='font-semibold'>First Name: </span>{user?.first_name}</p>
          </div>
          <div className='w-full border-b-3 border-white'>
            <p className='md:text-2xl mb-2'><span className='font-semibold'>Last Name: </span>{user?.last_name}</p>
          </div>
          <div className='w-full border-b-3 border-white'>
            <p className='md:text-2xl mb-2'><span className='font-semibold'>Username: </span>{user?.username}</p>
          </div>
          <div className='w-full border-b-3 border-white flex justify-between items-center'>
            <p className='md:text-2xl mb-2'><span className='font-semibold'>Package: </span>{user?.plan}</p>
            <div className='flex gap-1 text-[#0F16D7] font-semibold items-center mb-2 md:text-2xl'>
              <p>Upgrade</p>
              <FaArrowUpLong />
            </div>
          </div>
          <div className='w-full border-b-3 border-white'>
            <p className='md:text-2xl mb-2'><span className='font-semibold'>Current Rank: </span>No Rank Achieved</p>
          </div>
        </div>
      </div>

      <div className='w-full rounded-lg py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {statItems.map((item) => (
          <div
            key={item.id}
            className='w-full gap-1 flex flex-col items-center font-bold bg-pryClr/40 rounded-lg shadow-lg p-6 justify-center text-center'
          >
            <img src={item.icon} className='w-24 mb-4' alt={item.title} />
            <p className='text-xl text-white md:text-xl'>{item.title}</p>
            <p className='text-5xl md:text-5xl'>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Password Reset Component
const PasswordReset = () => {
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required('Current password is required')
      .min(8, 'Password must be at least 8 characters'),
    newPassword: Yup.string()
      .required('New password is required')
      .min(8, 'Password must be at least 8 characters')
      .notOneOf([Yup.ref('currentPassword')], 'New password must be different from current'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log('Submitting:', values);
    setTimeout(() => {
      alert('Password changed successfully!');
      resetForm();
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col justify-center p-4 md:p-8">
      <div className="w-full flex flex-col gap-4 md:gap-2">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold text-black">
          Reset Your Password
        </h2>
        <p className="text-center text-sm text-black">
          Please enter your current password and set a new one
        </p>
      </div>
      <div className="w-full">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={{
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-black">
                    Current Password
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <ErrorMessage name="currentPassword" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-black">
                    New Password
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      autoComplete="new-password"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <ErrorMessage name="newPassword" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  <p className="mt-1 text-xs text-black">
                    Must be at least 8 characters and different from current password
                  </p>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
                    Confirm New Password
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
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
                      'Reset Password'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

// Pin Reset Component
const PinReset = () => {
  const validationSchema = Yup.object().shape({
    currentPin: Yup.string()
      .required('Current PIN is required')
      .matches(/^\d{4}$/, 'PIN must be exactly 4 digits'),
    newPin: Yup.string()
      .required('New PIN is required')
      .matches(/^\d{4}$/, 'PIN must be exactly 4 digits')
      .notOneOf([Yup.ref('currentPin')], 'New PIN must be different from current'),
    confirmPin: Yup.string()
      .required('Please confirm your PIN')
      .oneOf([Yup.ref('newPin')], 'PINs must match'),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log('Submitting:', values);
    setTimeout(() => {
      alert('PIN changed successfully!');
      resetForm();
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col justify-center p-4 md:p-8">
      <div className="w-full flex flex-col gap-4 md:gap-2">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold text-black">
          Reset Your PIN
        </h2>
        <p className="text-center text-sm text-black">
          Please enter your current PIN and set a new one
        </p>
      </div>
      <div className="w-full">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={{
              currentPin: '',
              newPin: '',
              confirmPin: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="currentPin" className="block text-sm font-medium text-black">
                    Current PIN
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      id="currentPin"
                      name="currentPin"
                      type="password"
                      inputMode="numeric"
                      maxLength="4"
                      autoComplete="off"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <ErrorMessage name="currentPin" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>
                <div>
                  <label htmlFor="newPin" className="block text-sm font-medium text-black">
                    New PIN
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      id="newPin"
                      name="newPin"
                      type="password"
                      inputMode="numeric"
                      maxLength="4"
                      autoComplete="off"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <ErrorMessage name="newPin" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  <p className="mt-1 text-xs text-black">
                    Must be exactly 4 digits and different from current PIN
                  </p>
                </div>
                <div>
                  <label htmlFor="confirmPin" className="block text-sm font-medium text-black">
                    Confirm New PIN
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      id="confirmPin"
                      name="confirmPin"
                      type="password"
                      inputMode="numeric"
                      maxLength="4"
                      autoComplete="off"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <ErrorMessage name="confirmPin" component="div" className="mt-1 text-sm text-red-600" />
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
                      'Reset PIN'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

// Personal Details Component
const PersonalDetails = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [banks, setBanks] = useState([]);

  // Fetch countries on component mount
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

  // Fetch states when country changes
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

  // Fetch cities when state changes
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

  // Mock bank data
  useEffect(() => {
    const mockBanks = [
      { id: 1, name: 'Bank of America' },
      { id: 2, name: 'Chase Bank' },
      { id: 3, name: 'Wells Fargo' },
      { id: 4, name: 'Citibank' },
    ];
    setBanks(mockBanks);
  }, []);

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

// Main Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'password':
        return <PasswordReset />;
      case 'pin':
        return <PinReset />;
      case 'personal':
        return <PersonalDetails />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full">
        <div className="bg-white shadow-md rounded-lg">
          <div className="flex overflow-x-auto border-b border-gray-200 snap-x snap-mandatory">
            <button
              className={`flex-1 py-6 px-4 text-center font-medium text-base sm:text-lg snap-center ${activeTab === 'profile' ? 'border-b-2 border-pryClr text-pryClr font-bold' : 'text-pryClr hover:text-pryClr/70'
                }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`flex-1 py-6 px-4 text-center font-medium text-base sm:text-lg snap-center ${activeTab === 'password' ? 'border-b-2 border-pryClr text-pryClr font-bold' : 'text-pryClr hover:text-pryClr/70'
                }`}
              onClick={() => setActiveTab('password')}
            >
              Password Reset
            </button>
            <button
              className={`flex-1 py-6 px-4 text-center font-medium text-base sm:text-lg snap-center ${activeTab === 'pin' ? 'border-b-2 border-pryClr text-pryClr font-bold' : 'text-pryClr hover:text-pryClr/70'
                }`}
              onClick={() => setActiveTab('pin')}
            >
              Pin Reset
            </button>
            <button
              className={`flex-1 py-6 px-4 text-center font-medium text-base sm:text-lg snap-center ${activeTab === 'personal' ? 'border-b-2 border-pryClr text-pryClr font-bold' : 'text-pryClr hover:text-pryClr/70'
                }`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Details
            </button>
          </div>
          <div className="p-4">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;