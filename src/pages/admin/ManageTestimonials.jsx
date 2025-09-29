import React, { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import PaginationControls from "../../utilities/PaginationControls";
import { FaTrash, FaEdit } from "react-icons/fa";
import assets from "../../assets/assests";
import Modal from "../../components/modals/Modal";
import ConfirmationDialog from "../../components/modals/ConfirmationDialog";

const API_URL = import.meta.env.VITE_API_BASE_URL || "";
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || "";

const ManageTestimonials = () => {
  const { token, loading: contextLoading, logout } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [testimonials, setTestimonials] = useState([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const rowsPerPage = 5;

  const fallbackTestimonials = [
    {
      id: "001",
      full_name: "Dorcas Odekunle",
      rating: 5,
      comment: "Amazing service! Highly recommend.",
      image: "https://via.placeholder.com/150",
    },
    {
      id: "002",
      full_name: "Jane Smith",
      rating: 4,
      comment: "Great experience, will use again.",
      image: null,
    },
  ];

  // Form validation schema
  const validationSchema = Yup.object({
    full_name: Yup.string()
      .trim()
      .when([], {
        is: () => !selectedTestimonial,
        then: (schema) => schema.required("Name is required").min(1, "Name cannot be empty"),
        otherwise: (schema) => schema.min(0).optional(),
      }),
    rating: Yup.number()
      .when([], {
        is: () => !selectedTestimonial,
        then: (schema) => schema.required("Rating is required").min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
        otherwise: (schema) => schema.min(1).max(5).optional(),
      })
      .typeError("Rating must be a number"),
    comment: Yup.string()
      .trim()
      .when([], {
        is: () => !selectedTestimonial,
        then: (schema) => schema.required("Comment is required").min(1, "Comment cannot be empty"),
        otherwise: (schema) => schema.min(0).optional(),
      }),
    image: Yup.mixed().nullable(),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      full_name: "",
      rating: "",
      comment: "",
      image: null,
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      if (!token) {
        setError("Please log in to submit testimonials.");
        toast.error("Please log in to submit testimonials.", { duration: 3000 });
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 3000);
        return;
      }

      setSubmitting(true);
      const formData = new FormData();
      formData.append("full_name", values.full_name?.trim() || (selectedTestimonial ? selectedTestimonial.full_name?.trim() : ""));
      formData.append("rating", values.rating != null && values.rating !== "" ? Number(values.rating) : Number(selectedTestimonial ? selectedTestimonial.rating : 0));
      formData.append("comment", values.comment?.trim() || (selectedTestimonial ? selectedTestimonial.comment?.trim() : ""));
      if (values.image) {
        formData.append("image", values.image);
      }

      // Debug: Log FormData contents
      const formDataEntries = {};
      for (let [key, value] of formData.entries()) {
        formDataEntries[key] = value instanceof File ? value.name : value;
      }
      console.log("FormData contents:", formDataEntries);

      try {
        const url = selectedTestimonial
          ? `${API_URL}/api/testimonial/${selectedTestimonial.id}`
          : `${API_URL}/api/testimonial`;
        const method = selectedTestimonial ? "put" : "post";

        console.log("Requesting:", { method, url });

        const response = await axios({
          method,
          url,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        });

        console.log("Submit response:", response.data);

        toast.success(
          selectedTestimonial
            ? "Testimonial updated successfully"
            : "Testimonial created successfully",
          { duration: 3000 }
        );

        await fetchTestimonials();
        resetForm();
        setSelectedTestimonial(null);
      } catch (err) {
        console.error("Submit error:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          code: err.code,
        });
        let errorMessage = selectedTestimonial
          ? "Failed to update testimonial."
          : "Failed to create testimonial.";
        if (err.response?.status === 401) {
          errorMessage = "Unauthorized: Please log in again.";
          logout();
          toast.error(errorMessage, { duration: 3000 });
          setTimeout(() => {
            window.location.hash = '#/login';
          }, 3000);
        } else if (err.response?.status === 422) {
          const errorMessages = Object.values(err.response.data.errors || {}).flat().join(", ");
          errorMessage = errorMessages || errorMessage;
          toast.error(errorMessage, { duration: 3000 });
        } else if (err.response?.status === 500) {
          errorMessage = "Server error: Please contact support.";
          toast.error(errorMessage, { duration: 3000 });
        } else if (err.code === "ECONNABORTED") {
          errorMessage = "Request timed out. Please try again.";
          toast.error(errorMessage, { duration: 3000 });
        } else if (err.code === "ERR_NETWORK") {
          errorMessage = "Network error: Unable to connect to the server. Please check your connection or contact support.";
          toast.error(errorMessage, { duration: 3000 });
        } else if (err.message.includes("ERR_CERT")) {
          errorMessage = "SSL certificate error: Please contact support.";
          toast.error(errorMessage, { duration: 3000 });
        } else {
          toast.error(errorMessage, { duration: 3000 });
        }
        setError(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("image", file);
  };

  const handleEdit = (testimonial) => {
    console.log("Editing testimonial:", testimonial);
    setSelectedTestimonial(testimonial);
    formik.setValues({
      full_name: testimonial.full_name?.trim() || "",
      rating: testimonial.rating != null ? testimonial.rating.toString() : "",
      comment: testimonial.comment?.trim() || "",
      image: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setSelectedTestimonial(null);
    formik.resetForm();
  };

  const fetchTestimonials = async (retries = 2, delay = 1000) => {
    if (!token) {
      setError("Please log in to access testimonials.");
      setTestimonials(fallbackTestimonials);
      setLoading(false);
      toast.error("Please log in to access testimonials.", { duration: 3000 });
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 3000);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!API_URL) {
        throw new Error("API base URL is not defined. Check your .env file.");
      }

      console.log("Fetching testimonials from:", `${API_URL}/api/testimonial`);
      console.log("Using token:", token);

      const response = await axios.get(`${API_URL}/api/testimonial`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });
let dataa = response.data.data || [];
let data = dataa.data;



      const mappedData = data.map((testimonial) => ({
        id: testimonial.id,
        full_name: testimonial.full_name?.trim() || "",
        rating: parseInt(testimonial.rating, 10) || 0,
        comment: testimonial.comment?.trim() || "",
        image: testimonial.image ? `${IMAGE_BASE_URL}/${testimonial.image}` : null,
      }));

      console.log("Mapped testimonials:", mappedData);

      setTestimonials(mappedData);
    } catch (err) {
      console.error("Fetch error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        code: err.code,
      });
      let errorMessage = "Failed to fetch testimonials. Please try again later.";
      if (err.response?.status === 401) {
        errorMessage = "Unauthorized: Please log in again.";
        logout();
        toast.error(errorMessage, { duration: 3000 });
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 3000);
      } else if (err.response?.status === 500) {
        errorMessage = "Server error: Please contact support.";
        toast.error(errorMessage, { duration: 3000 });
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again.";
        toast.error(errorMessage, { duration: 3000 });
      } else if (err.code === "ERR_NETWORK") {
        errorMessage = "Network error: Unable to connect to the server. Please check your connection or contact support.";
        toast.error(errorMessage, { duration: 3000 });
      } else if (err.message.includes("ERR_CERT")) {
        errorMessage = "SSL certificate error: Please contact support.";
        toast.error(errorMessage, { duration: 3000 });
      } else {
        toast.error(errorMessage, { duration: 3000 });
      }

      setError(errorMessage);
      setTestimonials(fallbackTestimonials);
     let contextLoading = null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!contextLoading && token !== null) {
      if (token) {
        fetchTestimonials();
      }
    }
  }, [token, contextLoading]);

  const totalPages = Math.ceil(testimonials.length / rowsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return testimonials.slice(start, start + rowsPerPage);
  }, [currentPage, testimonials]);

  const handleDeletePrompt = (id) => {
    if (!token) {
      setError("Please log in to delete testimonials.");
      toast.error("Please log in to delete testimonials.", { duration: 3000 });
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 3000);
      return;
    }

    setTestimonialToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setError(null);
      const response = await axios.delete(
        `${API_URL}/api/testimonial/${testimonialToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      console.log(`Deleted testimonial with ID: ${testimonialToDelete}`, response.data);
      setTestimonials(testimonials.filter((t) => t.id !== testimonialToDelete));
      setShowDeleteModal(false);
      setTestimonialToDelete(null);
      toast.success("Testimonial deleted successfully", { duration: 3000 });
    } catch (err) {
      console.error("Delete error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        code: err.code,
      });
      let errorMessage = "Failed to delete testimonial.";
      if (err.response?.status === 401) {
        errorMessage = "Unauthorized: Please log in again.";
        logout();
        toast.error(errorMessage, { duration: 3000 });
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 3000);
      } else if (err.response?.status === 500) {
        errorMessage = "Server error: Please contact support.";
        toast.error(errorMessage, { duration: 3000 });
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again.";
        toast.error(errorMessage, { duration: 3000 });
      } else if (err.code === "ERR_NETWORK") {
        errorMessage = "Network error: Unable to connect to the server. Please check your connection or contact support.";
        toast.error(errorMessage, { duration: 3000 });
      } else if (err.message.includes("ERR_CERT")) {
        errorMessage = "SSL certificate error: Please contact support.";
        toast.error(errorMessage, { duration: 3000 });
      } else {
        toast.error(errorMessage, { duration: 3000 });
      }
      setError(errorMessage);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white md:p-6 p-4 rounded-lg shadow-sm">
        <h3 className="md:text-3xl text-2xl tracking-[-0.1em] mb-4 font-semibold text-black/80">
          {selectedTestimonial ? "Update Testimonial" : "Create Testimonials"}
        </h3>

        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:gap-4 w-full">
            <div className="w-full lg:w-1/2 mb-2">
              <label className="text-sm font-semibold" htmlFor="full_name">
                Name
              </label>
              <input
                type="text"
                name="full_name"
                id="full_name"
                value={formik.values.full_name}
                onChange={(e) => {
                  formik.handleChange(e);
                  console.log("Full name changed:", e.target.value);
                }}
                onBlur={formik.handleBlur}
                className="border border-pryClr w-full h-[46px] rounded-lg outline-0 indent-3"
              />
              {formik.touched.full_name && formik.errors.full_name && (
                <p className="text-red-700 text-sm">{formik.errors.full_name}</p>
              )}
            </div>

            <div className="w-full lg:w-1/2">
              <label htmlFor="rating" className="text-sm font-semibold">
                Rating
              </label>
              <select
                id="rating"
                name="rating"
                value={formik.values.rating}
                onChange={(e) => {
                  formik.handleChange(e);
                  console.log("Rating changed:", e.target.value);
                }}
                onBlur={formik.handleBlur}
                className={`w-full p-3 border border-pryClr outline-0 rounded-lg ${formik.touched.rating && formik.errors.rating
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
              >
                <option value="">Select Rating</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              {formik.touched.rating && formik.errors.rating && (
                <p className="text-red-700 text-sm">{formik.errors.rating}</p>
              )}
            </div>
          </div>
          <div className="space-y-1 mt-4">
            <label className="text-sm font-semibold" htmlFor="comment">
              Comment
            </label>
            <textarea
              name="comment"
              id="comment"
              value={formik.values.comment}
              onChange={(e) => {
                formik.handleChange(e);
                console.log("Comment changed:", e.target.value);
              }}
              onBlur={formik.handleBlur}
              rows={5}
              className="border border-pryClr w-full rounded-lg outline-0 p-3 resize-none no-scrollbar"
            ></textarea>
            {formik.touched.comment && formik.errors.comment && (
              <p className="text-red-700 text-sm">{formik.errors.comment}</p>
            )}
          </div>
          <div className="space-y-1 mt-4 mb-10">
            <label className="text-sm font-semibold mb-2" htmlFor="image">
              Image {selectedTestimonial && "(Upload new image to replace current)"}
            </label>
            <div className="border border-dashed border-pryClr rounded p-10 w-full">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <img
                  src={assets.fileup}
                  alt="Upload"
                  className="h-10 w-10 mb-4 opacity-80"
                />
                <div className="flex gap-2 items-center">
                  <span className="text-pryClr text-sm border border-pryClr/20 p-2 rounded-[10px]">
                    Choose File
                  </span>
                  <span className="text-pryClr text-sm">
                    {formik.values.image
                      ? formik.values.image.name
                      : selectedTestimonial && selectedTestimonial.image
                      ? "Current image set"
                      : "No file chosen"}
                  </span>
                </div>
                <input
                  type="file"
                  name="image"
                  id="image"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting || (!selectedTestimonial && !formik.isValid) || (!selectedTestimonial && !formik.dirty)}
              className={`bg-pryClr text-white px-4 py-2 rounded-lg hover:bg-pryClr/80 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {submitting
                ? "Processing"
                : selectedTestimonial
                ? "Update Testimonial"
                : "Create Testimonial"}
            </button>
            {selectedTestimonial && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="lg:mt-20 mt-15">
        <div className="shadow-sm rounded bg-white overflow-x-auto">
          {loading ? (
            <div className="text-center p-8">Loading testimonials...</div>
          ) : (
            <>
              {error && (
                <div className="text-center p-4 text-red-600">
                  {error}
                  <button
                    onClick={() => fetchTestimonials()}
                    className="ml-2 text-pryClr hover:text-pryClr/50 underline"
                  >
                    Retry
                  </button>
                </div>
              )}
              <table className="w-full">
                <thead>
                  <tr className="text-black/70 text-[12px] uppercase border-b border-black/20 whitespace-nowrap">
                    <th className="lg:p-5 p-3 text-left">ID</th>
                    <th className="lg:p-5 p-3 text-left">Name</th>
                    <th className="lg:p-5 p-3 text-left">Rating</th>
                    <th className="lg:p-5 p-3 text-center">Comment</th>
                    <th className="lg:p-5 p-3 text-left">Image</th>
                    <th className="lg:p-5 p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-gray-50 text-sm border-b border-black/10"
                      >
                        <td className="lg:p-5 p-3 text-left">{t.id}</td>
                        <td className="lg:p-5 p-3 text-left">{t.full_name}</td>
                        <td className="lg:p-5 p-3 text-left">{t.rating}</td>
                        <td className="lg:p-5 p-3 text-left min-w-[400px]">{t.comment}</td>
                        <td className="lg:p-5 p-3 text-left">
                          <div className="w-[60px] h-[60px]">
                            <img
                              src={t.image || "https://via.placeholder.com/150?text=Image+Not+Found"}
                              alt={t.full_name}
                              className="w-full h-full object-cover rounded-full"
                               />
                          </div>
                        </td>
                        <td className="lg:p-5 p-3 text-left">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEdit(t)}
                              className="text-pryClr hover:text-pryClr/50"
                              title="Edit"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeletePrompt(t.id)}
                              className="text-pryClr hover:text-pryClr/50"
                              title="Delete"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center p-8">
                        No testimonials found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {currentData.length > 0 && (
                <div className="p-4">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}

          {showDeleteModal && (
            <Modal
              onClose={() => setShowDeleteModal(false)}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 pointer-events-none"
            >
              <ConfirmationDialog
                title="Confirm Delete"
                message="Are you sure you want to delete this testimonial?"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
              />
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTestimonials;