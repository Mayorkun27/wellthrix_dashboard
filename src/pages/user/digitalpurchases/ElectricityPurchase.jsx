import React, { useEffect, useState } from "react";
import assets from "../../../assets/assests";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoIosCheckmark } from "react-icons/io";
import { useUser } from "../../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ElectricityPurchase = ({ onProceed }) => {
  const { user, token, logout } = useUser();
  const [electricityCompanies, setElectricityCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchElectricityCompanies = async () => {
    setIsLoading(true);
    const toastId = toast.loading(`Getting electricity companies...`);
    try {
      const response = await axios.get(`${API_URL}/api/electricity-companies`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("electricity companies response", response);

      if (response.status === 200) {
        toast.success(
          response.data.message || `Fetched electricity companies successfully`,
          { id: toastId }
        );
        setElectricityCompanies(response.data.discos);
      }
    } catch (error) {
      if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
        logout();
      }
      console.error("An error occured getting electricity companies", error);
      toast.error(
        error.response.data.message ||
          "An error occured getting electricity companies",
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchElectricityCompanies();
  }, []);

  const formik = useFormik({
    initialValues: {
      user_id: user?.id,
      transaction_type: "electricity",
      serviceID: "",
      amount: "",
      phone: "",
      variation_code: "",
      billersCode: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      serviceID: Yup.string().required("Service Provider is required"),
      phone: Yup.string().required("Phone Number is required"),
      amount: Yup.number()
        .min(0, "Amount to purchase must be greater than 0")
        .max(user?.earning_wallet, "Insufficient balance!")
        .required("Amount is required"),
      variation_code: Yup.string().required("Variation Code is required"),
      billersCode: Yup.string().required("Billers Code is required"),
    }),
    onSubmit: (values) => {
      console.log("electricity values", values);
      onProceed(values);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="grid md:grid-cols-1 grid-cols-1 gap-4"
    >
      <div className="my-3 gap-6 grid md:grid-cols-2 grid-cols-1">
        <div className="space-y-1 md:col-span-2 col-span-1">
          <select
            name="serviceID"
            id="serviceID"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Variation Code"
            defaultValue={""}
            disabled={isLoading || !electricityCompanies}
            className="bg-white h-[50px] indent-3 w-full rounded-md border-0 outline-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value={""} disabled>
              Select Variation Code
            </option>
            {electricityCompanies.map((electricityCompany, index) => (
              <option key={index} value={electricityCompany.serviceID}>
                {electricityCompany.name}
              </option>
            ))}
          </select>
          {formik.errors.serviceID && formik.touched.serviceID && (
            <p className="text-red-800">{formik.errors.serviceID}</p>
          )}
        </div>
        <div className="space-y-1">
          <input
            type="number"
            name="amount"
            id="amount"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Amount in NGN"
            className="bg-white h-[50px] indent-3 w-full rounded-md border-0 outline-0"
          />
          {formik.touched.amount && formik.errors.amount && (
            <p className="text-red-800">{formik.errors.amount}</p>
          )}
        </div>
        <div className="space-y-1">
          <input
            type="tel"
            name="phone"
            id="phone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Phone Number"
            className="bg-white h-[50px] indent-3 w-full rounded-md border-0 outline-0"
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-800">{formik.errors.phone}</p>
          )}
        </div>
        <div className="space-y-1">
          <select
            name="variation_code"
            id="variation_code"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Variation Code"
            className="bg-white h-[50px] indent-3 w-full rounded-md border-0 outline-0"
            defaultValue={""}
          >
            <option value={""} disabled>
              Select Variation Code
            </option>
            <option value={"prepaid"}>Prepaid</option>
            <option value={"postpaid"}>Postpaid</option>
          </select>
          {formik.errors.variation_code && formik.touched.variation_code && (
            <p className="text-red-800">{formik.errors.variation_code}</p>
          )}
        </div>
        <div className="space-y-1">
          <input
            type="text"
            name="billersCode"
            id="billersCode"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Billers Code"
            className="bg-white h-[50px] indent-3 w-full rounded-md border-0 outline-0"
          />
          {formik.touched.billersCode && formik.errors.billersCode && (
            <p className="text-red-800">{formik.errors.billersCode}</p>
          )}
        </div>
      </div>
      <div className="text-center">
        <button
          type="submit"
          disabled={!formik.isValid || formik.isSubmitting}
          className="bg-pryClr text-secClr font-medium lg:w-1/2 w-full h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed
        </button>
      </div>
    </form>
  );
};

export default ElectricityPurchase;
