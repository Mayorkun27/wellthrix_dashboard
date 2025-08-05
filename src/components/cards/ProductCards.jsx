import React, { useState } from "react";
import { formatterUtility } from "../../utilities/Formatterutility";
import { Link } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
import Modal from "../modals/Modal";

const ProductCards = (props) => {

    const [selectedProduct, setSelectedProduct] = useState(null)
    const dollarRate = 1000;

    return (
        <>
            <div className="bg-white shadow-md rounded-xl md:p-4 p-5 overflow-hidden w-full">
                <div className="w-full h-[200px] bg-pryClr/15 rounded-lg flex items-center justify-center">
                    <img
                        src={props.image}
                        alt={props.name + " image"}
                        className="w-[90%] h-[90%] object-scale-down mx-auto"
                    />
                </div>
                <div className="md:mt-4 mt-6 lg:h-[calc(100%-215px)] md:h-[calc(100%-220px)] flex flex-col justify-between">
                    <div className="leading-1">
                        <h3 className="font-bold text-base text-pryClr">{props.name}</h3>
                        {props.price && (
                            <div className="font-semibold text-[#EC3030CC] flex md:items-start items-center md:pb-0 pb-1 gap-2 md:text-sm">
                                <span>{formatterUtility(Number(props.price))}</span>
                                <span>&#40;&#36;{formatterUtility(Number(props.price / dollarRate), true)}&#41;</span>
                                <span>- {props.pv}PV</span>
                            </div>
                        )}
                        {props.purchaseCondition && (
                            <small className="font-semibold text-[10px] text-pryClr">
                                Available Only on Repurchase
                            </small>
                        )}
                    </div>
                    <div className="md:mt-4 mt-6 font-semibold flex items-center justify-between">
                        <button
                            type="button"
                            className="bg-pryClr rounded-lg p-3 md:text-sm text-secClr cursor-pointer"
                            onClick={() => setSelectedProduct(props)}
                        >
                            More Details
                        </button>
                        <button
                            type="button"
                            className="bg-pryClr rounded-lg p-3 md:text-sm text-secClr cursor-pointer"
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
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                            <div className="w-full h-[200px] bg-pryClr/15 rounded-lg flex items-center justify-center">
                                <img 
                                    src={props.image} 
                                    alt={props.name + " image"}
                                    className="w-[90%] h-[90%] object-scale-down mx-auto" 
                                />
                            </div>
                            <div className="grid">
                                <ul>
                                    <li>{props.name}</li>
                                    <li>{formatterUtility(Number(props.price))}</li>
                                    <li>{props.pv}</li>
                                    <li>{props.purchaseCondition}</li>
                                </ul>
                            </div>
                        </div>
                    </Modal>
                )
            }
        </>
    );
};

export default ProductCards;
