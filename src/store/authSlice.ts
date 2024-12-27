import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API, APIAuthenticated } from "../http";
import { Status } from "../globals/types/types";
import toast from "react-hot-toast";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  token: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  bestSports: string;
  bestActor: string;
  idol: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface PasswordResetData {
  email: string;
  bestSports: string;
  bestActor: string;
  idol: string;
}

interface NewPasswordData {
  token: string;
  newPassword: string;
}

interface AuthState {
  user: User;
  status: Status;
}

const initialState: AuthState = {
  user: {} as User,
  status: Status.LOADING,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state: AuthState, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setStatus(state: AuthState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    resetStatus(state: AuthState) {
      state.status = Status.LOADING;
    },
    setToken(state: AuthState, action: PayloadAction<string>) {
      state.user.token = action.payload;
    },
  },
});

export const { setUser, setStatus, resetStatus, setToken } = authSlice.actions;
export default authSlice.reducer;

export function register(data: RegisterData) {
  return async function registerThunk(dispatch: any) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.post("/register", data);
      if (response.status === 201) {
        dispatch(setStatus(Status.SUCCESS));
        toast.success(response.data.message);
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };
}

export function login(data: LoginData) {
  return async function loginThunk(dispatch: any) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.post("/login", data);
      if (response.status === 200) {
        const { token, user } = response.data;
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setToken(token));
        dispatch(setUser(user));
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("username", user.username);
        toast.success(response.data.message);
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Login failed");
    }
  };
}

export function requestPasswordReset(data: PasswordResetData) {
  return async function requestPasswordResetThunk(dispatch: any) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.post("/request-password-reset", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        toast.success(response.data.message);
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Request failed");
    }
  };
}

export function resetPassword(data: NewPasswordData) {
  return async function resetPasswordThunk(dispatch: any) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.post("/reset-password", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        toast.success(response.data.message);
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Reset failed");
    }
  };
}

export function verifySecurityQuestions(data: PasswordResetData) {
  return async function verifySecurityQuestionsThunk(dispatch: any) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.post("/verify-security-questions", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        toast.success(response.data.message);
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };
}

export function fetchUsers() {
  return async function fetchUsersThunk(dispatch: any) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/users");
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        // Handle users data as needed
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Fetch users failed");
    }
  };
}

export function updateUser(id: string, data: Partial<User>) {
  return async function updateUserThunk(dispatch: any) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.patch(`/user/${id}`, data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        toast.success(response.data.message);
        // Optionally update user in state
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Update failed");
    }
  };
}

export function getUserDetails(id: string) {
  return async function getUserDetailsThunk(dispatch: any) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get(`/user/${id}`);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        // Handle user details as needed
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Fetch details failed");
    }
  };
}
