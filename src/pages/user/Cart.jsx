import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import CartCards from '../../components/cards/CartCards';
import assets from '../../assets/assests';
import { formatterUtility } from '../../utilities/Formatterutility';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../../components/modals/Modal';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Cart = () => {
    const { user, token, logout } = useUser();
    const { cartItems, subtotal, dispatch } = useCart();
    const [pin, setPin] = useState(['', '', '', '']);
    const [showPinModal, setShowPinModal] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [selectedStockist, setSelectedStockist] = useState(""); // Stores the ID of the selected stockist
    const [showStockistSelectModal, setShowStockistSelectModal] = useState(false);
    const [stockists, setStockists] = useState([]);
    const [isFetchingStockists, setIsFetchingStockists] = useState(false);

    const navigate = useNavigate();

    // Handlers for cart item manipulation
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

    // If cart is empty, show a message and a link to shop
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

    // Function to fetch the list of stockists
    const fetchStockist = async () => {
        setIsFetchingStockists(true);
        try {
            const response = await axios.get(`${API_URL}/api/stockists`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log("stockists response", response);
            if (response.status === 200 && response.data.success) {
                console.log(response.data.data.data);
                setStockists(response.data.data.data);
            } else {
                toast.error(response.data.message || "Failed to fetch stockists.");
            }
        } catch (error) {
            if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
                 logout(); // Log out if unauthenticated
                 toast.error("Session expired. Please login again.");
            } else {
                console.error("An error occurred fetching stockists", error);
                toast.error(error.response?.data?.message || "An error occurred fetching stockists");
            }
        } finally {
            setIsFetchingStockists(false);
        }
    };

    // Fetch stockists when component mounts or token changes
    useEffect(() => {
        if (token) {
            fetchStockist();
        }
    }, [token, logout]); // Added logout to dependency array to avoid lint warning

    // Function to handle the final checkout process after PIN confirmation
    const handleFinalCheckOut = async () => {
        if (!selectedStockist) {
            toast.error("Please select a stockist.");
            return;
        }
        if (!isPinComplete) {
            toast.error("Please enter a complete PIN.");
            return;
        }

        setIsPurchasing(true);
        const toastId = toast.loading("Processing your order...");

        try {
            // Construct the payload for the backend API
            const productsPayload = cartItems.map(item => ({
                product_id: item.id || item._id, // Ensure correct ID is used
                quantity: item.quantity,
            }));

            const payload = {
                user_id: user.id,
                stockist_id: selectedStockist, // Use the selected stockist ID
                products: productsPayload,
                method: "manual", // Assuming manual for this flow
                pin: pin.join('') // Include the collected PIN
            };

            console.log("final payload", payload);

            const response = await axios.post(`${API_URL}/api/buy-product`, payload, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            console.log("response", response);

            if (response.status === 200) {
                toast.success(response.data.message || "Order placed successfully!", { id: toastId });
                dispatch({ type: 'CLEAR_CART' }); // Clear cart on successful order
                setShowPinModal(false); // Close PIN modal
                setPin(['', '', '', '']); // Reset PIN
                navigate('/user/transactions'); // Redirect to transactions page
            } else {
                throw new Error(response.data.message || "Failed to place order.");
            }

        } catch (error) {
            if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
                logout();
                toast.error("Session expired. Please login again.", { id: toastId });
            } else {
                console.error("Error during checkout:", error);
                toast.error(error.response?.data?.message || "An error occurred during checkout.", { id: toastId });
            }
        } finally {
            setIsPurchasing(false);
        }
    };

    // Handle PIN input changes
    const handlePinChange = (index, value) => {
        if (value === '' || /^[0-9]$/.test(value)) {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            // Automatically focus next input or previous on backspace
            if (value && index < 3) {
                document.getElementById(`pin-input-${index + 1}`).focus();
            } else if (!value && index > 0) { // Only move back on empty value if backspace
                 document.getElementById(`pin-input-${index - 1}`).focus();
            }
        }
    };

    // Check if PIN is complete (all 4 digits entered)
    const isPinComplete = pin.every(digit => digit !== '');

    // Function to proceed from stockist selection to PIN entry
    const handleProceedToPinEntry = () => {
        if (!selectedStockist) {
            toast.error("Please select a stockist to proceed.");
            return;
        }
        setShowStockistSelectModal(false); // Close stockist modal
        setShowPinModal(true); // Open PIN modal
    };

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
                        <span>Items</span>
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
                        onClick={() => setShowStockistSelectModal(true)} // Open stockist modal first
                        disabled={cartItems.length === 0}
                        className='w-full h-[50px] bg-pryClr rounded-lg text-secClr cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    >Checkout</button>
                </div>
            </div>

            {/* Stockist Selection Modal */}
            {showStockistSelectModal && (
                <Modal onClose={() => {
                    setShowStockistSelectModal(false);
                    setSelectedStockist(""); // Reset selected stockist on modal close
                }}>
                    <div className='w-full'>
                        <h3 className='md:text-2xl text-xl font-semibold text-center mb-6'>Stockist Preference</h3>
                        <select
                            id='stockist'
                            name='stockist'
                            value={selectedStockist}
                            disabled={isFetchingStockists}
                            onChange={(e) => setSelectedStockist(e.target.value)}
                            className={`h-12 w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                            <option value='' disabled>Select Stockist</option>
                            {isFetchingStockists ? (
                                <option disabled>Loading stockists...</option>
                            ) : stockists.length > 0 ? (
                                stockists.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item?.username} ({item?.stockist_location || 'N/A'})
                                    </option>
                                ))
                            ) : (
                                <option disabled>No stockists available</option>
                            )}
                        </select>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleProceedToPinEntry} // Proceed to PIN entry
                                disabled={!selectedStockist || isFetchingStockists}
                                className={`mt-8 bg-pryClr text-secClr font-medium lg:w-1/2 w-full h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                Proceed to PIN
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* PIN Entry Modal */}
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
                                    onKeyDown={(e) => { // Added onKeyDown for backspace logic
                                        if (e.key === 'Backspace' && !e.target.value && index > 0) {
                                            document.getElementById(`pin-input-${index - 1}`).focus();
                                        }
                                    }}
                                    className="w-14 h-14 md:w-16 md:h-16 bg-[#D9D9D9] rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#2F5318] border border-gray-300"
                                    id={`pin-input-${index}`}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleFinalCheckOut} // Call the final checkout function here
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