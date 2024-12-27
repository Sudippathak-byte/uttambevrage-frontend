import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";
import { OrderData, OrderDetails, OrderStatus } from "../globals/types/orderTypes";
import { Status } from "../globals/types/types";
import { APIAuthenticated } from "../http";
import toast from "react-hot-toast";

interface OrderState {
  orders: OrderDetails[];
  orderDetails: OrderDetails | null;
  status: Status;
}

const initialState: OrderState = {
  orders: [],
  orderDetails: null,
  status: Status.LOADING,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<OrderDetails[]>) {
      state.orders = action.payload;
    },
    setOrderDetails(state, action: PayloadAction<OrderDetails>) {
      state.orderDetails = action.payload;
    },
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    resetOrderDetails(state) {
      state.orderDetails = null;
    },
  },
});

export const { setOrders, setOrderDetails, setStatus, resetOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;

// Thunk actions
export function createOrder(data: OrderData) {
  return async function createOrderThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.post("/order", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        toast.success(response.data.message);
      } else {
        dispatch(setStatus(Status.ERROR));
        toast.error("Failed to create order");
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to create order");
    }
  };
}

export function fetchMyOrders() {
  return async function fetchMyOrdersThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/order/customer");
      if (response.status === 200) {
        dispatch(setOrders(response.data.data)); // Adjust based on your API response structure
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    }
  };
}

export function fetchOrderDetails(orderId: string) {
  return async function fetchOrderDetailsThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get(`/order/customer/${orderId}`);
      if (response.status === 200) {
        dispatch(setOrderDetails(response.data.data)); // Adjust based on your API response structure
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to fetch order details");
    }
  };
}

export function cancelOrder(orderId: string) {
  return async function cancelOrderThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.patch(`/order/customer/${orderId}`);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        toast.success(response.data.message);
        dispatch(fetchMyOrders()); // Refresh the orders list
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  return async function updateOrderStatusThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.patch(`/order/admin/${orderId}`, { orderStatus: status });
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        toast.success(response.data.message);
        dispatch(fetchMyOrders()); // Refresh the orders list
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to update order status");
    }
  };
}
