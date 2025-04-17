import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isLoading: false,
    isLoggingIn: false,
    isSigningUp: false,
    isUpdatingProfile: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data, isCheckingAuth: false });
        } catch (error) {
            if (error.response?.status === 401) {
                console.log("No Active Session Detected, user is not logged in.");
            } else {
                console.error("Error checking auth:", error);
            }
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (formData) => {
        try {
            set({ isLoading: true, isSigningUp: true });
            const res = await axiosInstance.post("/auth/signup", formData);
            set({ authUser: res.data, isLoading: false, isSigningUp: false });
            toast.success("User registered successfully!");
        } catch (error) {
            console.error("Error registering user:", error);
            set({ isLoading: false, isSigningUp: false });
            toast.error("Failed to register user");
        }
    },

    login: async (credentials) => {
        try {
            set({ isLoading: true, isLoggingIn: true });
            const loadingToast = toast.loading("Logging in...");
            const res = await axiosInstance.post("/auth/login", credentials);
            toast.dismiss(loadingToast);
            toast.success("Login successful!");
            set({ authUser: res.data, isLoading: false, isLoggingIn: false });
            return true;
        } catch (error) {
            console.error("Error logging in user:", error);
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

    // Request an OTP to be sent to the user's email
    requestOtp: async ({ email }) => {
        try {
            set({ isLoading: true });
            const loadingToast = toast.loading("Sending verification code...");
            await axiosInstance.post("/auth/send-otp", { email });
            toast.dismiss(loadingToast);
            toast.success("Verification code sent to your email");
            set({ isLoading: false });
            return true;
        } catch (error) {
            console.error("Error requesting OTP:", error);
            set({ isLoading: false });
            let errorMessage = "Failed to send verification code";
            if (error.response) {
                errorMessage = error.response.data.message || "Invalid email";
            } else if (error.request) {
                errorMessage = "Server not responding";
            } else {
                errorMessage = error.message || "OTP request error";
            }
            toast.error(errorMessage);
            return false;
        }
    },

    // Verify the OTP entered by the user
    verifyOtp: async ({ email, otp }) => {
        try {
            set({ isLoading: true, isLoggingIn: true });
            const loadingToast = toast.loading("Verifying code...");
            const res = await axiosInstance.post("/auth/verify-otp", { email, otp });
            console.log("OTP verification response:", res.data);
            toast.dismiss(loadingToast);
            toast.success("Verification successful!");
            set({ authUser: res.data.user, isLoading: false, isLoggingIn: false });
            return true;
        } catch (error) {
            console.error("Error verifying OTP:", error);
            set({ isLoading: false, isLoggingIn: false });
            let errorMessage = "Verification failed";
            if (error.response) {
                errorMessage = error.response.data.message || "Invalid code";
            } else if (error.request) {
                errorMessage = "Server not responding";
            } else {
                errorMessage = error.message || "Verification error";
            }
            toast.error(errorMessage);
            return false;
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("User logged out successfully!");
        } catch (error) {
            console.error("Error logging out user:", error);
            toast.error("Failed to log out user");
        }
    },

    updateUser: async (formData) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-user", formData);
            console.log("Server Response:", res.data);

            set({
                authUser: res.data.updatedUser,
                isUpdatingProfile: false,
            });
            toast.success("Profile updated successfully!");
            return res.data.updatedUser;
        } catch (error) {
            console.error("Error updating profile:", error);
            set({ isUpdatingProfile: false });
            toast.error("Failed to update profile");
        }
    },

    forgotPassword: async (email) => {
        try {
            set({ isLoading: true });
            const loadingToast = toast.loading("Sending password reset link...");
            await axiosInstance.post("/auth/forgot-password", { email });
            toast.dismiss(loadingToast);
            toast.success("Password reset link sent to your email");
            set({ isLoading: false });
            return true;
        } catch (error) {
            console.error("Error sending password reset link:", error);
            set({ isLoading: false });
            let errorMessage = "Failed to send password reset link";
            if (error.response) {
                errorMessage = error.response.data.message || "Invalid email";
            } else if (error.request) {
                errorMessage = "Server not responding";
            } else {
                errorMessage = error.message || "Password reset error";
            }
            toast.error(errorMessage);
            return false;
        }
    },

    resetPassword: async (resetToken, newPassword) => {
        try {
            set({ isLoading: true });
            const loadingToast = toast.loading("Resetting password...");
            // Send the token in the request body, not in the URL
            const res = await axiosInstance.post("/auth/reset-password", { 
                resetToken, 
                newPassword 
            });
            toast.dismiss(loadingToast);
            toast.success("Password reset successful!");
            set({ isLoading: false });
            return true;
        } catch (error) {
            console.error("Error resetting password:", error);
            set({ isLoading: false });
            let errorMessage = "Failed to reset password";
            if (error.response) {
                errorMessage = error.response.data.message || "Invalid reset token";
            } else if (error.request) {
                errorMessage = "Server not responding";
            } else {
                errorMessage = error.message || "Password reset error";
            }
            toast.error(errorMessage);
            return false;
        }
    },
    
    verifyResetToken: async (resetToken) => {
        try {
            set({ isLoading: true });
            // Ensure this matches your backend route exactly
            const res = await axiosInstance.get(`/auth/verify-reset-token/${resetToken}`);
            set({ isLoading: false });
            return res.data;
        } catch (error) {
            console.error("Error verifying reset token:", error);
            set({ isLoading: false });
            return false;
        }
    },
}));