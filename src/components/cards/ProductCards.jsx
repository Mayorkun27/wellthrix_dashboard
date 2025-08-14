import React, { useState } from "react";
import { formatterUtility } from "../../utilities/Formatterutility";
import Modal from "../modals/Modal";
import { useCart } from "../../context/CartContext";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL

const ProductCards = ({ product }) => {

    const [selectedProduct, setSelectedProduct] = useState(null)
    const dollarRate = 1000;
    const isAvailable = product.in_stock > product.total_sold

    const { dispatch } = useCart();

    const handleAddToCart = () => {
        dispatch({ type: 'ADD_PRODUCT', payload: product });
    };

    const purchaseCondition = product.product_name.toLowerCase() === "paigo oil" || product.product_name.toLowerCase() === "chandar coffee"

    return (
        <>
            <div className="bg-white shadow-md rounded-xl md:p-3 p-5 overflow-hidden w-full">
                <div className="w-full h-[180px] bg-pryClr/15 rounded-lg flex items-center justify-center">
                    <img
                        src={`${API_URL}/${product.product_image}`}
                        alt={product.product_name + " image"}
                        className="w-[90%] h-[90%] object-scale-down mx-auto"
                    />
                </div>
                <div className="md:mt-4 mt-6 lg:h-[calc(100%-215px)] md:h-[calc(100%-220px)] flex flex-col justify-between">
                    <div className="leading-1">
                        <h3 className="font-bold text-base text-pryClr capitalize">{product.product_name}</h3>
                        {product.price && (
                            <div className="font-semibold text-[#EC3030CC] flex md:items-start items-center md:pb-0 pb-1 gap-2 md:text-sm">
                                <span>{formatterUtility(Number(product.price))}</span>
                                <span>&#40;&#36;{formatterUtility(Number(product.price / dollarRate), true)}&#41;</span>
                                <span>- {product.product_pv}PV</span>
                            </div>
                        )}
                        {purchaseCondition && (
                            <small className="font-semibold text-[10px] text-pryClr">
                                Available Only on Repurchase
                            </small>
                        )}
                    </div>
                    <div className="md:mt-4 mt-6 font-semibold flex items-center justify-between">
                        <button
                            type="button"
                            className="bg-pryClr rounded-lg p-3 md:text-sm text-secClr cursor-pointer"
                            onClick={() => setSelectedProduct(product)}
                        >
                            More Details
                        </button>
                        <button
                            type="button"
                            disabled={!isAvailable}
                            className="bg-pryClr rounded-lg p-3 md:text-sm text-secClr cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleAddToCart}
                        >
                            Add To Cart
                        </button>
                    </div>
                </div>
            </div>

            {
                selectedProduct && (
                    <Modal
                        onClose={() => setSelectedProduct(null)}
                    >
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-6 items-center">
                            <h2 className="md:col-span-2 col-span-1 text-2xl font-bold text-pryClr text-center">{selectedProduct.product_name} Product Details</h2>
                            <div className="w-full h-[250px] bg-pryClr/15 rounded-lg flex items-center justify-center">
                                <img 
                                    src={`${API_URL}/${selectedProduct.product_image}`}
                                    alt={selectedProduct.product_name + " image"}
                                    className="w-[90%] h-[90%] object-scale-down mx-auto" 
                                />
                            </div>
                            <div className="text-center space-y-8">
                                <div className="text-left flex flex-col gap-2 text-sm">
                                    <p className="-space-y-1"><span className="tracking-tight block font-semibold">Product Name:</span> {selectedProduct?.product_name}</p>
                                    <p className="-space-y-1"><span className="tracking-tight block font-semibold">Product Price:</span> {formatterUtility(Number(selectedProduct.price))}</p>
                                    <p className="-space-y-1"><span className="tracking-tight block font-semibold">Product Point Value:</span> {selectedProduct?.product_pv}pv</p>
                                    <p className="-space-y-1"><span className="tracking-tight block font-semibold">Available Quantity:</span> {Number(selectedProduct.in_stock) - Number(selectedProduct.total_sold)}</p>
                                    {purchaseCondition && (
                                        <p className="-space-y-1"><span className="tracking-tight block font-semibold">Purchase Condition:</span> Available Only on Repurchase</p>
                                    )}
                                </div>
                            </div>
                            <div className="md:col-span-2 col-span-1 text-center mt-6">
                                <button
                                    type="button"
                                    disabled={!isAvailable}
                                    onClick={handleAddToCart}
                                    className="bg-pryClr rounded-lg px-4 py-3 text-secClr font-medium mx-auto md:w-1/2 w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </Modal>
                )
            }
        </>
    );
};

export default ProductCards;
