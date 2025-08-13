import React from 'react';

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="flex flex-col gap-6 text-center">
        <h3 className="md:text-2xl text-lg font-bold text-gray-800">Confirm Deletion</h3>
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
            className="bg-red-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
        >
            Delete
        </button>
        </div>
    </div>
  );
};

export default ConfirmationDialog;