import React from "react";
import assets from "../../assets/assests";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ManagePackage = () => {

  const { token, logout } = useUser()

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      point_value: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Package name is required"),
      price: Yup.string()
        .required("Package price is required")
        .min(1, "Package point value must be atlwd c"),
      point_value: Yup.string()
        .required("Package point value is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      try {
        const response = await axios.post(`${API_URL}/api/plans`, values, {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });

        console.log("package upload response", response)

        if (response.status === 201 && response.data.ok) {
          toast.success(response.data.message || `Package uploaded successfully`);

        } else {
          throw new Error(response.data.message || "An error occurred creating package.");
        }
      } catch (error) {
        if (error.response?.data?.message?.toLowerCase() === "unauthenticated") {
          logout();
        }
        console.error("An error occurred creating package", error);
        toast.error(error.response?.data?.message || "An error occurred creating package");
      } finally {
        setSubmitting(false); 
      }
    }
  })
  return (
    <div className="space-y-4">
      <div className="shadow-sm rounded-lg bg-white overflow-x-auto md:p-6 p-4">
        <h3 className="md:text-3xl text-2xl tracking mb-4 font-semibold text-black/80">
          Create New Package
        </h3>
        <form onSubmit={formik.handleSubmit} className="grid gap-6">
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="name" className="text-sm">Package Name</label>
            <input
              type="text"
              placeholder="Enter package name"
              name="name"
              id="name"
              className="w-full px-4 py-3 border border-pryClr/30 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-red-600">{formik.errors.name}</p>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="point_value" className="text-sm">Point Value</label>
            <input
              type="text"
              placeholder="Enter package point value"
              name="point_value"
              id="point_value"
              className="w-full px-4 py-3 border border-pryClr/30 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.point_value && formik.errors.point_value && (
              <p className="text-sm text-red-600">{formik.errors.point_value}</p>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="price" className="text-sm">Amount</label>
            <input
              type="text"
              placeholder="Enter package amount"
              name="price"
              id="price"
              className="w-full px-4 py-3 border border-pryClr/30 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.price && formik.errors.price && (
              <p className="text-sm text-red-600">{formik.errors.price}</p>
            )}
          </div>

          {/* <div className="spac space-y-2e-y-1 mt-8">
            <label className=text-sm mb-4" htmlFor="message">Image</label>
            <div className="border border-dashed border-pryClr rounded p-10 w-full">
              <label className="flex flex-colstify-center cursor-pointer">
                <img
                  src={assets.fileup}
                  alt="Upload"
                  className="h-10 w-10 mb-4 opacity-80"
                />
                <div className="flex gap-2 items-center">
                  <span className="text-pryClr text-sm border border-pryClr/20 p-2 rounded-[10px]">
                    Choose File
                  </span>
                  <span className="text-pryClr text-sm">No file chosen</span>
                </div>
                <input type="file" className="hidden" />
              </label>
            </div>
          </div> */}

          <div className="text-center">
            <button className="mt-8 bg-pryClr text-secClr font-medium lg:w-1/2 w-[300px] h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              Upload Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagePackage;
