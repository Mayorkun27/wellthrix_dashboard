import React, { useState, useEffect } from "react";
import assets from "../../assets/assests";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import { formatterUtility } from "../../utilities/Formatterutility";
import { FaEdit } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_BASE_URL || "";
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || "";

const ProductUpload = () => {
  const { token, logout } = useUser();
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
      product_name: Yup.string()
        .trim()
        .when([], {
          is: () => !editingProduct,
          then: (schema) => schema.required("Product name is required").min(1, "Product name cannot be empty"),
          otherwise: (schema) => schema.min(0).optional(),
        }),
      price: Yup.number()
        .when([], {
          is: () => !editingProduct,
          then: (schema) => schema.required("Price is required").min(0, "Price must be positive"),
          otherwise: (schema) => schema.min(0).optional(),
        })
        .typeError("Price must be a number"),
      product_pv: Yup.number()
        .when([], {
          is: () => !editingProduct,
          then: (schema) => schema.required("Point value is required").min(0, "Point value must be positive"),
          otherwise: (schema) => schema.min(0).optional(),
        })
        .typeError("Point value must be a number"),
      in_stock: Yup.number()
        .when([], {
          is: () => !editingProduct,
          then: (schema) => schema.required("Stock quantity is required").min(0, "Stock must be positive"),
          otherwise: (schema) => schema.min(0).optional(),
        })
        .typeError("Stock quantity must be a number"),
      product_description: Yup.string().nullable(),
      product_image: Yup.mixed().when([], {
        is: () => !editingProduct,
        then: (schema) => schema.required("Product image is required"),
        otherwise: (schema) => schema.nullable(),
      }),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      console.log("Form values before submission:", values);

      try {
        const formData = new FormData();
        // In edit mode, include existing product data for unchanged fields
        if (editingProduct) {
          formData.append("product_name", values.product_name?.trim() || editingProduct.product_name?.trim() || "");
          formData.append("price", values.price != null ? values.price : editingProduct.price != null ? editingProduct.price : 0);
          formData.append("product_pv", values.product_pv != null ? values.product_pv : editingProduct.product_pv != null ? editingProduct.product_pv : 0);
          formData.append("in_stock", values.in_stock != null ? values.in_stock : editingProduct.in_stock != null ? editingProduct.in_stock : 0);
          formData.append("product_description", values.product_description || editingProduct.product_description || "");
        } else {
          formData.append("product_name", values.product_name?.trim() || "");
          formData.append("price", values.price || 0);
          formData.append("product_pv", values.product_pv || 0);
          formData.append("in_stock", values.in_stock || 0);
          formData.append("product_description", values.product_description || "");
        }

        if (values.product_image) {
          formData.append("product_image", values.product_image);
        }

        // Debug: Log FormData contents
        const formDataEntries = {};
        for (let [key, value] of formData.entries()) {
          formDataEntries[key] = value instanceof File ? value.name : value;
        }
        console.log("FormData contents:", formDataEntries);

        const endpoint = editingProduct
          ? `${API_URL}/api/updateproduct/${editingProduct.id}`
          : `${API_URL}/api/products`;
        console.log("Requesting:", endpoint);

        let response;
        if (editingProduct) {
          response = await axios.put(endpoint, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          response = await axios.post(endpoint, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
        }

        console.log("Product upload/update response:", response.data);

        if (response.status === 201 || response.status === 200) {
          toast.success(editingProduct ? "Product updated successfully!" : "Product uploaded successfully!");
          resetForm();
          setSelectedImage(null);
          setImagePreview(null);
          setEditingProduct(null);
          fetchProducts();
        } else {
          throw new Error(response.data.message || `Failed to ${editingProduct ? "update" : "upload"} product.`);
        }
      } catch (error) {
        console.error("Error with product operation:", error.response || error);
        if (error.response?.data?.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat().join(", ");
          toast.error(errorMessages || `Error ${editingProduct ? "updating" : "uploading"} product`);
        } else if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
          logout();
          toast.error("Session expired. Please login again.");
        } else {
          toast.error(error.response?.data?.message || `Error ${editingProduct ? "updating" : "uploading"} product`);
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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/allproducts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetch products response:", response.data);
      console.log("Products data:", response.data.products || response.data);

      if (response.status === 200) {
        setProducts(response.data.products || response.data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error.response || error);
      if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
        logout();
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(error.response?.data?.message || "Error fetching products");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(`${API_URL}/api/deleteproducts/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 || response.status === 204) {
          toast.success("Product deleted successfully!");
          fetchProducts();
        }
      } catch (error) {
        console.error("Error deleting product:", error.response || error);
        if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
          logout();
          toast.error("Session expired. Please login again.");
        } else {
          toast.error(error.response?.data?.message || "Error deleting product");
        }
      }
    }
  };

  const handleEdit = (product) => {
    console.log("Editing product:", product);
    setEditingProduct(product);
    formik.setValues({
      product_name: product.product_name?.trim() || "",
      price: product.price != null ? product.price : 0,
      product_pv: product.product_pv != null ? product.product_pv : 0,
      product_description: product.product_description || "",
      in_stock: product.in_stock != null ? product.in_stock : 0,
      product_image: null,
    });
    setImagePreview(product.product_image ? `${IMAGE_BASE_URL}/${product.product_image}` : null);
    setSelectedImage(null);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    formik.resetForm();
    setSelectedImage(null);
    setImagePreview(null);
  };

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
              type="text"
              id="productName"
              name="product_name"
              value={formik.values.product_name}
              onChange={(e) => {
                formik.handleChange(e);
                console.log("Product name changed:", e.target.value);
              }}
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
              type="number"
              id="price"
              name="price"
              value={formik.values.price}
              onChange={(e) => {
                formik.handleChange(e);
                console.log("Price changed:", e.target.value);
              }}
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
              type="number"
              id="pointValue"
              name="product_pv"
              value={formik.values.product_pv}
              onChange={(e) => {
                formik.handleChange(e);
                console.log("Product PV changed:", e.target.value);
              }}
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
              type="number"
              id="inStock"
              name="in_stock"
              value={formik.values.in_stock}
              onChange={(e) => {
                formik.handleChange(e);
                console.log("In stock changed:", e.target.value);
              }}
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
              disabled={formik.isSubmitting || (!editingProduct && !formik.isValid)}
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
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Image</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Price</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Point Value</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Stock</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 min-w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 text-center">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <img
                          src={`${IMAGE_BASE_URL}/${product.product_image}`}
                          alt={product.product_name}
                          className="h-full w-full object-contain rounded"
                          onError={(e) => {
                            console.error("Image load error:", `${IMAGE_BASE_URL}/${product.product_image}`);
                            e.target.src = "https://via.placeholder.com/150?text=Image+Not+Found";
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {product.product_name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatterUtility(product.price)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {product.product_pv}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {product.in_stock}
                    </td>
                    <td className="py-3 px-4 min-w-[100px]">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-pryClr hover:text-pryClr/70 p-2 rounded"
                          title="Edit Product"
                        >
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-pryClr hover:text-pryClr/70 p-2 rounded"
                          title="Delete Product"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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