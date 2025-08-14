import React from 'react';

const ConfirmationDialog = ({ title="Confirm Deletion", message, onConfirm, onCancel, type="delete" }) => {
  return (
    <div className="flex flex-col gap-6 text-center">
        <h3 className="md:text-2xl text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600">{message}</p>
        <div className="flex justify-center md:gap-4 gap-2">
        <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 font-medium px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
        >
            Cancel
        </button>
        <button
            type="button"
            onClick={onConfirm}
            className={`${type === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-pryClr hover:bg-pryClr/80"} text-white font-medium px-6 py-2 rounded-lg transition-colors cursor-pointer`}
        >
            {type === "delete" ? "Delete" : "Confirm"}
        </button>
        </div>
    </div>
  );
};

export default ConfirmationDialog;