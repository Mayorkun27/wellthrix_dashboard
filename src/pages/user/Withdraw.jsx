import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup"
import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Withdraw = () => {

  const { user } = useUser

  const formik = useFormik({
    initialValues: {
      user_id: user?.id || "",
      amount: "",
      bank_name: user?.bank_name || "",
      account_number: user?.bank_name || "",
      account_name: user?.bank_name || "",
      email: user?.email || "",
      withdraw_from: "",
    }
  })

  return (
    <div className="space-y-4">
      <div className="shadow-sm rounded bg-white overflow-x-auto p-8">
        <form action="">
          <div className="flex lg:flex-row lg:gap-20 gap-5 flex-col">
            <div className="w-full">
              <label
              htmlFor="text"
              className=" text-[16px] font-medium mb-4"
            >
              Bank Name
            </label>
            <input
              type="text"
              id=""
              name=""
              placeholder=""
              className="w-full px-4 py-2 border border-pryClr rounded-md"
            />
            </div>
            <div className="w-full">
              <label
              htmlFor="text"
              className=" text-[16px] font-medium mb-4"
            >
              Account Name
            </label>
            <input
              type="text"
              id=""
              name=""
              placeholder=""
              className="w-full px-4 py-2 border border-pryClr rounded-md"
            />
            </div>
          </div>
          <div className="flex lg:flex-row lg:gap-20 gap-5 flex-col mt-5 ">
            <div className="w-full">
              <label
              htmlFor="text"
              className=" text-[16px] font-medium mb-4"
            >
              Amount
            </label>
            <input
              type="number"
              id=""
              name=""
              placeholder=""
              className="w-full px-4 py-2 border border-pryClr rounded-md"
            />
            </div>
            <div className="w-full">
              <label
              htmlFor="text"
              className=" text-[16px] font-medium mb-4"
            >
              Description
            </label>
            <input
              type="text"
              id=""
              name=""
              placeholder=""
              className="w-full px-4 py-2 border border-pryClr rounded-md "
            />
            </div>
          </div>
            <div className="text-center">
            <button
              
              className={`mt-8 bg-pryClr text-secClr font-medium lg:w-1/2 w-[300px] h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >withdraw
            </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Withdraw;
