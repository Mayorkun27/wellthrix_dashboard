import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import assets from "../../assets/assests";
import TestimonialHist from "./TestimonialHist";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ManageTestimonials = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      ratings: "",
      comment: "",
      image: "",
    },
  });
  return (
    <div className="space-y-4">
      <div className="bg-white md:p-6 p-4 rounded-lg shadow-sm">
        <h3 className="md:text-3xl text-2xl tracking-[-0.1em] mb-4 font-semibold text-black/80">
          Create Testimonials
        </h3>

        <form action="">
          <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:gap-4 w-full">
            {/* Name Field */}
            <div className="w-full lg:w-1/2 mb-2">
              <label className="text-sm font-semibold" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border border-pryClr w-full h-[46px] rounded-lg outline-0 indent-3"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-700 text-sm">{formik.errors.name}</p>
              )}
            </div>

            {/* Rating Field */}
            <div className="w-full lg:w-1/2">
              <label htmlFor="ratings" className="text-sm font-semibold">
                Rating
              </label>
              <select
                id="ratings"
                name="ratings"
                value={formik.values.ratings}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-3 border border-pryClr outline-0 rounded-lg ${
                  formik.touched.ratings && formik.errors.ratings
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value=""></option>
                <option value="1 star">1 star</option>
                <option value="2 stars">2 stars</option>
                <option value="3 stars">3 stars</option>
                <option value="4 stars">4 stars</option>
                <option value="5 stars">5 stars</option>
              </select>
            </div>
          </div>
          <div className="space-y-1 mt-4">
            <label className="text-sm font-semibold" htmlFor="message">
              Comment
            </label>
            <textarea
              type="text"
              name="comment"
              id="comment"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={5}
              className="border border-pryClr w-full rounded-lg outline-0 p-3 resize-none no-scrollbar"
            ></textarea>
            {formik.touched.message && formik.errors.comment && (
              <p className="text-red-700 text-sm">{formik.errors.comment}</p>
            )}
          </div>
          <div className="space-y-1 mt-4 mb-10">
            <label className="text-sm font-semibold mb-2" htmlFor="message">
              Image
            </label>
            <div className="border border-dashed border-pryClr rounded p-10 w-full">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                {/* Placeholder Image */}
                <img
                  src={assets.fileup}
                  alt="Upload"
                  className="h-10 w-10 mb-4 opacity-80"
                />
                <div className="flex gap-2 items-center">
                  <span className="text-pryClr text-sm border border-pryClr/20 p-2 rounded-[10px]">Choose File</span>
                  <span className="text-pryClr text-sm">No file chosen</span>
                </div>
                {/* Hidden Input */}
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>
        </form>
      </div>
        <div className="lg:mt-20 mt-15">
          <TestimonialHist />
        </div>
    </div>
  );
};

export default ManageTestimonials;
