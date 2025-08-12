// src/pages/user/profile/BankDetailsForm.jsx
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const PS_SK = import.meta.env.VITE_PAYSTACK_SECRET_KEY;

const BankDetailsForm = () => {
  const { token, logout, user, refreshUser } = useUser();

  const [listOfBanks, setListOfBanks] = useState([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isResolvingAccount, setIsResolvingAccount] = useState(false);

  // --- Component state improvements ---
  // Find initial bank code from user data
  const initialBankCode = listOfBanks.find(bank => bank.name === user?.bank_name)?.code || "";

  const formik = useFormik({
    initialValues: {
      bank_code: initialBankCode, // Use bank code as the value
      account_name: user?.account_name || "",
      account_number: user?.account_number || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      bank_code: Yup.string().required("Bank Name is required"),
      account_name: Yup.string().required("Account Holder is required"),
      account_number: Yup.string()
        .required("Account Number is required")
        .matches(/^\d{8,20}$/, "Account Number must be 8-20 digits"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      // Find the bank name from the code to send to your backend
      const selectedBank = listOfBanks.find(bank => bank.code === values.bank_code);
      const bankName = selectedBank ? selectedBank.name : values.bank_code;
      const submissionData = { ...values, bank_name: bankName };

      setSubmitting(true);
      try {
         const response = await axios.put(`${API_URL}/api/profile/updateBank`, submissionData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          toast.success("Bank details updated successfully!");
          refreshUser();
        }
      } catch (error) {
        if (
          error.response?.status === 401 ||
          error.response?.data?.message?.toLowerCase() === "unauthenticated"
        ) {
          logout();
        }
        console.error("Error updating bank details:", error);
        toast.error(
          error.response?.data?.message || "Failed to update bank details."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchApprovedBanks = async () => {
      setIsLoadingBanks(true);
      try {
        const response = await axios.get("https://api.paystack.co/bank");
        if (response.status === 200 && response.data.status) {
          setListOfBanks(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching banks", err);
        toast.error("Error fetching bank list.");
      } finally {
        setIsLoadingBanks(false);
      }
    };
    fetchApprovedBanks();
  }, []);

  // This useEffect now watches for changes in the formik values
  useEffect(() => {
    const resolveBankAccount = async () => {
        const accountNumber = formik.values.account_number;
        const bankCode = formik.values.bank_code;
        // Only proceed if a bank is selected and the account number is exactly 10 digits
        if (bankCode && accountNumber.length === 10) {
            setIsResolvingAccount(true);
            try {
                const response = await axios.get(
                    `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${PS_SK}`
                        }
                    }
                );

                if (response.data.status) {
                    formik.setFieldValue('account_name', response.data.data.account_name);
                    toast.success('Account name resolved successfully!');
                } else {
                    formik.setFieldValue('account_name', '');
                    toast.error(response.data.message || 'Could not resolve account name.');
                }
            } catch (error) {
                formik.setFieldValue('account_name', '');
                console.error('Error resolving bank account:', error);
                toast.error('Error resolving bank account. Please check details.');
            } finally {
                setIsResolvingAccount(false);
            }
        } else {
            // Clear account name if conditions aren't met
            formik.setFieldValue('account_name', '');
        }
    };
    // Add a small debounce to avoid excessive API calls on every keystroke
    const handler = setTimeout(() => {
      resolveBankAccount();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [formik.values.account_number, formik.values.bank_code, PS_SK]); // Dependency array updated

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Bank Details</h3>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="bank_name" className="block text-sm">Bank Name</label>
            <select
              id="bank_name"
              name="bank_code" // Changed to bank_code
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bank_code} // Changed to bank_code
              disabled={isLoadingBanks}
              className="p-3 h-[50px] w-full border border-pryClr/20 rounded-md outline-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{isLoadingBanks ? "Loading Banks..." : "Select Bank"}</option>
              {listOfBanks.map((bank) => (
                <option key={bank.id} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
            {formik.touched.bank_code && formik.errors.bank_code ? ( // Changed to bank_code
              <div className="mt-1 text-sm text-red-600">
                {formik.errors.bank_code}
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="account_number" className="block text-sm">Account Number</label>
            <input
              id="account_number"
              name="account_number"
              type="text"
              inputMode="numeric"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.account_number}
              className="p-3 h-[50px] w-full border border-pryClr/20 rounded-md outline-0"
            />
            {formik.touched.account_number && formik.errors.account_number ? (
              <div className="mt-1 text-sm text-red-600">
                {formik.errors.account_number}
              </div>
            ) : null}
          </div>
          <div className="space-y-2 md:col-span-2 col-span-1">
            <label htmlFor="account_name" className="block text-sm">Account Holder Name</label>
            <input
              id="account_name"
              name="account_name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
              value={isResolvingAccount ? 'Resolving...' : formik.values.account_name}
              className={`p-3 h-[50px] w-full border border-pryClr/20 rounded-md outline-0 ${isResolvingAccount ? "opacity-25" : ''} cursor-not-allowed focus:outline-none ${formik.touched.account_name && formik.errors.account_name ? 'border-red-500' : ''}`}
            />
            {formik.touched.account_name && formik.errors.account_name ? (
              <div className="mt-1 text-sm text-red-600">
                {formik.errors.account_name}
              </div>
            ) : null}
          </div>
        </div>
        <button
          type="submit"
          disabled={!formik.isValid || !formik.dirty || formik.isSubmitting || isResolvingAccount}
          className={`w-full flex justify-center py-3 px-4 rounded-md text-lg font-medium text-white bg-pryClr hover:bg-pryClr/90 ${
            !formik.isValid || !formik.dirty || formik.isSubmitting || isResolvingAccount
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {formik.isSubmitting ? "Processing..." : "Update Bank Details"}
        </button>
      </form>
    </div>
  );
};

export default BankDetailsForm;