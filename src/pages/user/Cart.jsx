import React from 'react';
import { useCart } from '../../context/CartContext';
import CartCards from '../../components/cards/CartCards';
import assets from '../../assets/assests';
import { formatterUtility } from '../../utilities/Formatterutility';

const Cart = () => {
  const { cartItems, dispatch } = useCart();

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

  // if (cartItems.length === 0) {
  //   return <div>Your cart is empty.</div>;
  // }

  const cart = [
    {
      image: assets.airtellogo,
      name: "Vitorep Herbal Drink 750ml",
      price: "20000",
      quantity: "1",
    }
  ]

  return (
    <div className="flex lg:flex-row flex-col items-start gap-6">
      <div className='lg:w-2/3 w-full py-4 bg-white rounded-lg shadow-sm'>

        {cart.map(item => (
          <CartCards key={item.id} cartItem={item} />
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
            <span>{cart.length}</span>
          </li>
          <li className='flex items-center justify-between font-semibold'>
            <span>Subtotal</span>
            <span>{formatterUtility(Number("2000000"))}</span>
          </li>
        </ul>
        <li className='flex items-center justify-between font-semibold bg-pryClr/50 p-4 my-4'>
          <span>Total</span>
          <span>{formatterUtility(Number("2000000"))}</span>
        </li>
        <div className="px-4">
          <button
            onClick={() => {}}
            className='w-full h-[50px] bg-pryClr rounded-lg text-secClr'
          >Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;