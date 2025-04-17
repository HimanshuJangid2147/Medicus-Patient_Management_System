import {axiosInstance} from "../lib/axios.js";
import { create } from "zustand";
import toast from "react-hot-toast";

export const useCategoriesStore = create((set, get) => ({
    categories: [],
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,

    getCategories: async () => {
        try {
            const res = await axiosInstance.get("/categories/show");
            set({ categories: res.data });
            return res.data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to fetch categories");
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    createCategory: async (formData) => {
        set({ isCreating: true });
        try {
            const res = await axiosInstance.post("/categories/create", formData);
            set({ categories: [...get().categories, res.data] });
            toast.success("Category created successfully!");
            return res.data;
        } catch (error) {
            console.error("Error creating category:", error);
            toast.error("Failed to create category");
            return null;
        } finally {
            set({ isCreating: false });
        }
    },

    updateCategory: async (categoryId, formData) => {
        set({ isUpdating: true });
        try {
            const res = await axiosInstance.put(`/categories/${categoryId}`, formData);
            set({
                categories: get().categories.map(category =>
                    category._id === categoryId ? res.data : category
                )
            });
            toast.success("Category updated successfully!");
            return res.data;
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Failed to update category");
            return null;
        } finally {
            set({ isUpdating: false });
        }
    },

    getCategoryById: async (categoryId) => {
        try {
            const res = await axiosInstance.get(`/categories/${categoryId}`);
            return res.data;
        } catch (error) {
            console.error("Error fetching category:", error);
            toast.error("Failed to fetch category");
            return null;
        }
    },

    deleteCategory: async (categoryId) => {
        set({ isDeleting: true });
        try {
            await axiosInstance.delete(`/categories/${categoryId}`);
            set({
                categories: get().categories.filter(category => category._id !== categoryId)
            });
            toast.success("Category deleted successfully!");
            return true;
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete category");
            return false;
        } finally {
            set({ isDeleting: false });
        }
    },
}));