import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartState } from "../globals/types/cartTypes";
import { Status } from "../globals/types/types";
import { AppDispatch } from "./store";
import { APIAuthenticated } from "../http";
import toast from "react-hot-toast";

const initialState: CartState = {
  items: [],
  status: Status.LOADING,
};

interface DeleteAction {
  productId: string;
}

interface UpdateAction extends DeleteAction {
  quantity: number;
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItems(state: CartState, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    setStatus(state: CartState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setDeleteItem(state: CartState, action: PayloadAction<DeleteAction>) {
      const index = state.items.findIndex(
        (item) => item.Product.id === action.payload.productId
      );
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
    setUpdateItem(state: CartState, action: PayloadAction<UpdateAction>) {
      const index = state.items.findIndex(
        (item) => item.Product.id === action.payload.productId
      );
      if (index !== -1) {
        state.items[index].quantity = action.payload.quantity;
      }
    },
  },
});

export const { setItems, setStatus, setDeleteItem, setUpdateItem } =
  cartSlice.actions;
export default cartSlice.reducer;

export function addToCart(productId: string) {
  return async function addToCartThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.post("/customer/cart", {
        productId,
        quantity: 1,
      });
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setItems(response.data.data));
        toast.success(response.data.message);
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };
}

export function fetchCartItems() {
  return async function fetchCartItemsThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/customer/cart");
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setItems(response.data.data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to fetch cart items");
    }
  };
}

export function deleteCartItem(productId: string) {
  return async function deleteCartItemThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.delete(
        `/customer/cart/${productId}`
      );
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setDeleteItem({ productId }));
        toast.success(response.data.message);
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to delete cart item");
    }
  };
}

export function updateCartItem(productId: string, quantity: number) {
  return async function updateCartItemThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.patch(
        `/customer/cart/${productId}`,
        { quantity }
      );
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setUpdateItem({ productId, quantity }));
        toast.success(response.data.message);
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to update cart item");
    }
  };
}