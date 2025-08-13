// src/pages/user/profile/PersonalDetailsForm.jsx
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const PersonalDetailsForm = () => {
  const { token, logout, user } = useUser();

  const formik = useFormik({
    initialValues: {
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      gender: user?.gender || "",
      dob: user?.dob || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("First Name is required"),
      lastName: Yup.string()
        .required("Last Name is required"),
      gender: Yup.string()
        .required("Gender is required"),
      dob: Yup.date()
        .required("Date of Birth is required")
        .max(new Date(), "Date of Birth cannot be in the future"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await axios.post(`${API_URL}/api/user/personal-details`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Personal details updated successfully!");
      } catch (error) {
        if (
          error.response?.status === 401 ||
          error.response?.data?.message?.toLowerCase() === "unauthenticated"
        ) {
          logout();
        }
        console.error("Error updating personal details:", error);
        toast.error(
          error.response?.data?.message || "Failed to update personal details."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Details</h3>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form fields for personal details */}
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
              className="p-2 w-full border border-pryClr/20 h-[50px] outline-0 rounded-md"
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className="mt-1 text-sm text-red-600">
                {formik.errors.firstName}
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
              className="p-2 w-full border border-pryClr/20 h-[50px] outline-0 rounded-md"
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <div className="mt-1 text-sm text-red-600">
                {formik.errors.lastName}
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="gender" className="block text-sm">Gender</label>
            <select
              id="gender"
              name="gender"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.gender}
              className="p-2 w-full border border-pryClr/20 h-[50px] outline-0 rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {formik.touched.gender && formik.errors.gender ? (
              <div className="mt-1 text-sm text-red-600">
                {formik.errors.gender}
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="dob" className="block text-sm">Date of Birth</label>
            <input
              id="dob"
              name="dob"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.dob}
              className="p-2 w-full border border-pryClr/20 h-[50px] outline-0 rounded-md"
            />
            {formik.touched.dob && formik.errors.dob ? (
              <div className="mt-1 text-sm text-red-600">
                {formik.errors.dob}
              </div>
            ) : null}
          </div>
        </div>
        <button
          type="submit"
          disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
          className={`w-full flex justify-center py-3 px-4 rounded-md text-lg font-medium text-white bg-pryClr hover:bg-pryClr/90 ${
            !formik.isValid || !formik.dirty || formik.isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {formik.isSubmitting ? "Processing..." : "Update Personal Details"}
        </button>
      </form>
    </div>
  );
};

export default PersonalDetailsForm;
