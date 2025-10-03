import React, { useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import assets from "../../assets/assests";
import PaginationControls from "../../utilities/PaginationControls";
import { FaTrash, FaEdit } from "react-icons/fa";

const Form = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const rowsPerPage = 5;

  const fallbackItems = [
    {
      id: "001",
      title: "Sample Title 1",
      description: "This is a sample description.",
      expected_date: "2025-10-10",
      image: "https://via.placeholder.com/150",
      status: "pending",
    },
    {
      id: "002",
      title: "Sample Title 2",
      description: "Another sample description here.",
      expected_date: "2025-11-15",
      image: null,
      status: "completed",
    },
  ];

  // Form validation schema
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
    expected_date: Yup.date()
      .when([], {
        is: () => !selectedItem,
        then: (schema) => schema.required("Expected date is required").typeError("Invalid date format"),
        otherwise: (schema) => schema.typeError("Invalid date format").optional(),
      }),
    image: Yup.mixed().nullable(),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      expected_date: "",
      image: null,
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      setSubmitting(true);
      const newItem = {
        id: selectedItem ? selectedItem.id : Date.now().toString(),
        title: values.title?.trim() || (selectedItem ? selectedItem.title?.trim() : ""),
        description: values.description?.trim() || (selectedItem ? selectedItem.description?.trim() : ""),
        expected_date: values.expected_date || (selectedItem ? selectedItem.expected_date : ""),
        image: values.image ? URL.createObjectURL(values.image) : (selectedItem ? selectedItem.image : null),
        status: selectedItem ? selectedItem.status : "pending",
      };

      if (selectedItem) {
        setItems(items.map((item) => (item.id === selectedItem.id ? newItem : item)));
      } else {
        setItems([...items, newItem]);
      }

      resetForm();
      setSelectedItem(null);
      setSubmitting(false);
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("image", file);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    formik.setValues({
      title: item.title?.trim() || "",
      description: item.description?.trim() || "",
      expected_date: item.expected_date || "",
      image: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setSelectedItem(null);
    formik.resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.id !== id));
    }
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

  const totalPages = Math.ceil(items.length / rowsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return items.length > 0 ? items.slice(start, start + rowsPerPage) : fallbackItems;
  }, [currentPage, items]);

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
                className="border border-pryClr w-full h-[46px] rounded-lg outline-0 indent-3"
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
                className="border border-pryClr w-full rounded-lg outline-0 p-3 resize-none no-scrollbar"
              ></textarea>
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-700 text-sm">{formik.errors.description}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold" htmlFor="expected_date">
                Expected Date
              </label>
              <input
                type="date"
                name="expected_date"
                id="expected_date"
                value={formik.values.expected_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border border-pryClr w-full h-[46px] rounded-lg outline-0 indent-3"
              />
              {formik.touched.expected_date && formik.errors.expected_date && (
                <p className="text-red-700 text-sm">{formik.errors.expected_date}</p>
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

      <div className="lg:mt-20 mt-10">
        <div className="shadow-sm rounded bg-white overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-black/70 text-[12px] uppercase border-b border-black/20 whitespace-nowrap">
                <th className="lg:p-5 p-3 text-left">ID</th>
                <th className="lg:p-5 p-3 text-left">Title</th>
                <th className="lg:p-5 p-3 text-left">Description</th>
                <th className="lg:p-5 p-3 text-left">Date</th>
                <th className="lg:p-5 p-3 text-left">Image</th>
                <th className="lg:p-5 p-3 text-left">Status</th>
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
                    <td className="lg:p-5 p-3 text-left">{t.title}</td>
                    <td className="lg:p-5 p-3 text-left min-w-[400px]">{t.description}</td>
                    <td className="lg:p-5 p-3 text-left">{t.expected_date}</td>
                    <td className="lg:p-5 p-3 text-left">
                      <div className="w-[60px] h-[60px]">
                        <img
                          src={t.image || "https://via.placeholder.com/150?text=Image+Not+Found"}
                          alt={t.title}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </td>
                    <td className="lg:p-5 p-3 text-left">
                      <button
                        onClick={() => toggleStatus(t.id)}
                        className={`px-3 py-1 rounded text-white ${
                          t.status === "pending" ? "bg-yellow-500" : "bg-green-500"
                        }`}
                      >
                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-8">
                    No items found.
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
        </div>
      </div>
    </div>
  );
};

export default Form;