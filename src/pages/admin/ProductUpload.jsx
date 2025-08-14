import React, { useState, useEffect } from "react";
import assets from "../../assets/assests";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL

const ProductUpload = () => {
  const { token, logout } = useUser()

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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
      product_image: Yup.mixed().when([], {
        is: () => !editingProduct, // required only if not editing
        then: (schema) => schema.required("Product image is required"),
        otherwise: (schema) => schema.nullable()
      })
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

        // Only append image if a new one is chosen
        if (values.product_image) {
          formData.append("product_image", values.product_image);
        }


        let response;
        if (editingProduct) {
          // Update existing product
          response = await axios.put(`${API_URL}/api/updateproduct/${editingProduct.id}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } else {
          // Create new product
          response = await axios.post(`${API_URL}/api/products`, formData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }

        console.log("product upload/update response: ", response)

        if (response.status === 201 || response.status === 200) {
          toast.success(editingProduct ? "Product updated successfully!" : "Product uploaded successfully!");
          resetForm();
          setSelectedImage(null);
          setImagePreview(null);
          setEditingProduct(null);
          fetchProducts(); // Refresh the products list
        } else {
          throw new Error(response.data.message || `Failed to ${editingProduct ? 'update' : 'upload'} product.`);
        }

      } catch (error) {
        console.error("Error with product operation:", error)
        if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
          logout()
          toast.error("Session expired. Please login again.")
        } else {
          toast.error(error.response?.data?.message || `Error ${editingProduct ? 'updating' : 'uploading'} product`)
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

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/allproducts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("fetch res", response)

      if (response.status === 200) {
        setProducts(response.data.products || response.data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
        logout();
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Error fetching products");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(`${API_URL}/api/deleteproducts/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200 || response.status === 204) {
          toast.success("Product deleted successfully!");
          fetchProducts(); // Refresh the products list
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
          logout();
          toast.error("Session expired. Please login again.");
        } else {
          toast.error("Error deleting product");
        }
      }
    }
  };

  // Edit product


  // Cancel edit
  const handleCancelEdit = () => {
    setEditingProduct(null);
    formik.resetForm();
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Product Upload Form */}
      <div className="shadow-sm rounded-xl bg-white overflow-x-auto md:p-8 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingProduct ? "Edit Product" : "Upload New Product"}
          </h2>
          {editingProduct && (
            <button
              onClick={handleCancelEdit}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Cancel Edit
            </button>
          )}
        </div>

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
              Image {editingProduct && "(Upload new image to replace current)"}
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
                    {selectedImage ? selectedImage.name : editingProduct ? "Current image set" : "No file chosen"}
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
            {formik.touched.product_image && formik.errors.product_image && !editingProduct && (
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
              {formik.isSubmitting
                ? (editingProduct ? "Updating..." : "Uploading...")
                : (editingProduct ? "Update Product" : "Upload Product")
              }
            </button>

          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className="shadow-sm rounded-xl bg-white overflow-x-auto md:p-8 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">All Products</h2>
          <button
            onClick={fetchProducts}
            className="bg-pryClr/10 text-pryClr px-4 py-2 rounded-lg hover:bg-pryClr/20 transition-colors"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No products found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Image</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Point Value</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {product.product_image ? (
                        <img
                          src={
                            product.product_image.startsWith("http")
                              ? product.product_image
                              : `${IMAGE_BASE_URL}/${product.product_image}`
                          }
                          alt={product.product_name}
                          className="h-10 w-10 object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = assets.placeholderImage;
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No img</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {product.product_name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      ${product.price}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {product.product_pv}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {product.in_stock}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-pryClr hover:text-pryClr/70 p-1 rounded"
                          title="Delete Product"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductUpload;