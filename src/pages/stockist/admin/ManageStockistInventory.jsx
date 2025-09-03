import React, { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import Modal from "../../../components/modals/Modal";
import { toast } from "sonner";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import Inventory from "../user/Inventory";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoTrashBinOutline } from "react-icons/io5";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ManageStockistInventory = () => {
    const { token, logout } = useUser();
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const { id } = useParams()
    const [searchParams] = useSearchParams();
    const username = searchParams.get('username');

    const fetchProducts = async () => {
    setLoading(true)
    try {
        const response = await axios.get(`${API_URL}/api/allproducts`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
        })

        console.log("Products Response:", response)

        if (response.status === 200) {
        setProducts(response.data.products || response.data)
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
        setLoading(false)
    }
    }
    
    useEffect(() => {
    if (token) {
        fetchProducts()
    }
    }, [token])

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddProduct = () => {
        const { product_name, quantity } = formik.values;
        if (!product_name || !quantity) {
            toast.error("Please select a product and enter a quantity.");
            return;
        }

        const existingProductIndex = selectedProducts.findIndex(p => p.product_name === product_name);

        if (existingProductIndex > -1) {
            const updatedProducts = [...selectedProducts];
            const newQuantity = updatedProducts[existingProductIndex].quantity + parseInt(quantity, 10);
            updatedProducts[existingProductIndex] = { ...updatedProducts[existingProductIndex], quantity: newQuantity };
            setSelectedProducts(updatedProducts);
            toast.success(`Updated quantity for ${product_name}`);
        } else {
            setSelectedProducts(prev => [...prev, { product_name, quantity: parseInt(quantity, 10) }]);
            toast.success(`${product_name} added to the list.`);
        }

        formik.resetForm();
    };

    const handleRemoveProduct = (productNameToRemove) => {
        setSelectedProducts(prev => prev.filter(p => p.product_name !== productNameToRemove));
        toast.error(`${productNameToRemove} has been removed.`);
    };

    const handleDistribute = async () => {
        if (selectedProducts.length === 0) {
            toast.error("Please add products to the list before distributing.");
            return;
        }
        setIsSubmitting(true);
        const toastId = toast.loading("Distributing products...");

        const payload = {
            products: selectedProducts
        };

        try {
            const response = await axios.post(`${API_URL}/api/upgrade-stockist-products/${id}`, payload, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message || `Products distributed successfully`, { id: toastId });
                setSelectedProducts([]);
                setRefreshTrigger(prev => !prev);
            } else {
                throw new Error(response.data.message || `Failed to distribute products.`);
            }
        } catch (error) {
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            console.error(`Failed to distribute products:`, error);
            toast.error(error.response?.data?.message || `An error occurred distributing products.`, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            product_name: "",
            quantity: ""
        },
        validationSchema: Yup.object({
            product_name: Yup.string().required("Product is required"),
            quantity: Yup.number().required("Quantity is required").min(1, "Quantity must be at least 1"),
        }),
        onSubmit: () => {
            // This is intentionally left blank, 
            // submission is handled by handleDistribute
        }
    });

    return (
        <div className="grid gap-6">
            <div className="flex items-center gap-2">
                <Link
                    to={`/stockist/admin/managestockist`}
                    title={`Back to manage stockist`}
                    className="text-pryClr text-xl cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-pryClr/10 transition-all duration-300 rounded-lg"
                >
                    <FaArrowLeftLong />
                </Link>
                <span className="font-medium">Go back</span>
            </div>
            <div className="shadow-sm rounded-lg bg-white overflow-x-auto p-6">
                <h3 className="text-2xl font-bold text-black/60">{username}&apos;s Inventory</h3>
                <Inventory stockistId={id} refetch={refreshTrigger} />
            </div>
            <div className="shadow-sm rounded-lg bg-white overflow-x-auto p-8">
                <h3 className="text-2xl font-bold text-black/60 mb-5">Distribute products</h3>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                    <div className="space-y-1">
                        <label className="block text-sm" htmlFor="product_name">Pick a product</label>
                        <select
                            name="product_name"
                            id="product_name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.product_name}
                            className="w-full p-3 border rounded-lg border-gray-300 outline-0 capitalize"
                        >
                            <option value="" disabled>Select a product</option>
                            {products.length > 0 ? (
                                products.map((product, index) => (
                                    <option key={index} value={product?.product_name}>{product?.product_name}</option>
                                ))
                            ) : (
                                <option disabled>No product found</option>
                            )}
                        </select>
                        {formik.touched.product_name && formik.errors.product_name && (<p className="text-red-600 text-sm">{formik.errors.product_name}</p>)}
                    </div>
                    <div className="flex items-end gap-4">
                        <div className="space-y-1 w-full">
                            <label className="block text-sm" htmlFor="quantity">
                                Enter quantity
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                id="quantity"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.quantity}
                                className="w-full p-3 border rounded-lg border-gray-300 outline-0"
                            />
                            {formik.touched.quantity && formik.errors.quantity && (<p className="text-red-600 text-sm">{formik.errors.quantity}</p>)}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddProduct}
                            className="bg-pryClr h-[50px] px-4 rounded-lg text-secClr font-medium whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={!formik.values.product_name || !formik.values.quantity || !formik.isValid}
                        >
                            Add Product
                        </button>
                    </div>
                    <div className="md:col-span-2 gap-4 border border-gray-300 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold mb-2 text-black/80">Products to Distribute</h4>
                        {selectedProducts.length > 0 ? (
                            <ul className="space-y-2">
                                {selectedProducts.map((product, index) => (
                                    <li key={index} className="flex justify-between items-center p-3 bg-pryClr/10 rounded">
                                        <span>{product.product_name} - <strong>Qty: {product.quantity}</strong></span>
                                        <button
                                            type="button"
                                            title={`Remove ${product.product_name}`}
                                            onClick={() => handleRemoveProduct(product.product_name)}
                                            className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                                        >
                                            <IoTrashBinOutline />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No products added yet.</p>
                        )}
                    </div>
                    <div className="md:col-span-2 text-center">
                        <button
                            type="button"
                            className="bg-pryClr text-secClr md:w-1/2 w-full py-3 rounded font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleDistribute}
                            disabled={isSubmitting || selectedProducts.length === 0}
                        >
                            {isSubmitting ? "Distributing..." : "Distribute products"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageStockistInventory;
