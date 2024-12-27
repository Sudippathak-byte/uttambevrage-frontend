import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";
import { Status } from "../globals/types/types";
import { APIAuthenticated } from "../http";
import toast from "react-hot-toast";

interface Category {
  id: string;
  categoryName: string;
}

interface CategoryState {
  categories: Category[];
  status: Status;
}

const initialState: CategoryState = {
  categories: [],
  status: Status.LOADING,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    resetCategories(state) {
      state.categories = [];
    },
  },
});

export const { setCategories, setStatus, resetCategories } = categorySlice.actions;
export default categorySlice.reducer;

// Thunk actions
export function fetchCategories() {
  return async function fetchCategoriesThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/admin/category");
      if (response.status === 200) {
        dispatch(setCategories(response.data.data)); // Adjust based on your API response structure
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
        toast.error("Failed to fetch categories");
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to fetch categories");
    }
  };
}

export function addCategory(categoryName: string) {
  return async function addCategoryThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.post("/admin/category", { categoryName });
      if (response.status === 200) {
        dispatch(fetchCategories()); // Refresh the categories list
        dispatch(setStatus(Status.SUCCESS));
        toast.success(response.data.message);
      } else {
        dispatch(setStatus(Status.ERROR));
        toast.error("Failed to add category");
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  };
}

export function updateCategory(id: string, categoryName: string) {
  return async function updateCategoryThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.patch(`/admin/category/${id}`, { categoryName });
      if (response.status === 200) {
        dispatch(fetchCategories()); // Refresh the categories list
        dispatch(setStatus(Status.SUCCESS));
        toast.success(response.data.message);
      } else {
        dispatch(setStatus(Status.ERROR));
        toast.error("Failed to update category");
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };
}

export function deleteCategory(id: string) {
  return async function deleteCategoryThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.delete(`/admin/category/${id}`);
      if (response.status === 200) {
        dispatch(fetchCategories()); // Refresh the categories list
        dispatch(setStatus(Status.SUCCESS));
        toast.success(response.data.message);
      } else {
        dispatch(setStatus(Status.ERROR));
        toast.error("Failed to delete category");
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };
}
