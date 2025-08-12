import React, { useState } from "react";
import assets from "../../assets/assests";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ProductUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      product_name: "",
      price: "",
      product_pv: "",
      product_description: "",
      in_stock: "",
      product_image: null,
    },
    validationSchema: Yup.object({
      product_name: Yup.string().required("Product name is required"),
      price: Yup.number()
        .required("Price is required")
        .min(0, "Price must be positive"),
      product_pv: Yup.number()
        .required("Point value is required")
        .min(0, "Point value must be positive"),
      in_stock: Yup.number()
        .required("Stock quantity is required")
        .min(0, "Stock must be positive"),
      product_description: Yup.string(),
      product_image: Yup.mixed().required("Product image is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        // Get token from localStorage or wherever you store it
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');

        // Create FormData for file upload
        const formData = new FormData();
        formData.append("product_name", values.product_name);
        formData.append("price", values.price);
        formData.append("product_pv", values.product_pv);
        formData.append("product_description", values.product_description);
        formData.append("in_stock", values.in_stock);
        formData.append("product_image", values.product_image);

        const response = await axios.post(
          `${API_URL}/api/products`,
          formData,
          {
            headers: {
              // Don't set Content-Type - let axios handle it for FormData
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        toast.success("Product uploaded successfully!");
        resetForm();
        setSelectedImage(null);
        setImagePreview(null);
      } catch (err) {
        console.error("Error uploading product:", err);
        if (axios.isAxiosError(err) && err.response) {
          toast.error(err.response.data.message || "Error uploading product");
        } else {
          toast.error("Unexpected error: " + err.message);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      formik.setFieldValue("product_image", file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="shadow-sm rounded bg-white overflow-x-auto p-8">
        <form onSubmit={formik.handleSubmit}>
          <div className="flex lg:flex-row lg:gap-20 gap-5 flex-col">
            <div className="w-full">
              <label
                htmlFor="productName"
                className="text-[16px] font-medium mb-4"
              >
                Product Name
              </label>
              <input
                required
                type="text"
                id="productName"
                name="product_name"
                value={formik.values.product_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter product name"
                className="w-full px-4 py-2 border border-pryClr rounded-md"
              />
              {formik.touched.product_name && formik.errors.product_name && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.product_name}
                </div>
              )}
            </div>
            <div className="w-full">
              <label htmlFor="price" className="text-[16px] font-medium mb-4">
                Price
              </label>
              <input
                required
                type="number"
                id="price"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter price"
                className="w-full px-4 py-2 border border-pryClr rounded-md"
              />
              {formik.touched.price && formik.errors.price && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.price}
                </div>
              )}
            </div>
          </div>

          <div className="flex lg:flex-row lg:gap-20 gap-5 flex-col mt-5">
            <div className="w-full">
              <label
                htmlFor="pointValue"
                className="text-[16px] font-medium mb-4"
              >
                Point Value
              </label>
              <input
                required
                type="number"
                id="pointValue"
                name="product_pv"
                value={formik.values.product_pv}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter point value"
                className="w-full px-4 py-2 border border-pryClr rounded-md"
              />
              {formik.touched.product_pv && formik.errors.product_pv && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.product_pv}
                </div>
              )}
            </div>
            <div className="w-full">
              <label htmlFor="inStock" className="text-[16px] font-medium mb-4">
                In Stock
              </label>
              <input
                required
                type="number"
                id="inStock"
                name="in_stock"
                value={formik.values.in_stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter stock quantity"
                className="w-full px-4 py-2 border border-pryClr rounded-md"
              />
              {formik.touched.in_stock && formik.errors.in_stock && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.in_stock}
                </div>
              )}
            </div>
          </div>

          <div className="flex lg:flex-row lg:gap-20 gap-5 flex-col mt-5">
            <div className="w-full">
              <label
                htmlFor="description"
                className="text-[16px] font-medium mb-4"
              >
                Description (Optional)
              </label>
              <input
                type="text"
                id="description"
                name="product_description"
                value={formik.values.product_description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter product description"
                className="w-full px-4 py-2 border border-pryClr rounded-md"
              />
            </div>
            <div className="w-full">{/* Empty div to maintain layout */}</div>
          </div>

          <div className="space-y-1 mt-8 mb-">
            <label className="text-[16px] font-medium mb-4" htmlFor="image">
              Image
            </label>
            <div className="border border-dashed border-pryClr rounded p-10 w-full">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-20 w-20 mb-4 object-cover rounded"
                  />
                ) : (
                  <img
                    src={assets.fileup}
                    alt="Upload"
                    className="h-10 w-10 mb-4 opacity-80"
                  />
                )}
                <div className="flex gap-2 items-center">
                  <span className="text-pryClr text-sm border border-pryClr/20 p-2 rounded-[10px]">
                    Choose File
                  </span>
                  <span className="text-pryClr text-sm">
                    {selectedImage ? selectedImage.name : "No file chosen"}
                  </span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            {formik.touched.product_image && formik.errors.product_image && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.product_image}
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className={`mt-8 bg-pryClr text-secClr font-medium lg:w-1/2 w-[300px] h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {formik.isSubmitting ? "Uploading..." : "Upload Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductUpload;