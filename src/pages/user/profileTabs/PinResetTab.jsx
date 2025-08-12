import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useUser } from "../../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL

const PinResetTab = () => {
  const { logout, user, token } = useUser()

  const formik = useFormik({
    initialValues: {
        user_id: user?.id || "",
        old_pin: '',
        new_pin: '',
        confirm_new_pin: '',
    },
    validationSchema: Yup.object({
        old_pin: Yup.string()
            .required('Current pin is required')
            .min(4, 'Pin must be at least 4 characters'),
        new_pin: Yup.string()
            .required('New pin is required')
            .max(4, 'Pin must not be more than 4 characters')
            .notOneOf([Yup.ref('old_pin')], 'New pin must be different from current'),
        confirm_new_pin: Yup.string()
            .required('Please confirm your pin')
            .oneOf([Yup.ref('new_pin')], 'Pins must match'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log('values to be Submitted:', values);
      setSubmitting(true)

        try {
            const response = await axios.post(`${API_URL}/api/profile/change-pin`, values, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            console.log("pin reset response", response)

            if (response.status === 200 && response.data.success) {
                toast.success(response.data.message || `Pin updated successfully`);
            } else {
                throw new Error(response.data.message || "An error occurred updating pin.");
            }
            
        } catch (error) {
            if (error.response?.data?.message?.toLowerCase() === "unauthenticated") {
                logout();
            }
            console.error("An error occurred updating pin", error);
            toast.error(error.response?.data?.message || "An error occurred updating pin");
        } finally {
            setTimeout(() => {
                setSubmitting(false);
            }, 2000);
        }
    },
  });

  return (
    <div className="flex flex-col justify-center">
      <div className="sm:rounded-lg">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="old_pin" className="block text-sm font-medium text-black">
              Current Pin
            </label>
            <input
                id="old_pin"
                name="old_pin"
                type={"text"}
                autoComplete="current-pin"
                className="appearance-none block w-full px-3 py-3 border border-pryClr/30 rounded-md focus:outline-none pr-10"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.old_pin}
                maxLength={4}
            />
            {formik.touched.old_pin && formik.errors.old_pin ? (
            <div className="mt-1 text-sm text-red-600">
                {formik.errors.old_pin}
            </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="new_pin" className="block text-sm font-medium text-black">
              New Pin
            </label>
            <input
                id="new_pin"
                name="new_pin"
                type={"text"}
                autoComplete="new-pin"
                className="appearance-none block w-full px-3 py-3 border border-pryClr/30 rounded-md focus:outline-none pr-10"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.new_pin}
                maxLength={4}
            />
            {formik.touched.new_pin && formik.errors.new_pin ? (
            <div className="mt-1 text-sm text-red-600">
                {formik.errors.new_pin}
            </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm_new_pin" className="block text-sm font-medium text-black">
              Confirm New Pin
            </label>
            <input
                id="confirm_new_pin"
                name="confirm_new_pin"
                type={"text"}
                autoComplete="new-Pin"
                className="appearance-none block w-full px-3 py-3 border border-pryClr/30 rounded-md focus:outline-none pr-10"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirm_new_pin}
                maxLength={4}
            />
            {formik.touched.confirm_new_pin && formik.errors.confirm_new_pin ? (
            <div className="mt-1 text-sm text-red-600">
                {formik.errors.confirm_new_pin}
            </div>
            ) : null}
          </div>
          <div>
            <button
              type="submit"
              disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
              className={`w-full flex items-center justify-center h-[50px] px-4 border border-transparent rounded-md shadow-sm text-lg md:text-xl font-medium text-white bg-pryClr hover:bg-pryClr/90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {formik.isSubmitting ? (
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
                'Reset pin'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PinResetTab;