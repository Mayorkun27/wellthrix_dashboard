import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';
import { formatterUtility } from '../../../utilities/formatterutility';
import { RxTrash } from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import { RiSubtractLine } from "react-icons/ri";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const StepTwo = ({ prevStep, nextStep, formData, updateFormData, sessionId }) => {
  const { token, logout } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const packagePrice = useMemo(() => Number(formData.selectedPackage?.price) || 0, [formData.selectedPackage]);

  const totalSelectedPrice = useMemo(() => {
    return selectedProducts.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  }, [selectedProducts]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/allproducts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setProducts(response.data.products || response.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (error.response?.data?.message?.toLowerCase().includes('unauthenticated')) {
          logout();
          toast.error('Session expired. Please login again.');
        } else {
          toast.error(error.response?.data?.message || 'Error loading products');
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProducts();
    }
  }, [token, logout]);

  const handleIncrement = (product) => {
    const newTotal = totalSelectedPrice + Number(product.price);
    if (newTotal > packagePrice) {
      toast.error("Total product value cannot exceed the package price.");
      return;
    }

    setSelectedProducts(prev => {
      const existingProduct = prev.find(item => item.id === product.id);
      if (existingProduct) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleDecrement = (product) => {
    setSelectedProducts(prev => {
      const existingProduct = prev.find(item => item.id === product.id);
      if (existingProduct) {
        if (existingProduct.quantity > 1) {
          return prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
          );
        } else {
          return prev.filter(item => item.id !== product.id);
        }
      }
      return prev;
    });
  };

  const handleRemove = (product) => {
    setSelectedProducts(prev => prev.filter(item => item.id !== product.id));
    toast.success(`${product.product_name} removed from the list.`);
  };

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please pick at least one product before continuing.');
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading('Saving selections...');

    const payload = {
      products: selectedProducts.map(p => ({
        product_id: p.id,
        quantity: p.quantity,
      })),
    };

    try {
      const response = await axios.post(`${API_URL}/api/registration/step-2`, payload, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": `application/json`,
          'Content-Type': 'application/json',
          "X-Session-ID": sessionId,
        },
      });

      if (response.status === 200 && response.data.success) {
        toast.success(response.data.message || 'Products saved successfully', { id: toastId });
        updateFormData({ selectedProducts });
        nextStep();
      } else {
        throw new Error(response.data.message || 'Failed to save products.');
      }
    } catch (error) {
      console.error('Failed to save products:', error);
      if (error.response?.data?.message?.includes('unauthenticated')) {
        logout();
      }
      toast.error(error.response?.data?.message || 'An error occurred saving products.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQuantity = (productId) => {
    const product = selectedProducts.find(item => item.id === productId);
    return product ? product.quantity : 0;
  };

  return (
    <div className="w-full flex flex-col gap-4 md:gap-6 mt-6">
      <div className="w-full flex flex-col gap-4 md:gap-6 rounded-2xl bg-white shadow-xl px-4 md:px-6 py-6">
        <div className="flex justify-between items-center flex-wrap gap-2">
            <p className="text-lg md:text-xl font-bold text-gray-800">
              Package Price:{' '}
              <span className="text-pryClr">{formatterUtility(packagePrice)}</span>
            </p>
            <p className="text-lg md:text-xl font-bold text-gray-800">
              Selected Total:{' '}
              <span className={`transition-colors ${totalSelectedPrice > packagePrice ? 'text-red-500' : 'text-green-500'}`}>
                {formatterUtility(totalSelectedPrice)}
              </span>
            </p>
        </div>

        {/* List of all available products */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {loading ? (
            <div className="border-4 border-t-transparent animate-spin mx-auto rounded-full w-[50px] h-[50px]"></div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-2 p-2 border border-black/10 rounded-lg">
                <div className="flex gap-3 items-center w-full">
                  <img
                    src={`${IMAGE_BASE_URL}/${product.product_image}`}
                    alt={`${product.product_name} image`}
                    className="w-[60px] h-[60px] object-cover rounded-md bg-gray-100"
                  />
                  <div className="flex flex-col w-full">
                    <h4 className="font-bold text-pryClr">{product.product_name}</h4>
                    <p className='text-sm'>{formatterUtility(Number(product.price))}</p>
                  </div>
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleDecrement(product)}
                      className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                    >
                      <RiSubtractLine />
                    </button>
                    <p className="border-x border-black w-10 h-8 flex items-center justify-center font-semibold">
                      {getQuantity(product.id)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleIncrement(product)}
                      className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                    >
                      <GoPlus />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No products found</p>
          )}
        </div>

        {/* Display selected products for confirmation */}
        {selectedProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:items-center border-t pt-4 mt-4">
                <h3 className='text-xl font-bold'>Your Selection</h3>
                {selectedProducts.map((product) => (
                    <div key={product.id} className='flex items-center justify-between p-2 rounded-lg bg-pryClr/5'>
                        <div className='flex items-center gap-3'>
                            <img src={`${IMAGE_BASE_URL}/${product.product_image}`} alt={product.product_name} className='w-12 h-12 rounded-md object-cover' />
                            <div>
                                <p className='font-semibold'>{product.product_name}</p>
                                <p className='text-sm'>{formatterUtility(Number(product.price))} x {product.quantity}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            <p className='font-bold'>{formatterUtility(Number(product.price) * product.quantity)}</p>
                            <button onClick={() => handleRemove(product)} className='text-red-500 hover:text-red-700'>
                                <RxTrash size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={prevStep}
            className="text-xl bg-black hover:bg-black/80 rounded-lg cursor-pointer text-secClr px-6 py-3 transition-colors"
            aria-label="Go back to previous step"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || selectedProducts.length === 0 || totalSelectedPrice > packagePrice}
            className="text-xl bg-pryClr rounded-xl text-white px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Submit and proceed to next step"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                </svg>
                Loading...
              </span>
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
