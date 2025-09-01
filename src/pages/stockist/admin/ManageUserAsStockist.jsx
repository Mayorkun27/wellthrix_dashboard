import React, { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import Modal from "../../../components/modals/Modal";
import { toast } from "sonner";
import axios from "axios";
import { formatTransactionType } from "../../../utilities/formatterutility";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { CiEdit } from "react-icons/ci";
import { useFormik } from "formik";
import * as Yup from "yup";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ManageUserAsStockist = () => {
  const { token, logout } = useUser();
  const [stockists, setStockists] = useState([]);
  const [stockistToEdit, setStockistToEdit] = useState(null);
  const [isFetchingStockists, setIsFetchingStockists] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState("");

  const fetchStockist = async () => {
    setIsFetchingStockists(true)
    try {
      const response = await axios.get(`${API_URL}/api/stockists`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      console.log("stockists response",response)
      if (response.status === 200 && response.data.success) {
        console.log("response.data", response.data.data)
        setStockists(response.data.data)
      }
      
    } catch (error) {
      if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
        logout()
      }
      console.error("An error occured fetching stockists", error)
      toast.error("An error occured fetching stockists")
    } finally {
      setIsFetchingStockists(false)
    }
  }

  useEffect(() => {
    fetchStockist()
  }, [])

  const formik = useFormik({
    initialValues: {
      new_plan: stockistToEdit?.stockist_plan || "",
      stockist_location: stockistToEdit?.stockist_location || ""
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      new_plan: Yup.string()
        .required("Stockist plan is required"),
      stockist_location: Yup.string()
        .required("Stockist location is required"),
    }),
    onSubmit: async (values) => {
      console.log(values)
      setIsLoading(true)
      const toastId = toast.loading("Updating stockist information")

      try {
        const response = await axios.post(`${API_URL}/api/users/${stockistToEdit?.id}/upgrade-stockist`, values, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.status === 200) {
          toast.success(response.data.message || `Stockist details updated successfully`, { id: toastId });
          fetchStockist();
        } else {
            throw new Error(response.data.message || `Failed to update stockist details.`);
        }
      } catch (error) {
        if (error.response?.data?.message?.includes("unauthenticated")) {
            logout();
        }
        console.error(`Failed to update stockist details:`, error);
        toast.error(error.response?.data?.message || `An error occurred updating stockist details.`, { id: toastId });
      } finally {
        setIsLoading(false);
        setStockistToEdit(null);
      }
    }
  })

  return (
    <div className="shadow-sm rounded bg-white overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-black/70 text-[12px] uppercase text-center border-b border-black/20">
            <th className="p-5">S/N</th>
            <th className="p-5">Username</th>
            <th className="p-5">fullname</th>
            <th className="p-5">Email</th>
            <th className="p-5">Phone</th>
            <th className="p-5">Location</th>
            <th className="p-5">Plan</th>
            <th className="p-5">Action</th>
          </tr>
        </thead>

        <tbody>
          {isFetchingStockists ? (
            <tr>
              {/* 10 columns total */}
              <td colSpan="10" className="text-center p-8">
                Loading...
              </td>
            </tr>
          ) : stockists.length > 0 ? (
            stockists.map((stockist, index) => {
              return (
                <tr key={index+stockist?.username+stockist?.id} className="hover:bg-gray-50 border-b text-xs border-black/10 text-center">
                  <td className="px-4 py-2 text-center">{String(index+1).padStart(3, "0")}</td>
                  <td className="px-4 py-2 text-center">{stockist?.username}</td>
                  <td className="px-4 py-2 text-center">{`${stockist?.first_name} ${stockist?.last_name}`}</td>
                  <td className="px-4 py-2 text-center">{stockist?.email}</td>
                  <td className="px-4 py-2 text-center">{stockist?.mobile}</td>
                  <td className="px-4 py-2 text-center min-w-[400px]">{stockist?.stockist_location}</td>
                  <td className="px-4 py-2 text-center">{formatTransactionType(stockist?.stockist_plan, true)}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex gap-2 items-center justify-center">
                      <button
                        type="button"
                        title={`Edit stockist details`}
                        onClick={() => {
                          setStockistToEdit(stockist)
                          setPlan(stockist?.stockist_plan)
                        }}
                        className="text-red-600 text-xl cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-red-600/10 transition-all duration-300 rounded-lg mx-auto disabled:opacity-25 disabled:cursor-not-allowed"
                      >
                        <CiEdit />
                      </button>
                      <button
                        type="button"
                        title={`Manage stockist products`}
                        onClick={() => {
                            
                        }}
                        className="text-pryClr text-xl cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-pryClr/10 transition-all duration-300 rounded-lg mx-auto disabled:opacity-25 disabled:cursor-not-allowed"
                      >
                        <LiaShoppingBagSolid />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan="10" className="text-center p-8">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* {!isLoading && stockists.length > 0 && (
        <div className="flex justify-center items-center gap-2 p-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={lastPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )} */}

      {
        stockistToEdit && (
          <Modal onClose={() => setStockistToEdit(null)}>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <h3 className="font-semibold capitalize text-2xl text-center">
                Edit details
              </h3>
      
              <div className="space-y-1">
                <label className="block text-sm" htmlFor="new_plan">Edit plan</label>
                <select
                  name="new_plan"
                  id="new_plan"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.new_plan}
                  className="w-full p-3 border rounded-lg border-gray-300 outline-0 capitalize"
                >
                  <option value="" disabled>Select stockist plan</option>
                  <option value="grand_imperial">Grand imperial Plan</option>
                  <option value="imperial_stockist">imperial stockist Plan</option>
                  <option value="royal_stockist">royal stockist Plan</option>
                  <option value="prestige_stockist">prestige stockist Plan</option>
                </select>
                {formik.touched.new_plan && formik.errors.new_plan && (<p>{formik.errors.new_plan}</p>)}
              </div>
      
              <div className="space-y-1">
                <label className="block text-sm" htmlFor="stockist_location">Update stockist location</label>
                <input
                  type="text"
                  name="stockist_location"
                  id="stockist_location"
                  value={formik.values.stockist_location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-3 border rounded-lg border-gray-300 outline-0"
                />
                {formik.touched.stockist_location && formik.errors.stockist_location && (<p>{formik.errors.stockist_location}</p>)}
              </div>
      
              <button
                type="submit"
                className="bg-pryClr text-secClr w-full py-3 mt-6 rounded font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={formik.isSubmitting || !formik.isValid}
              >
                {formik.isSubmitting ? "Updating..." : "Update"}
              </button>
            </form>
          </Modal>
        )
      }
    </div>
  );
};

export default ManageUserAsStockist;
