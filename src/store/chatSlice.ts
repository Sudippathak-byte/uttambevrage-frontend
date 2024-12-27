import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";
import { Status } from "../globals/types/types";
import { APIAuthenticated } from "../http";
import toast from "react-hot-toast";

interface ChatMessage {
  senderId: string;
  receiverId: string;
  message: string;
}

interface ChatState {
  messages: ChatMessage[];
  status: Status;
}

const initialState: ChatState = {
  messages: [],
  status: Status.LOADING,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<ChatMessage[]>) {
      state.messages = action.payload;
    },
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    resetMessages(state) {
      state.messages = [];
    },
  },
});

export const { setMessages, addMessage, setStatus, resetMessages } = chatSlice.actions;
export default chatSlice.reducer;

// Thunk actions
export function sendMessage(senderId: string, receiverId: string, message: string) {
  return async function sendMessageThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.post("/chat/send", { senderId, receiverId, message });
      if (response.status === 201) {
        dispatch(addMessage({ senderId, receiverId, message }));
        dispatch(setStatus(Status.SUCCESS));
        toast.success("Message sent successfully");
      } else {
        dispatch(setStatus(Status.ERROR));
        toast.error("Failed to send message");
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };
}

export function fetchMessages(userId: string, chatPartnerId: string) {
  return async function fetchMessagesThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get(`/chat/${userId}/${chatPartnerId}`);
      if (response.status === 200) {
        dispatch(setMessages(response.data.data)); // Assuming response.data.data contains the messages
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
        toast.error("Failed to fetch messages");
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    }
  };
}
