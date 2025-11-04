// src/components/users/modals/EnableStockistModal.jsx
import { useState, useEffect } from "react";
import Modal from "./Modal";

const EnableStockistModal = ({ open, user, onClose, onConfirm, isSubmitting }) => {
  const [plan, setPlan] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (open) {
      setPlan("");
      setLocation("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <Modal onClose={onClose}>
      <div className="space-y-4">
        <h3 className="font-semibold capitalize text-2xl text-center">
          Enable {user?.username}
        </h3>

        <div className="space-y-1">
          <label className="block text-sm" htmlFor="stockist_plan">
            Pick a stockist plan for {user?.username}
          </label>
          <select
            name="stockist_plan"
            id="stockist_plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full p-3 border rounded-lg border-gray-300 outline-0 capitalize"
          >
            <option value="" disabled>
              Select stockist plan
            </option>
            <option value="grand_imperial">Grand imperial Plan</option>
            <option value="imperial_stockist">imperial stockist Plan</option>
            <option value="royal_stockist">royal stockist Plan</option>
            <option value="prestige_stockist">prestige stockist Plan</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm" htmlFor="stockist_location">
            Enter a certified location for {user?.username}
          </label>
          <input
            type="text"
            name="stockist_location"
            id="stockist_location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border rounded-lg border-gray-300 outline-0"
          />
        </div>

        <button
          type="button"
          className="bg-pryClr text-secClr w-full py-3 mt-6 rounded font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onConfirm({ plan, location })}
          disabled={!plan || !location || isSubmitting}
        >
          {isSubmitting ? "Enabling..." : "Enable"}
        </button>
      </div>
    </Modal>
  );
};

export default EnableStockistModal;
