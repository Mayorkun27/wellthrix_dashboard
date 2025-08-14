import React from 'react'
import { RxTrash } from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import { RiSubtractLine } from "react-icons/ri";
import { formatterUtility } from '../../utilities/Formatterutility';

const API_URL = import.meta.env.VITE_API_BASE_URL

const CartCards = ({ cartItem, handleIncrement, handleDecrement, handleRemove }) => {
    return (
        <div className='flex items-center justify-between py-2 md:px-6 px-4 border-b border-black/20 last:bordeer-b-0'>
            <div className="md:hidden flex flex-col items-center border rounded-lg overflow-hidden">
                <button 
                    onClick={() => handleDecrement(cartItem)}
                    className='w-8 h-8 flex items-center justify-center cursor-pointer'
                >
                    <RiSubtractLine />
                </button>
                <p className='border-y border-black w-8 h-8 flex items-center justify-center'>{cartItem.quantity}</p>
                <button 
                    onClick={() => handleIncrement(cartItem)}
                    className='w-8 h-8 flex items-center justify-center cursor-pointer'
                >
                    <GoPlus />
                </button>
            </div>
            <div className="flex gap-4 items-center w-[70%]">
                <div className="flex items-center gap-3 md:w-[80%] w-full md:ms-0 ms-2">
                    <div className="bg-pryClr/15 w-[70px] md:h-[60px] h-[90px] rounded-lg flex items-center justify-center">
                        <img 
                            src={`${API_URL}/${cartItem.product_image}`}
                            alt={cartItem.product_name + " image"} 
                            className="w-[90%] h-[90%] object-scale-down mx-auto"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h4 className='w-full leading-5 text-pryClr font-bold'>{cartItem.product_name}</h4>
                        <p className='md:hidden inline-flex'>{formatterUtility(Number(cartItem.price)*Number(cartItem.quantity))}</p>
                    </div>
                </div>
                <div className="md:flex hidden ms-auto items-center border rounded-lg overflow-hidden">
                    <button 
                        onClick={() => handleDecrement(cartItem)}
                        className='w-8 h-8 flex items-center justify-center cursor-pointer'
                    >
                        <RiSubtractLine />
                    </button>
                    <p className='border-x border-black w-8 h-8 flex items-center justify-center'>{cartItem.quantity}</p>
                    <button 
                        onClick={() => handleIncrement(cartItem)}
                        className='w-8 h-8 flex items-center justify-center cursor-pointer'
                    >
                        <GoPlus />
                    </button>
                </div>
            </div>
            <p className='md:inline-flex hidden'>{formatterUtility(Number(cartItem.price)*Number(cartItem.quantity))}</p>
            <button 
                onClick={() => handleRemove(cartItem)}
                className='text-2xl cursor-pointer w-10 h-10 rounded-lg hover:bg-pryClr/20 transition-all duration-300 flex items-center justify-center'
                title={`Remove ${cartItem.product_name} from cart`}
            >
                <RxTrash />
            </button>
        </div>
    )
}

export default CartCards