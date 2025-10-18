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
import { FaRegStar, FaTrashAlt, FaEdit } from 'react-icons/fa';
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
  const [editingPackage, setEditingPackage] = useState(null);
  const { token, logout } = useUser();

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      point_value: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .when([], {
          is: () => !editingPackage,
          then: (schema) => schema.required("Package name is required").min(1, "Package name cannot be empty"),
          otherwise: (schema) => schema.min(0).optional(),
        }),
      price: Yup.number()
        .when([], {
          is: () => !editingPackage,
          then: (schema) => schema.required("Package price is required").min(0, "Price must be positive"),
          otherwise: (schema) => schema.min(0).optional(),
        })
        .typeError("Price must be a number"),
      point_value: Yup.number()
        .when([], {
          is: () => !editingPackage,
          then: (schema) => schema.required("Package point value is required").min(0, "Point value must be positive"),
          otherwise: (schema) => schema.min(0).optional(),
        })
        .typeError("Point value must be a number"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      console.log("Form values before submission:", values);

      try {
        const payload = {
          name: values.name?.trim() || (editingPackage ? editingPackage.name?.trim() : ""),
          price: values.price != null && values.price !== "" ? Number(values.price) : Number(editingPackage ? editingPackage.price : 0),
          point_value: values.point_value != null && values.point_value !== "" ? Number(values.point_value) : Number(editingPackage ? editingPackage.point_value : 0),
        };

        // Debug: Log payload
        console.log("Request payload:", payload);

        const endpoint = editingPackage
          ? `${API_URL}/api/plans/${editingPackage.id}`
          : `${API_URL}/api/plans`;
        console.log("Requesting:", endpoint);

        let response;
        if (editingPackage) {
          response = await axios.put(endpoint, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        } else {
          response = await axios.post(endpoint, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        }

        console.log("Package upload/update response:", response.data);

        if (response.status === 201 || response.status === 200) {
          toast.success(editingPackage ? "Package updated successfully" : "Package uploaded successfully");
          resetForm();
          setEditingPackage(null);
          fetchPackages();
        } else {
          throw new Error(response.data.message || `Failed to ${editingPackage ? "update" : "upload"} package.`);
        }
      } catch (error) {
        console.error("Error with package operation:", error.response || error);
        if (error.response?.data?.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat().join(", ");
          toast.error(errorMessages || `Error ${editingPackage ? "updating" : "uploading"} package`);
        } else if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
          logout();
          toast.error("Session expired. Please login again.");
        } else {
          toast.error(error.response?.data?.message || `Error ${editingPackage ? "updating" : "uploading"} package`);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Package retrieve response:", response);

      if (response.status === 200) {
        setPackages(response.data.data.data || []);
      }
    } catch (error) {
      console.error("Packages retrieve error:", error.response || error);
      if (error.response?.data?.message?.includes("unauthenticated")) {
        logout();
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(error.response?.data?.message || "An error occurred retrieving packages.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePackage = async (id) => {
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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success(response.data.message || "Package deleted successfully", { id: toastId });
        fetchPackages();
      } else {
        throw new Error(response.data.message || "Failed to delete package.");
      }
    } catch (error) {
      console.error("Package deletion error:", error.response || error);
      if (error.response?.data?.message?.includes("unauthenticated")) {
        logout();
        toast.error("Session expired. Please login again.", { id: toastId });
      } else {
        toast.error(error.response?.data?.message || "An error occurred deleting the package.", { id: toastId });
      }
    } finally {
      setPackageToDelete(null);
    }
  };

  const handleEditPackage = (pkg) => {
    console.log("Editing package:", pkg);
    setEditingPackage(pkg);
    formik.setValues({
      name: pkg.name?.trim() || "",
      price: pkg.price != null ? pkg.price : "",
      point_value: pkg.point_value != null ? pkg.point_value : "",
    });
  };

  const handleCancelEdit = () => {
    setEditingPackage(null);
    formik.resetForm();
  };

  useEffect(() => {
    fetchPackages();
  }, [token]);

  return (
    <div className="space-y-8">
      <div className="shadow-sm rounded-lg bg-white overflow-x-auto md:p-6 p-4">
        <h3 className="md:text-3xl text-2xl tracking mb-4 font-semibold text-black/80">
          {editingPackage ? "Edit Package" : "Create New Package"}
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
              value={formik.values.name}
              onChange={(e) => {
                formik.handleChange(e);
                console.log("Package name changed:", e.target.value);
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-red-600">{formik.errors.name}</p>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="point_value" className="text-sm">Point Value</label>
            <input
              type="number"
              placeholder="Enter package point value"
              name="point_value"
              id="point_value"
              className="w-full px-4 py-3 border border-pryClr/30 rounded-md"
              value={formik.values.point_value}
              onChange={(e) => {
                formik.handleChange(e);
                console.log("Point value changed:", e.target.value);
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.point_value && formik.errors.point_value && (
              <p className="text-sm text-red-600">{formik.errors.point_value}</p>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="price" className="text-sm">Amount</label>
            <input
              type="number"
              placeholder="Enter package amount"
              name="price"
              id="price"
              className="w-full px-4 py-3 border border-pryClr/30 rounded-md"
              value={formik.values.price}
              onChange={(e) => {
                formik.handleChange(e);
                console.log("Price changed:", e.target.value);
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.price && formik.errors.price && (
              <p className="text-sm text-red-600">{formik.errors.price}</p>
            )}
          </div>
          <div className="text-center flex justify-center gap-4">
            <button
              type="submit"
              disabled={formik.isSubmitting || (!editingPackage && !formik.isValid) || (!editingPackage && !formik.dirty)}
              className="mt-8 bg-pryClr text-secClr font-medium lg:w-1/2 w-[300px] h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting
                ? (editingPackage ? "Updating Package..." : "Uploading Package...")
                : (editingPackage ? "Update Package" : "Upload Package")
              }
            </button>
            {editingPackage && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="mt-8 bg-red-600 text-white font-medium lg:w-1/2 w-[300px] h-[50px] rounded-lg cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        {isLoading ? (
          <div className="border-4 border-t-transparent animate-spin mx-auto rounded-full w-[80px] h-[80px]"></div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`relative group overflow-hidden w-full rounded-2xl py-4 px-6 flex flex-col gap-2 bg-white text-black cursor-pointer border-2 transition-all duration-500 hover:shadow-lg ${index % 2 === 0 ? "border-accClr" : "border-pryClr"}`}
              >
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold capitalize">{pkg.name} package</p>
                  <div className={`${index % 2 === 0 ? "text-accClr" : "text-pryClr"}`}>
                    {pkg.name === "spark" ? <LuSparkle className="text-2xl" />
                      : pkg.name === "rise" ? <AiOutlineRise className="text-2xl" />
                      : pkg.name === "star" ? <FaRegStar className="text-2xl" />
                      : pkg.name === "super" ? <IoShieldCheckmarkOutline className="text-2xl" />
                      : pkg.name === "thrive" ? <CgArrowTopRight className="text-2xl" />
                      : pkg.name === "thrix" ? <VscGraph className="text-2xl" />
                      : pkg.name === "crown" ? <LuCrown className="text-2xl" />
                      : <GiFire className="text-2xl" />}
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <p className={`font-bold text-3xl ${index % 2 === 0 ? "text-accClr" : "text-pryClr"}`}>
                    {formatterUtility(Number(pkg.price))}
                    <span className="text-base font-normal">NGN</span>
                  </p>
                  <p className="text-sm">Point Value: {pkg.point_value}pv</p>
                </div>
                <div className="absolute inset-0 top-full group-hover:top-0 group-focus:top-0 bg-secClr/70 p-8 flex items-center justify-center gap-4 transition-all duration-700">
                  <button
                    type="button"
                    onClick={() => handleEditPackage(pkg)}
                    className="w-1/2 text-sm h-[50px] text-white bg-pryClr cursor-pointer shadow-lg flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors"
                  >
                    <FaEdit className="text-lg" />
                    <span className="font-medium">Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="w-1/2 text-sm h-[50px] text-white bg-red-700 cursor-pointer shadow-lg flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors"
                  >
                    <FaTrashAlt className="text-lg" />
                    <span className="font-medium">Delete Package</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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