import React from 'react'
import { formatterUtility } from '../../utilities/Formatterutility';
import { Link } from 'react-router-dom';
import { GoArrowUpRight } from "react-icons/go";

const ProductCards = ({ type, image, name, price, pv, quantity, purchaseCondition, path, action }) => {
    const dollarRate = 1000;
    const outOfStock = Number(quantity) <= 0
    return (
        <>
            {
                type === "digital" ? (
                    <button 
                        className='bg-white shadow-md rounded-2xl p-3 overflow-hidden w-full cursor-pointer focus:bg-pryClr'
                    >
                        <div className="w-full h-[100px] bg-pryClr/15 rounded-xl flex items-center justify-center">
                            <img src={image} alt={name+" image"} className='w-[90%] h-[90%] object-scale-down mx-auto' />
                        </div>
                        <div className="mt-6 flex flex-col justify-between">
                            <h3 className='font-bold md:text-xl text-base text-pryClr'>{name}</h3>
                            {/* <div className="mt-4 pt-3 border-t-1 border-pryClr/25 text-pryClr font-semibold flex items-center justify-between">
                                <p className={outOfStock ? "text-[#EC3030CC]" : ""}>{outOfStock ? "Out of stock" : "In stock"}</p>
                                <Link
                                    to={path}
                                    aria-disabled={outOfStock}
                                    className="flex items-center gap-1 group cursor-pointer hover:text-pryClrDark transition-colors"
                                >
                                    <span>{type === "digital" ? "Buy Now" : "More Details"}</span>
                                    <span className="w-5 h-5 mt-1 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"><GoArrowUpRight /></span>
                                </Link>
                            </div> */}
                        </div>
                    </button>
                ) : (
                    <div className='bg-white shadow-md rounded-2xl p-5 overflow-hidden w-full'>
                        <div className="w-full lg:h-[220px] h-[200px] bg-pryClr/15 rounded-xl flex items-center justify-center">
                            <img src={image} alt={name+" image"} className='w-[90%] h-[90%] object-scale-down mx-auto' />
                        </div>
                        <div className="mt-6 lg:h-[calc(100%-240px)] md:h-[calc(100%-220px)] flex flex-col justify-between">
                            <div>
                                <h3 className='font-bold md:text-xl text-base text-pryClr'>{name}</h3>
                                {price && (
                                    <div className='font-semibold text-[#EC3030CC] flex items-center gap-2'>
                                        <span>N{formatterUtility(Number(price))}</span>
                                        <span>&#40;&#36;{formatterUtility(Number(price/dollarRate))}&#41;</span>
                                        <span>- {pv}PV</span>
                                    </div>
                                )}
                                {purchaseCondition && (
                                    <small className='font-semibold text-pryClr'>Available Only on Repurchase</small>
                                )}
                            </div>
                            <div className="mt-4 pt-3 border-t-1 border-pryClr/25 text-pryClr font-semibold flex items-center justify-between">
                                <p className={outOfStock ? "text-[#EC3030CC]" : ""}>{outOfStock ? "Out of stock" : "In stock"}</p>
                                <Link
                                    to={path}
                                    aria-disabled={outOfStock}
                                    className="flex items-center gap-1 group cursor-pointer hover:text-pryClrDark transition-colors"
                                >
                                    <span>{type === "digital" ? "Buy Now" : "More Details"}</span>
                                    <span className="w-5 h-5 mt-1 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"><GoArrowUpRight /></span>
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default ProductCards