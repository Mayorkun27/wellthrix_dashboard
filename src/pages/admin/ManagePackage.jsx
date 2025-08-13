import React, { useEffect, useState } from "react";
import assets from "../../assets/assests";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { BsArrowRight } from 'react-icons/bs';
import { LuSparkle, LuCrown } from 'react-icons/lu';
import { AiOutlineRise } from 'react-icons/ai';
import { FaRegStar, FaTrashAlt } from 'react-icons/fa';
import { IoShieldCheckmarkOutline } from 'react-icons/io5';
import { CgArrowTopRight } from 'react-icons/cg';
import { VscGraph } from 'react-icons/vsc';
import { FiSearch } from 'react-icons/fi';
import { GiFire } from 'react-icons/gi';
import { formatterUtility } from "../../utilities/Formatterutility";
import Modal from "../../components/modals/Modal";
import ConfirmationDialog from "../../components/modals/ConfirmationDialog";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ManagePackage = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const { token, logout } = useUser();

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      point_value: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Package name is required"),
      price: Yup.string()
        .required("Package price is required")
        .min(1, "Package point value must be atlwd c"),
      point_value: Yup.string()
        .required("Package point value is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      try {
        const response = await axios.post(`${API_URL}/api/plans`, values, {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });

        console.log("package upload response", response)

        if (response.status === 201) {
          toast.success(response.data.message || `Package uploaded successfully`);
          fetchPackages()
        } else {
          throw new Error(response.data.message || "An error occurred creating package.");
        }
      } catch (error) {
        if (error.response?.data?.message?.toLowerCase() === "unauthenticated") {
          logout();
        }
        console.error("An error occurred creating package", error);
        toast.error(error.response?.data?.message || "An error occurred creating package");
      } finally {
        setSubmitting(false); 
      }
    }
  })

  const fetchPackages = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${API_URL}/api/plans`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      console.log("Package retrieve response:", response);

      if (response.status === 200) {
        setPackages(response.data.data.data || []);
      }
      
    } catch (error) {
      if (error.response?.data?.message?.includes("unauthenticated")) {
        logout();
      }
      console.error("Packages retrieve error:", error);
      toast.error(error.response?.data?.message || "An error occurred retrieving packages.");
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [token])

  const handleDeletePackage = async (id) => {
    // First, show the confirmation dialog
    setShowDeleteModal(true);
    setPackageToDelete(id);
  };

  const confirmDelete = async () => {
    if (!packageToDelete) return;

    const toastId = toast.loading("Deleting package...");
    setShowDeleteModal(false);

    try {
        const response = await axios.delete(`${API_URL}/api/plans/${packageToDelete}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 200) {
            toast.success(response.data.message || "Package deleted successfully", { id: toastId });
            fetchPackages();
        } else {
            throw new Error(response.data.message || "Failed to delete package.");
        }
    } catch (error) {
        if (error.response?.data?.message?.includes("unauthenticated")) {
            logout();
        }
        console.error("Package deletion error:", error);
        toast.error(error.response?.data?.message || "An error occurred deleting the package.", { id: toastId });
    } finally {
        setPackageToDelete(null);
    }
  };


  return (
    <div className="space-y-8">
      <div className="shadow-sm rounded-lg bg-white overflow-x-auto md:p-6 p-4">
        <h3 className="md:text-3xl text-2xl tracking mb-4 font-semibold text-black/80">
          Create New Package
        </h3>
        <form onSubmit={formik.handleSubmit} className="grid gap-6">
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="name" className="text-sm">Package Name</label>
            <input
              type="text"
              placeholder="Enter package name"
              name="name"
              id="name"
              className="w-full px-4 py-3 border border-pryClr/30 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-red-600">{formik.errors.name}</p>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="point_value" className="text-sm">Point Value</label>
            <input
              type="text"
              placeholder="Enter package point value"
              name="point_value"
              id="point_value"
              className="w-full px-4 py-3 border border-pryClr/30 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.point_value && formik.errors.point_value && (
              <p className="text-sm text-red-600">{formik.errors.point_value}</p>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="price" className="text-sm">Amount</label>
            <input
              type="text"
              placeholder="Enter package amount"
              name="price"
              id="price"
              className="w-full px-4 py-3 border border-pryClr/30 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.price && formik.errors.price && (
              <p className="text-sm text-red-600">{formik.errors.price}</p>
            )}
          </div>

          {/* <div className="spac space-y-2e-y-1 mt-8">
            <label className=text-sm mb-4" htmlFor="message">Image</label>
            <div className="border border-dashed border-pryClr rounded p-10 w-full">
              <label className="flex flex-colstify-center cursor-pointer">
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
                <input type="file" className="hidden" />
              </label>
            </div>
          </div> */}

          <div className="text-center">
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
              className="mt-8 bg-pryClr text-secClr font-medium lg:w-1/2 w-[300px] h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Uploading Package..." : "Upload Package"}
            </button>
          </div>
        </form>
      </div>

      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        {
          isLoading ? (
            <div className='border-4 border-t-transparent animate-spin mx-auto rounded-full w-[80px] h-[80px]'></div>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
              {packages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  className={`relative group overflow-hidden w-full rounded-2xl py-4 px-6 flex flex-col gap-2 bg-white text-black cursor-pointer border-2 transition-all duration-500 hover:shadow-lg`}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold capitalize">{pkg.name} package</p>
                    <div className={`${index % 2 === 0 ? "text-accClr" : "text-pryClr"}`}>
                      {
                        pkg.name == "spark" 
                          ? <LuSparkle className="text-2xl" /> 
                          : pkg.name == "rise" 
                            ? <AiOutlineRise className="text-2xl" />
                            : pkg.name == "star" 
                              ? <FaRegStar className="text-2xl" />
                              : pkg.name == "super" 
                                ? <IoShieldCheckmarkOutline className="text-2xl" />
                                : pkg.name == "thrive" 
                                  ? <CgArrowTopRight className="text-2xl" />
                                  : pkg.name == "thrix" 
                                    ? <VscGraph className="text-2xl" />
                                    : pkg.name == "crown" 
                                      ? <LuCrown className="text-2xl" />
                                      : <GiFire className="text-2xl" />
                      }
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <p className={`font-bold text-3xl ${index % 2 === 0 ? "text-accClr" : "text-pryClr"}`}>
                      {formatterUtility(Number(pkg.price))}
                      <span className="text-base font-normal">NGN</span>
                    </p>
                    <p className="text-sm">Point Value: {pkg.point_value}pv</p>
                  </div>
                  <div className="absolute inset-0 top-full group-hover:top-0 group-focus:top-0 bg-secClr/70 p-8 flex items-center justify-center transition-all duration-700">
                    <button 
                        type="button"
                        onClick={() => handleDeletePackage(pkg.id)}
                        className={`w-full text-sm h-[50px] text-white bg-red-700 cursor-pointer shadow-lg flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors`}
                    >
                        <FaTrashAlt className="" />
                        <span className="font-medium">Delete Package</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>

      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <ConfirmationDialog 
            message="Are you sure you want to delete this package? This action cannot be undone."
            onConfirm={confirmDelete}
            onCancel={() => setShowDeleteModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default ManagePackage;
