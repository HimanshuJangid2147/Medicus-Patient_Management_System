import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAdminStore = create((set, get) => ({
    admin: null,
    isCheckingAdminAuth: true,
    isLoading: false,
    isLoggingIn: false,
    isSigningUp: false,

    checkAdminAuth: async () => {
        try {
            const res = await axiosInstance.get("/admin/check");
            set({ admin: res.data, isCheckingAdminAuth: false });
        } catch (error) {
            if (error.response?.status === 401) {
                console.log("No Active Session Detected, admin is not logged in.");
            } else {
                console.error("Error checking auth:", error);
            }
        } finally {
            set({ isCheckingAdminAuth: false });
        }
    },

    adminlogin: async (credentials) => {
        try {
            set({ isLoading: true, isLoggingIn: true });
            const loadingToast = toast.loading("Logging in...");
            const res = await axiosInstance.post("/admin/login", credentials);
            toast.dismiss(loadingToast);
            toast.success("Login successful!");
            set({ admin: res.data, isLoading: false, isLoggingIn: false });
            return true;
        } catch (error) {
            console.error("Error logging in admin:", error);
            set({ isLoading: false, isLoggingIn: false });
            let errorMessage = "Login failed";
            if (error.response) {
                errorMessage = error.response.data.message || "Invalid credentials";
            } else if (error.request) {
                errorMessage = "Server not responding";
            } else {
                errorMessage = error.message || "Login error";
            }
            toast.error(errorMessage);
            return false;
        }
    },

    adminsignup: async (formData) => {
        try {
            set({ isLoading: true, isSigningUp: true });
            const res = await axiosInstance.post("/admin/register", formData);
            set({ admin: res.data, isLoading: false, isSigningUp: false });
            toast.success("Admin registered successfully!");
        } catch (error) {
            console.error("Error registering admin:", error);
            set({ isLoading: false, isSigningUp: false });
            toast.error("Failed to register admin");
        }
    },

    adminlogout: async () => {
        try {
            await axiosInstance.post("/admin/logout");
            set({ admin: null });
            toast.success("Admin logged out successfully!");
        } catch (error) {
            console.error("Error logging out admin:", error);
            toast.error("Failed to log out admin");
        }
    },

    updateAdmin: async (formData) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.put("/admin/update", formData);
            set({ admin: res.data, isLoading: false });
            toast.success("Admin updated successfully!");
            return res.data;
        } catch (error) {
            console.error("Error updating admin:", error);
            set({ isLoading: false });
            toast.error("Failed to update admin");
        }
    },


}));