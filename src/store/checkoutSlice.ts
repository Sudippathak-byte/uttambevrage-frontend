import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/types/types";
import {
  MyOrdersData,
  OrderData,
  OrderDetails,
  OrderResponseData,
  OrderResponseItem,
  OrderStatus,
  PaymentStatus,
} from "../globals/types/CheckoutTypes";
import { AppDispatch } from "./store";
import { APIAuthenticated } from "../http";
import toast from "react-hot-toast";

const initialState: OrderResponseData = {
  items: [],
  status: Status.LOADING,
  khaltiUrl: null,
  myOrders: [],
  orderDetails: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<OrderResponseItem>) {
      state.items.push(action.payload);
    },
    resetStatus(state) {
      state.status = Status.LOADING;
    },
    setMyOrders(state, action: PayloadAction<MyOrdersData[]>) {
      state.myOrders = action.payload;
    },
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setKhaltiUrl(state, action: PayloadAction<OrderResponseData["khaltiUrl"]>) {
      state.khaltiUrl = action.payload;
    },
    setMyOrderDetails(state, action: PayloadAction<OrderDetails[]>) {
      state.orderDetails = action.payload;
    },
    updateOrderStatus(state, action: PayloadAction<{ status: OrderStatus; orderId: string }>) {
      const { status, orderId } = action.payload;
      const updatedOrder = state.myOrders.map((order) =>
        order.id === orderId ? { ...order, orderStatus: status } : order
      );
      state.myOrders = updatedOrder;
    },
    updatePaymentStatus(state, action: PayloadAction<{ orderId: string; paymentStatus: PaymentStatus }>) {
      const { orderId, paymentStatus } = action.payload;
      const order = state.myOrders.find((order) => order.id === orderId);
      if (order) {
        order.Payment.paymentStatus = paymentStatus;
      }
    },
  },
});

export const {
  setItems,
  setStatus,
  resetStatus,
  setKhaltiUrl,
  setMyOrders,
  setMyOrderDetails,
  updateOrderStatus,
  updatePaymentStatus,
} = orderSlice.actions;
export default orderSlice.reducer;

export function orderItem(data: OrderData) {
  return async function orderItemThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.post("/order", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setItems(response.data.data));

        if (response.data.url) {
          dispatch(setKhaltiUrl(response.data.url));
        } else {
          dispatch(setKhaltiUrl(null));
        }
        toast.success(response.data.message);
      } else {
        dispatch(setStatus(Status.ERROR));
        toast.error("Something went wrong!");
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };
}

export function fetchMyOrders() {
  return async function fetchMyOrdersThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/order/customer");
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setMyOrders(response.data.data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function fetchMyOrderDetails(id: string) {
  return async function fetchMyOrderDetailsThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get(`/order/customer/${id}`);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setMyOrderDetails(response.data.data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message);
    }
  };
}

export function cancelMyOrder(id: string) {
  return async function cancelMyOrderThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.patch(`/order/customer/${id}`);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        toast.success(response.data.message);
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function updateOrderStatusInStore(data: { status: OrderStatus; orderId: string }) {
  return function updateOrderStatusInStoreThunk(dispatch: AppDispatch) {
    dispatch(updateOrderStatus(data));
  };
}

export function updatePaymentStatusInStore(data: { orderId: string; paymentStatus: PaymentStatus }) {
  return function updatePaymentStatusInStoreThunk(dispatch: AppDispatch) {
    dispatch(updatePaymentStatus(data));
  };
}
