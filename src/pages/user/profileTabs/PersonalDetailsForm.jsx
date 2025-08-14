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
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      gender: user?.gender || "",
      date_of_birth: user?.date_of_birth || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      first_name: Yup.string()
        .required("First Name is required"),
      last_name: Yup.string()
        .required("Last Name is required"),
      gender: Yup.string()
        .required("Gender is required"),
      date_of_birth: Yup.date()
        .required("Date of Birth is required")
        .max(new Date(), "Date of Birth cannot be in the future"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await axios.put(`${API_URL}/api/profile/updatePersonal`, values, {
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
            <label htmlFor="first_name" className="block text-sm">First Name</label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.first_name}
              className="p-2 w-full border border-pryClr/20 h-[50px] outline-0 rounded-md"
            />
            {formik.touched.first_name && formik.errors.first_name ? (
              <div className="mt-1 text-sm text-red-600">
                {formik.errors.first_name}
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="last_name" className="block text-sm">Last Name</label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.last_name}
              className="p-2 w-full border border-pryClr/20 h-[50px] outline-0 rounded-md"
            />
            {formik.touched.last_name && formik.errors.last_name ? (
              <div className="mt-1 text-sm text-red-600">
                {formik.errors.last_name}
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
            <label htmlFor="date_of_birth" className="block text-sm">Date of Birth</label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.date_of_birth}
              className="p-2 w-full border border-pryClr/20 h-[50px] outline-0 rounded-md"
            />
            {formik.touched.date_of_birth && formik.errors.date_of_birth ? (
              <div className="mt-1 text-sm text-red-600">
                {formik.errors.date_of_birth}
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
