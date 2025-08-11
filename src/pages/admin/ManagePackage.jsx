import React from "react";
import assets from "../../assets/assests";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ManagePackage = () => {
  return (
    <div className="space-y-4">
      <div className="shadow-sm rounded bg-white overflow-x-auto p-8">
        <h3 className="md:text-3xl text-2xl tracking-[-0.1em] mb-4 font-semibold text-black/80">
          Create New Package
        </h3>
        <form action="">
          <div className="flex lg:flex-row lg:gap-20 gap-5 flex-col">
            <div className="w-full">
              <label htmlFor="text" className=" text-[16px] font-medium mb-4">
                Package Name
              </label>
              <input
                required
                type="text"
                placeholder=""
                className="w-full px-4 py-2 border border-pryClr rounded-md"
              />
            </div>
            <div className="w-full">
              <label htmlFor="text" className=" text-[16px] font-medium mb-4">
                Point Value
              </label>
              <input
                required
                type="text"
                placeholder=""
                className="w-full px-4 py-2 border border-pryClr rounded-md"
              />
            </div>
          </div>

          <div className="flex lg:flex-row lg:gap-20 gap-5 flex-col mt-5 ">
            <div className="w-full">
              <label htmlFor="number" className=" text-[16px] font-medium mb-4">
                Amount
              </label>
              <input
                required
                type="text"
                id="amount"
                placeholder="₦0.00"
                className="w-full px-4 py-2 border border-pryClr rounded-md"
              />
            </div>
          </div>

          <div className="space-y-1 mt-8">
            <label className="text-[16px] font-medium mb-4" htmlFor="message">
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
                  <span className="text-pryClr text-sm border border-pryClr/20 p-2 rounded-[10px]">
                    Choose File
                  </span>
                  <span className="text-pryClr text-sm">No file chosen</span>
                </div>
                {/* Hidden Input */}
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>

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
