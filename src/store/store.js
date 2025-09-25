import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import cartReducer from './cartSlice';
import productReducer from './productSlice';
import checkoutReducer from './checkoutSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    product: productReducer,
    checkout: checkoutReducer,
  },
});