import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import CartCards from '../../components/cards/CartCards';
import assets from '../../assets/assests'; // Assuming this is for generic assets, might not be used here
import { formatterUtility } from '../../utilities/Formatterutility';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Modal from '../../components/modals/Modal';
import { useUser } from '../../context/UserContext';
import axios from 'axios'; // Import axios for API calls
import { toast } from 'sonner'; // Import toast for notifications

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Cart = () => {
    const { user, token, logout } = useUser();
    const { cartItems, subtotal, dispatch } = useCart();
    const [pin, setPin] = useState(['', '', '', '']);
    const [showPinModal, setShowPinModal] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);
    
    const navigate = useNavigate();

    const handleIncrement = (product) => {
        dispatch({ type: 'INCREMENT_PRODUCT', payload: product });
    };

    const handleDecrement = (product) => {
        dispatch({ type: 'DECREMENT_PRODUCT', payload: product });
    };

    const handleRemove = (product) => {
        dispatch({ type: 'REMOVE_PRODUCT', payload: product });
    };
    
    const handleClearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    if (cartItems.length === 0) {
        return (
            <div className='flex flex-col gap-2 justify-center items-center min-h-[400px]'>
                <h3 className='text-2xl font-semibold'>Your cart is empty.</h3>
                <Link
                    to="/user/products"
                    className="bg-pryClr text-secClr px-8 py-2 rounded-lg"
                >Shop</Link>
            </div>
        );
    }

    const handleCheckOut = async () => {
        setIsPurchasing(true);
        const toastId = toast.loading("Processing your order..."); // Show loading toast

        try {
            // 1. Construct the payload based on your backend API's requirements
            const productsPayload = cartItems.map(item => ({
                product_id: item.id || item._id, // Use item.id or item._id as per your product structure
                quantity: item.quantity
            }));

            console.log("productsPayload", productsPayload)

            const payload = {
                user_id: user.id,
                products: productsPayload,
                stockist_id: user.stockist,
                method: "manual"
            };

            console.log("final payload", payload)

            const response = await axios.post(`${API_URL}/api/buy-product`, payload, {
                headers: {
                    "Authorization": `Bearer ${token}`, // Include the authorization token
                    "Content-Type": "application/json"
                }
            });

            console.log("response", response)

            if (response.status === 200) {
                toast.success(response.data.message || "Order placed successfully!", { id: toastId });
                dispatch({ type: 'CLEAR_CART' });
                setShowPinModal(false);
                setPin(['', '', '', '']);
                navigate('/user/transactions');
            } else {
                throw new Error(response.data.message || "Failed to place order.");
            }

        } catch (error) {
            if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
                logout(); // Log out if session expired
                toast.error("Session expired. Please login again.", { id: toastId });
            } else {
                console.error("Error during checkout:", error);
                toast.error(error.response?.data?.message || "An error occurred during checkout.", { id: toastId });
            }
        } finally {
            setIsPurchasing(false); // End purchasing state regardless of outcome
        }
    };

    const handlePinChange = (index, value) => {
        if (value === '' || /^[0-9]$/.test(value)) {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            // Automatically focus next input
            if (value && index < 3) {
                document.getElementById(`pin-input-${index + 1}`).focus();
            }
            // If deleting, focus previous input
            if (e.key === 'Backspace' && value === '' && index > 0) {
                document.getElementById(`pin-input-${index - 1}`).focus();
            }
        }
    };

    const isPinComplete = pin.every(digit => digit !== '');

    return (
        <div className="flex lg:flex-row flex-col items-start gap-6">
            <div className='lg:w-2/3 w-full py-4 bg-white rounded-lg shadow-sm'>
                {cartItems.map(item => (
                    <CartCards 
                        key={item.id} 
                        cartItem={item} 
                        handleDecrement={handleDecrement}
                        handleIncrement={handleIncrement}
                        handleRemove={handleRemove}
                    />
                ))}
                <button 
                    onClick={handleClearCart}
                    className='w-full mt-6 underline text-pryClr'
                >Clear Cart</button>
            </div>
            <div className="lg:w-1/3 w-full bg-white py-4 rounded-lg shadow-sm">
                <h3 className='text-xl font-bold mb-4 px-4'>Order Summary</h3>
                <ul className='space-y-4 px-4'>
                    <li className='flex items-center justify-between font-semibold'>
                        <span>Item</span>
                        <span>{cartItems.length}</span>
                    </li>
                    <li className='flex items-center justify-between font-semibold'>
                        <span>Subtotal</span>
                        <span>{formatterUtility(Number(subtotal))}</span>
                    </li>
                </ul>
                <li className='flex items-center justify-between font-semibold bg-pryClr/50 p-4 my-4'>
                    <span>Total</span>
                    <span>{formatterUtility(Number(subtotal))}</span>
                </li>
                <div className="px-4">
                    <button
                        onClick={() => setShowPinModal(true)}
                        disabled={cartItems.length === 0}
                        className='w-full h-[50px] bg-pryClr rounded-lg text-secClr cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    >Checkout</button>
                </div>
            </div>

            {showPinModal && (
                <Modal onClose={() => {
                    setShowPinModal(false);
                    setPin(['', '', '', '']); // Reset PIN on modal close
                    setIsPurchasing(false); // Reset purchasing state if modal is closed prematurely
                }}>
                    <div className='w-full text-center'>
                        <h3 className='text-2xl font-bold'>Confirm Transaction</h3>
                        <p className='md:text-base text-xs'>Enter your pin to complete this transaction</p>
                        <div className="w-full flex justify-center md:gap-8 gap-4 px-4 mt-8">
                            {[0, 1, 2, 3].map((index) => (
                                <input
                                    key={index}
                                    type="password"
                                    maxLength={1}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={pin[index]}
                                    onChange={(e) => handlePinChange(index, e.target.value)}
                                    className="w-14 h-14 md:w-16 md:h-16 bg-[#D9D9D9] rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#2F5318] border border-gray-300"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Backspace' && !e.target.value && index > 0) {
                                            document.getElementById(`pin-input-${index - 1}`).focus();
                                        }
                                    }}
                                    id={`pin-input-${index}`}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleCheckOut}
                            disabled={!isPinComplete || isPurchasing}
                            className={`mt-8 bg-pryClr text-secClr font-medium lg:w-1/2 w-full h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isPurchasing ? "Confirming..." : "Confirm"}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Cart;