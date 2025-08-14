import React, { useState } from "react";
import assets from "../../assets/assests";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ProductUpload = () => {
  const { token, logout } = useUser()

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
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("product_name", values.product_name);
        formData.append("price", values.price);
        formData.append("product_pv", values.product_pv);
        formData.append("product_description", values.product_description);
        formData.append("in_stock", values.in_stock);
        formData.append("product_image", values.product_image);

        const response = await axios.post(`${API_URL}/api/products`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("product upload response: ", response)

        if (response.status === 201) {
          toast.success("Product uploaded successfully!");
          resetForm();
          setSelectedImage(null);
          setImagePreview(null); 
        } else {
          throw new Error(response.data.message || "Failed to upload product.");
        }

      } catch (error) {
        console.error("Error fetching products:", error)
        if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
          logout()
          toast.error("Session expired. Please login again.")
        } else {
          toast.error(error.response?.data?.message || "Error loading products")
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

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="shadow-sm rounded-xl bg-white overflow-x-auto md:p-8 p-6">
        <form onSubmit={formik.handleSubmit} className="grid md:grid-cols-2 grid-cols-1 gap-6">
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="productName" className="text-sm">
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
              className="w-full indent-3 h-[45px] border border-pryClr/20 rounded-md outline-0"
            />
            {formik.touched.product_name && formik.errors.product_name && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.product_name}
              </div>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="price" className="text-sm">
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
              className="w-full indent-3 h-[45px] border border-pryClr/20 rounded-md outline-0"
            />
            {formik.touched.price && formik.errors.price && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.price}
              </div>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="pointValue" className="text-sm">
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
              className="w-full indent-3 h-[45px] border border-pryClr/20 rounded-md outline-0"
            />
            {formik.touched.product_pv && formik.errors.product_pv && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.product_pv}
              </div>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="inStock" className="text-sm">
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
              className="w-full indent-3 h-[45px] border border-pryClr/20 rounded-md outline-0"
            />
            {formik.touched.in_stock && formik.errors.in_stock && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.in_stock}
              </div>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="description" className="text-sm">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="product_description"
              value={formik.values.product_description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter product description"
              className="w-full p-3 text-sm h-full border border-pryClr/20 rounded-md outline-0 resize-none no-scrollbar"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="image" className="text-sm">
              Image
            </label>
            <div className="border border-dashed border-pryClr rounded p-6 w-full">
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
                <div className="flex flex-col-reverse items-center">
                  <span className="text-pryClr text-sm border border-pryClr/20 p-2 rounded-[10px] whitespace-nowrap">
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


          <div className="md:col-span-2 col-span-1 text-center">
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