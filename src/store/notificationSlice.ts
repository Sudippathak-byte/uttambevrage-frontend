import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";
import { Status } from "../globals/types/types";
import { APIAuthenticated } from "../http";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  message: string;
  type: string; // e.g., "order_status_update", "payment_status_update", etc.
  isRead: boolean;
  createdAt: string; // Timestamp of when the notification was created
}

interface NotificationState {
  notifications: Notification[];
  status: Status;
}

const initialState: NotificationState = {
  notifications: [],
  status: Status.LOADING,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.isRead = true;
      }
    },
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    resetNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { setNotifications, markAsRead, setStatus, resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

// Thunk actions
export function fetchNotifications(userId: string) {
  return async function fetchNotificationsThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get(`/notifications/${userId}`);
      if (response.status === 200) {
        dispatch(setNotifications(response.data.data)); // Assuming response.data.data contains the notifications
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
        toast.error("Failed to fetch notifications");
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to fetch notifications");
    }
  };
}

export function markNotificationAsRead(notificationId: string) {
  return async function markNotificationAsReadThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.patch(`/notifications/${notificationId}/read`);
      if (response.status === 200) {
        dispatch(markAsRead(notificationId));
        dispatch(setStatus(Status.SUCCESS));
        toast.success("Notification marked as read");
      } else {
        dispatch(setStatus(Status.ERROR));
        toast.error("Failed to mark notification as read");
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to mark notification as read");
    }
  };
}
