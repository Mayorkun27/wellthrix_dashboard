import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import assets from "../../assets/assests";
import PaginationControls from "../../utilities/PaginationControls";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL

const Form = () => {
  const { token, logout } = useUser()
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage] = useState(5);
  const rowsPerPage = 5;
  const [misDetails, setMisDetails] = useState({
    completed_count: "",
    pending_count: "",
  })

  const validationSchema = Yup.object({
    title: Yup.string()
      .trim()
      .when([], {
        is: () => !selectedItem,
        then: (schema) => schema.required("Title is required").min(1, "Title cannot be empty"),
        otherwise: (schema) => schema.min(0).optional(),
      }),
    description: Yup.string()
      .trim()
      .when([], {
        is: () => !selectedItem,
        then: (schema) => schema.required("Description is required").min(1, "Description cannot be empty"),
        otherwise: (schema) => schema.min(0).optional(),
      }),
    due_date: Yup.date()
      .when([], {
        is: () => !selectedItem,
        then: (schema) => schema.required("Expected date is required").typeError("Invalid date format"),
        otherwise: (schema) => schema.typeError("Invalid date format").optional(),
      }),
    image: Yup.mixed().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      due_date: "",
      image: null,
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      // console.log("values", values)
      const toastId = toast.loading("Creating task...")

      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("due_date", values.due_date);
        if (values.image) {
          formData.append("image", values.image);
        }

        const response = await axios.post(`${API_URL}/api/task_schedule`, formData, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });

        // console.log("task post response", response);

        if (response.status === 201 || response.data.status === 201) {
          toast.success(response.data.message || "Task created successfully!", { id: toastId });
          setRefresh(true);
          resetForm();
        } else {
          throw new Error(response.data.message || "Failed to create task.");
        }
      } catch (error) {
        if (error?.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
          logout();
          toast.error("Session expired. Please login again.", { id: toastId });
        } else {
          console.error("An error occurred creating task", error);
          toast.error(error?.response?.data?.message || "An error occurred creating task", { id: toastId });
        }
      } finally {
        setSubmitting(false);
        resetForm();
      }

    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("image", file);
  };

  const handleCancelEdit = () => {
    setSelectedItem(null);
    formik.resetForm();
  };

  const toggleStatus = (id) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "pending" ? "completed" : "pending" }
          : item
      )
    );
  };

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/allform`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        params: {
          page: currentPage,
          perPage: perPage
        }
      });

      // console.log("tasks fetch response", response);

      if (response.status === 200) {
        setMisDetails({
          completed_count: response.data.completed_count,
          pending_count: response.data.pending_count,
        })
        const { data, current_page, last_page, per_page } = response.data.tasks;
        setItems(data);
        setCurrentPage(current_page);
        setLastPage(last_page);
      }
    } catch (error) {
        if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
          logout();
        }
        console.error("An error occured tasks announcements", error);
        toast.error(error.response.data.message || "An error occured fetching tasks");
    } finally {
      setIsLoading(false);
    }
  }, [token, currentPage, perPage, refresh, logout]);
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="space-y-4">
      <div className="bg-white md:p-6 p-4 rounded-lg shadow-sm">
        <h3 className="md:text-3xl text-2xl tracking-[-0.1em] mb-4 font-semibold text-black/80">
          {selectedItem ? "Update Item" : "Create Item"}
        </h3>

        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border border-pryClr/50 w-full h-[46px] rounded-lg outline-0 indent-3"
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-red-700 text-sm">{formik.errors.title}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold" htmlFor="description">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={5}
                className="border border-pryClr/50 w-full rounded-lg outline-0 p-3 resize-none no-scrollbar"
              ></textarea>
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-700 text-sm">{formik.errors.description}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold" htmlFor="due_date">
                Expected Date
              </label>
              <input
                type="date"
                name="due_date"
                id="due_date"
                value={formik.values.due_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border border-pryClr/50 w-full h-[46px] rounded-lg outline-0 indent-3"
              />
              {formik.touched.due_date && formik.errors.due_date && (
                <p className="text-red-700 text-sm">{formik.errors.due_date}</p>
              )}
            </div>

            <div className="space-y-1 mb-10">
              <label className="text-sm font-semibold mb-2" htmlFor="image">
                Image {selectedItem && "(Upload new image to replace current)"}
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
                        : selectedItem && selectedItem.image
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
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting || (!selectedItem && !formik.isValid) || (!selectedItem && !formik.dirty)}
              className={`bg-pryClr text-white px-4 py-2 rounded-lg hover:bg-pryClr/80 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {submitting
                ? "Processing"
                : selectedItem
                ? "Update Item"
                : "Create Item"}
            </button>
            {selectedItem && (
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

      <div className="lg:mt-20 mt-10 space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white shadow rounded p-4 text-center">
            <h4 className="text-gray-600 text-sm font-medium">Completed</h4>
            <p className="text-2xl font-bold text-green-600">{misDetails.completed_count || 0}</p>
          </div>
          <div className="bg-white shadow rounded p-4 text-center">
            <h4 className="text-gray-600 text-sm font-medium">Pending</h4>
            <p className="text-2xl font-bold text-yellow-600">{misDetails.pending_count || 0}</p>
          </div>
        </div>
        <div className="shadow-sm rounded bg-white overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-black/70 text-[12px] uppercase border-b border-black/20 whitespace-nowrap">
                <th className="lg:p-5 p-3 text-center">ID</th>
                <th className="lg:p-5 p-3 text-center">Title</th>
                <th className="lg:p-5 p-3 text-center">Description</th>
                <th className="lg:p-5 p-3 text-center">Created Date</th>
                <th className="lg:p-5 p-3 text-center">Due Date</th>
                <th className="lg:p-5 p-3 text-center">Image</th>
                <th className="lg:p-5 p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="lg:p-5 p-3 text-center" colSpan={6}>Loading tasks...</td>
                </tr>
              ) : items.length > 0 ? (
                items.map((t, i) => {
                  const serialNumber = (currentPage - 1) * perPage + (i + 1);
                  return (
                    <tr
                      key={t?.id}
                      className="hover:bg-gray-50 text-sm border-b border-black/10"
                    >
                      <td className="lg:p-5 p-3 text-center">{String(serialNumber).padStart(3, "0")}</td>
                      <td className="lg:p-5 p-3 text-center">{t?.title}</td>
                      <td className="lg:p-5 p-3 text-center min-w-[400px]">{t?.description}</td>
                      <td className="lg:p-5 p-3 text-center">{t.created_at.split("T")[0]}</td>
                      <td className="lg:p-5 p-3 text-center">{t.due_date}</td>
                      <td className="lg:p-5 p-3 text-center">
                        <div className="w-[60px] h-[60px] mx-auto border border-black/20 overflow-hidden rounded-full">
                          <img
                            src={`https://api.wellthrixinternational.com/storage/app/public/${t?.image}`}
                            alt={t?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="lg:p-5 p-3 text-center">
                        <button
                          onClick={() => toggleStatus(t?.id)}
                          className={`px-3 py-2 rounded-md border-2 ${
                            t?.status.toLowerCase() === "on-going" ? "border-accClr text-black bg-accClr/50" : "text-white bg-pryClr"
                          }`}
                        >
                          {t?.status?.charAt(0).toUpperCase() + t?.status?.slice(1)}
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-8">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {!isLoading && items.length > 0 && (
            <div className="p-4">
              <PaginationControls
                currentPage={currentPage}
                totalPages={lastPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;