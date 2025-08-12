// src/pages/user/profile/ContactDetailsForm.jsx
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";
import { getCountryCallingCode, getExampleNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ContactDetailsForm = () => {
  const { token, logout, user, refreshUser } = useUser();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState({
    countries: false,
    states: false,
    cities: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading((prev) => ({ ...prev, countries: true }));
    fetch("https://countriesnow.space/api/v0.1/countries")
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.data || []);
      })
      .catch((error) => console.error("Error fetching countries:", error))
      .finally(() => {
        setLoading((prev) => ({ ...prev, countries: false }));
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      address1: user?.address1 || "",
      address2: user?.address2 || "",
      country: user?.country || "",
      state: user?.state || "",
      city: user?.city || "",
      mobile: user?.mobile || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      address1: Yup.string().required("Address Line 1 is required"),
      address2: Yup.string(),
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State is required"),
      city: Yup.string().required("City is required"),
      mobile: Yup.string()
        .required("Mobile Number is required")
        .matches(/^\+?[1-9]\d{1,14}$/, "Invalid mobile number"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const response = await axios.put(`${API_URL}/api/profile/updateContact`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          toast.success("Contact details updated successfully!");
          refreshUser();
        }
      } catch (error) {
        if (
          error.response?.status === 401 ||
          error.response?.data?.message?.toLowerCase() === "unauthenticated"
        ) {
          logout();
        }
        console.error("Error updating contact details:", error);
        toast.error(
          error.response?.data?.message || "Failed to update contact details."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCountryChange = async (event) => {
    const country = event.target.value;
    formik.setFieldValue("country", country);
    formik.setFieldValue("state", "");
    formik.setFieldValue("city", "");
    setStates([]);
    setCities([]);

    if (country) {
      setLoading((prev) => ({ ...prev, states: true }));
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country }),
          }
        );
        const data = await response.json();
        if (data.error) {
          setStates([]);
          return;
        }
        setStates(data.data?.states || []);
      } catch (error) {
        setStates([]);
      } finally {
        setLoading((prev) => ({ ...prev, states: false }));
      }
    }
  };

  const handleStateChange = async (event) => {
    const state = event.target.value;
    formik.setFieldValue("state", state);
    formik.setFieldValue("city", "");
    setCities([]);

    const country = formik.values.country;
    if (country && state) {
      setLoading((prev) => ({ ...prev, cities: true }));
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country, state }),
          }
        );
        const data = await response.json();
        if (data.error) {
          setCities([]);
          return;
        }
        setCities(data.data || []);
      } catch (error) {
        setCities([]);
      } finally {
        setLoading((prev) => ({ ...prev, cities: false }));
      }
    }
  };

  // 👇 The corrected getMobilePlaceholder function
  const getMobilePlaceholder = () => {
    const countryName = formik.values.country;
    if (!countryName) {
      return "Enter phone number";
    }
    // Find the ISO 2-letter code for the selected country
    const country = countries.find(c => c.country === countryName);
    const countryCode = country ? country.iso2 : null;
    
    if (!countryCode) {
        return "Enter phone number";
    }
    
    // Use the library to get an example number
    const example = getExampleNumber(countryCode, examples);
    if (example) {
        return example.formatNational();
    }

    // Fallback if no example is available
    return `+${getCountryCallingCode(countryCode)}...`;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Details</h3>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Form fields for contact details */}
        <div className="space-y-2">
          <label
            htmlFor="address1"
            className="block text-sm"
          >
            Address Line 1
          </label>
          <input
            id="address1"
            name="address1"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address1}
            className="p-3 w-full h-[50px] outline-0 border border-pryClr/20 rounded-md"
          />
          {formik.touched.address1 && formik.errors.address1 ? (
            <div className="mt-1 text-sm text-red-600">
              {formik.errors.address1}
            </div>
          ) : null}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="address2"
            className="block text-sm"
          >
            Address Line 2
          </label>
          <input
            id="address2"
            name="address2"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address2}
            className="p-3 w-full h-[50px] outline-0 border border-pryClr/20 rounded-md"
          />
          {formik.touched.address2 && formik.errors.address2 ? (
            <div className="mt-1 text-sm text-red-600">
              {formik.errors.address2}
            </div>
          ) : null}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="country"
              className="block text-sm"
            >
              Country
            </label>
            <select
              id="country"
              name="country"
              onChange={handleCountryChange}
              onBlur={formik.handleBlur}
              value={formik.values.country}
              disabled={loading.countries}
              className="p-3 w-full h-[50px] outline-0 border border-pryClr/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value=''>{loading.countries ? 'Loading countries...' : 'Select Country'}</option>
              {countries.map((country) => (
                <option key={country.iso2} value={country.country}>
                  {country.country}
                </option>
              ))}
            </select>
            {formik.touched.country && formik.errors.country ? (
              <div className="mt-1 text-sm text-red-600">
                {formik.errors.country}
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="state"
              className="block text-sm"
            >
              State
            </label>
            <select
              id="state"
              name="state"
              onChange={handleStateChange}
              onBlur={formik.handleBlur}
              value={formik.values.state}
              disabled={!formik.values.country || loading.states}
              className="p-3 w-full h-[50px] outline-0 border border-pryClr/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
                <option key={state.state_code || state.name} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            {formik.touched.state && formik.errors.state ? (
              <div className="mt-1 text-sm text-red-600">
                {formik.errors.state}
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="city"
              className="block text-sm"
            >
              City
            </label>
            <select
              id="city"
              name="city"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.city}
              disabled={!formik.values.state || loading.cities}
              className="p-3 w-full h-[50px] outline-0 border border-pryClr/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {formik.touched.city && formik.errors.city ? (
              <div className="mt-1 text-sm text-red-600">
                {formik.errors.city}
              </div>
            ) : null}
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="mobile"
            className="block text-sm"
          >
            Mobile Number
          </label>
          <input
            id="mobile"
            name="mobile"
            type="tel"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.mobile}
            placeholder={getMobilePlaceholder()}
            className="p-3 w-full h-[50px] outline-0 border border-pryClr/20 rounded-md"
          />
          {formik.touched.mobile && formik.errors.mobile ? (
            <div className="mt-1 text-sm text-red-600">
              {formik.errors.mobile}
            </div>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
          className={`w-full flex justify-center py-3 px-4 mt-8 rounded-md text-lg font-medium text-white bg-pryClr hover:bg-pryClr/90 ${
            !formik.isValid || !formik.dirty || formik.isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {formik.isSubmitting ? "Processing..." : "Update Contact Details"}
        </button>
      </form>
    </div>
  );
};

export default ContactDetailsForm;
