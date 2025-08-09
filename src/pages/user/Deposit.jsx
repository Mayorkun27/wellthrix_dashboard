import React, { useState } from "react";
import assets from "../../assets/assests";

const Deposit = () => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div className="space-y-4">
      <div className="bg-pryClr lg:w-1/2 w-full rounded px-4 py-6">
        <div className="flex  justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secClr p-3 w-[60px] h-[60px] rounded-full items-center flex justify-center text-white">
              <img src={assets.depositfunds} alt="" />
            </div>
            <div>
              <p className="text-white">E-Wallet</p>
              <h2 className="text-white text-[16px] font-bold">&#8358; 0</h2>
            </div>
          </div>
          <div>
            <p className="text-[14px] text-white">Fund wallet</p>
          </div>
        </div>
      </div>
      <div className="shadow-sm rounded bg-white overflow-x-auto p-8">
        <h1 className="text-[22px] font-semibold">Deposit Funds</h1>
        <form action="">
          <div className="w-full mt-5">
            <label htmlFor="text" className=" text-[16px] font-medium">
              Amount
            </label>
            <input
              required
              type="number"
              id=""
              name=""
              placeholder={`${"₦"} 0.00`}
              className="w-full px-4 py-2 border border-pryClr rounded-md mt-2"
            />
          </div>
          <p className="text-black mt-6 mb-3">Deposit Method</p>
          <div className="bg-pryClr/20 px-5 py-8 rounded flex items-center justify-between border-2 border-black/50">
            <div className="flex lg:gap-5 gap-4 items-center">
              <img src={assets.depwal} alt="" />
              <div>
                <p className="text-[14px]">Paystack</p>
                <p className="text-[12px]">
                  Pay securely with your card or bank account
                </p>
              </div>
            </div>

            <div
              onClick={() => setIsSelected(!isSelected)}
              className="w-9 h-9 bg-pryClr rounded-full flex items-center justify-center cursor-pointer"
            >
              <div className="bg-secClr w-5 h-5 rounded-full flex items-center justify-center">
                {isSelected && (
                  <img
                    src={assets.mark}
                    alt=""
                    className="w-4 h-4 text-secClr"
                  />
                )}
              </div>
            </div>
          </div>
          <button
            className={`mt-8 bg-pryClr text-secClr font-medium w-full h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Confirm Deposit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Deposit;
