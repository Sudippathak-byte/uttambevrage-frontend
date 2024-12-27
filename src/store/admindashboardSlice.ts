import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";
import { Status } from "../globals/types/types";
import { APIAuthenticated } from "../http";
import toast from "react-hot-toast";

interface AdminDashboardState {
  users: any[]; // Replace 'any' with your user type
  products: any[]; // Replace 'any' with your product type
  orders: any[]; // Replace 'any' with your order type
  status: Status;
}

const initialState: AdminDashboardState = {
  users: [],
  products: [],
  orders: [],
  status: Status.LOADING,
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<any[]>) {
      state.users = action.payload;
    },
    setProducts(state, action: PayloadAction<any[]>) {
      state.products = action.payload;
    },
    setOrders(state, action: PayloadAction<any[]>) {
      state.orders = action.payload;
    },
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    resetDashboard(state) {
      state.users = [];
      state.products = [];
      state.orders = [];
      state.status = Status.LOADING;
    },
  },
});

export const { setUsers, setProducts, setOrders, setStatus, resetDashboard } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;

// Thunk actions
export function fetchUsers() {
  return async function fetchUsersThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/admin/users"); // Adjust the endpoint as necessary
      if (response.status === 200) {
        dispatch(setUsers(response.data.data)); // Adjust based on your API response structure
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
        toast.error("Failed to fetch users");
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to fetch users");
    }
  };
}

export function fetchProducts() {
  return async function fetchProductsThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/admin/products"); // Adjust the endpoint as necessary
      if (response.status === 200) {
        dispatch(setProducts(response.data.data)); // Adjust based on your API response structure
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
        toast.error("Failed to fetch products");
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to fetch products");
    }
  };
}

export function fetchOrders() {
  return async function fetchOrdersThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/admin/orders"); // Adjust the endpoint as necessary
      if (response.status === 200) {
        dispatch(setOrders(response.data.data)); // Adjust based on your API response structure
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
        toast.error("Failed to fetch orders");
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    }
  };
}
