import React from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL;


const Withdraw = () => {
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
            required
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
            required
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
            required
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
            required
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
