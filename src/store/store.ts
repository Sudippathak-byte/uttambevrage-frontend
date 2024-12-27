import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import productSlice from "./productSlice";
import cartSlice from "./cartSlice";
import checkoutSlice from "./checkoutSlice";
import orderSlice from "./orderSlice"; // Import the order slice
import categorySlice from "./categorySlice"; // Import the category slice
import chatSlice from "./chatSlice"; // Import the chat slice

const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    carts: cartSlice,
    orders: checkoutSlice,
    order: orderSlice, 
    category: categorySlice, 
    chat: chatSlice, 
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
