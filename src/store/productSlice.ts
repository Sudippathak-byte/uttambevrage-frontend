import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductState, Review } from "../globals/types/productTypes";
import { Status } from "../globals/types/types";
import { AppDispatch } from "./store";
import { API, APIAuthenticated } from "../http";
import toast from "react-hot-toast";

const initialState: ProductState = {
  product: [],
  status: Status.LOADING,
  singleProduct: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct(state: ProductState, action: PayloadAction<Product[]>) {
      state.product = action.payload;
    },
    setStatus(state: ProductState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setSingleProduct(state: ProductState, action: PayloadAction<Product>) {
      state.singleProduct = action.payload;
    },
  },
});

export const { setProduct, setStatus, setSingleProduct } = productSlice.actions;
export default productSlice.reducer;

export function fetchProducts() {
  return async function fetchProductsThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.get("/admin/product");
      if (response.status === 200) {
        const { data } = response.data; // Adjust based on your API response structure
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setProduct(data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function fetchByProductId(productId: string) {
  return async function fetchByProductIdThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.get(`/admin/product/${productId}`);
      if (response.status === 200) {
        const { data } = response.data; // Adjust based on your API response structure
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setSingleProduct(data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to fetch product");
    }
  };
}

export function addReview(productId: string, formData: Review) {
  return async function addReviewThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.post(`/admin/product/review/${productId}`, formData);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        toast.success(response.data.message);
        dispatch(fetchByProductId(productId));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to add review");
    }
  };
}
