import React, { createContext, useReducer, useContext } from "react";
import { toast } from "sonner";

const CartContext = createContext();

const initialState = {
  cartItems: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_PRODUCT": {
      const productId = action.payload.id || action.payload._id;
      const existingItem = state.cartItems.find(
        (item) => item.id === productId
      );
      const availableStock =
        action.payload.in_stock - action.payload.total_sold;

      if (existingItem) {
        if (existingItem.quantity < availableStock) {
          toast.success(`${action.payload.product_name} quantity increased`);
          return {
            ...state,
            cartItems: state.cartItems.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        } else {
          toast.error("Cannot add more — stock limit reached");
          return state;
        }
      }

      if (availableStock > 0) {
        toast.success(`${action.payload.product_name} added to cart`);
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, id: productId, quantity: 1 }], // Standardize ID here
        };
      } else {
        toast.error("Out of stock");
        return state;
      }
    }

    case "INCREMENT_PRODUCT": {
      const productId = action.payload.id;
      const itemToIncrement = state.cartItems.find(
        (item) => item.id === productId
      );

      if (itemToIncrement.quantity < itemToIncrement.in_stock - itemToIncrement.total_sold) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        toast.error("Cannot add more — stock limit reached");
        return state;
      }
    }

    case "DECREMENT_PRODUCT": {
      const productId = action.payload.id || action.payload._id;

      return {
        ...state,

        cartItems: state.cartItems

          .map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )

          .filter((item) => item.quantity > 0),
      };
    }

    case "REMOVE_PRODUCT": {
      const productId = action.payload.id || action.payload._id;

      const removedProduct = state.cartItems.find(
        (item) => item.id === productId
      );

      if (removedProduct) {
        toast.info(`${removedProduct.product_name} removed from cart`);
      }

      return {
        ...state,

        cartItems: state.cartItems.filter((item) => item.id !== productId),
      };
    }

    case "CLEAR_CART":
      toast.info(`Cart cleared`);

      return initialState;

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const storedCart = JSON.parse(localStorage.getItem("cart")) || initialState;

  const [state, dispatch] = useReducer(cartReducer, storedCart);

  const subtotal = state.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  React.useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const value = React.useMemo(
    () => ({
      ...state,

      subtotal,

      dispatch,
    }),
    [state, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
