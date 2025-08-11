import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useUser } from "../../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL

const PasswordResetTab = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { logout, user, token } = useUser()

  const formik = useFormik({
    initialValues: {
        user_id: user?.id || "",
        old_password: '',
        new_password: '',
        confirmPassword: '',
    },
    validationSchema: Yup.object({
        old_password: Yup.string()
            .required('Current password is required')
            .min(8, 'Password must be at least 8 characters'),
        new_password: Yup.string()
            .required('New password is required')
            .min(8, 'Password must be at least 8 characters')
            .notOneOf([Yup.ref('old_password')], 'New password must be different from current'),
        confirmPassword: Yup.string()
            .required('Please confirm your password')
            .oneOf([Yup.ref('new_password')], 'Passwords must match'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log('values to be Submitted:', values);
      setSubmitting(true)

        try {
            const response = await axios.post(`${API_URL}/api/profile/change-password`, values, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            console.log("password reset response", response)

            if (response.status === 200 && response.data.ok) {
                toast.success(response.data.message || `Password updated successfully`);
            } else {
                throw new Error(response.data.message || "An error occurred updating password.");
            }
            
        } catch (error) {
            if (error.response?.data?.message?.toLowerCase() === "unauthenticated") {
                logout();
            }
            console.error("An error occurred updating password", error);
            toast.error(error.response?.data?.message || "An error occurred updating password");
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
          <div>
            <label htmlFor="old_password" className="block text-sm font-medium text-black">
              Current Password
            </label>
            <div className="mt-1 relative">
              <input
                id="old_password"
                name="old_password"
                type={showOldPassword ? "text" : "password"}
                autoComplete="current-password"
                className="appearance-none block w-full px-3 py-3 border border-pryClr/30 rounded-md focus:outline-none pr-10"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.old_password}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formik.touched.old_password && formik.errors.old_password ? (
            <div className="mt-1 text-sm text-red-600">
                {formik.errors.old_password}
            </div>
            ) : null}
          </div>
          <div>
            <label htmlFor="new_password" className="block text-sm font-medium text-black">
              New Password
            </label>
            <div className="mt-1 relative">
              <input
                id="new_password"
                name="new_password"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                className="appearance-none block w-full px-3 py-3 border border-pryClr/30 rounded-md focus:outline-none pr-10"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.new_password}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formik.touched.new_password && formik.errors.new_password ? (
            <div className="mt-1 text-sm text-red-600">
                {formik.errors.new_password}
            </div>
            ) : null}
            <p className="mt-1 text-xs text-black">
              Must be at least 8 characters and different from current password
            </p>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
              Confirm New Password
            </label>
            <div className="mt-1 relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                className="appearance-none block w-full px-3 py-3 border border-pryClr/30 rounded-md focus:outline-none pr-10"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="mt-1 text-sm text-red-600">
                {formik.errors.confirmPassword}
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
                'Reset Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetTab;