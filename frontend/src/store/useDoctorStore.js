import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useDoctorStore = create((set, get) => ({
    doctor: null,
    isCheckingDoctorAuth: true,
    isLoading: false,
    isLoggingIn: false,
    isSigningUp: false,

    checkDoctorAuth: async () => {
        try {
            const res = await axiosInstance.get("/doctors/check");
            set({ doctor: res.data, isCheckingDoctorAuth: false });
        } catch (error) {
            if (error.response?.status === 401) {
                console.log("No Active Session Detected, doctor is not logged in.");
            } else {
                console.error("Error checking auth:", error);
            }
        } finally {
            set({ isCheckingDoctorAuth: false });
        }
    },

    doctorlogin: async (credentials) => {
        try {
            set({ isLoading: true, isLoggingIn: true });
            const loadingToast = toast.loading("Logging in...");
            const res = await axiosInstance.post("/doctors/login", {
                ...credentials,
                email: credentials.email.toLowerCase(),
            });
            toast.dismiss(loadingToast);
            toast.success("Login successful!");
            set({ doctor: res.data, isLoading: false, isLoggingIn: false });
            return true;
        } catch (error) {
            console.error("Error logging in doctor:", error);
            set({ isLoading: false, isLoggingIn: false });
            let errorMessage = "Login failed";
            if (error.code === "ERR_NETWORK") {
                errorMessage = "Network error. Please check your connection.";
            } else if (error.response) {
                errorMessage = error.response.data.message || "Invalid credentials";
            }
            toast.error(errorMessage);
            return false;
        }
    },

    doctorlogout: async () => {
        try {
            await axiosInstance.post("/doctors/logout");
            set({ doctor: null });
            toast.success("Doctor logged out successfully!");
        } catch (error) {
            console.error("Error logging out doctor:", error);
            toast.error("Failed to log out doctor");
        }
    },

    doctorSignup: async (formData) => {
        try {
            set({ isLoading: true, isSigningUp: true });
            const res = await axiosInstance.post("/doctors/register", {
                ...formData,
                email: formData.email.toLowerCase(),
            });
            set({ doctor: res.data, isLoading: false, isSigningUp: false });
            toast.success("Doctor registered successfully!");
        } catch (error) {
            console.error("Error registering doctor:", error);
            set({ isLoading: false, isSigningUp: false });
            let errorMessage = "Failed to register doctor";
            if (error.code === "ERR_NETWORK") {
                errorMessage = "Network error. Please check your connection.";
            } else if (error.response) {
                errorMessage = error.response.data.message || "Registration failed";
            }
            toast.error(errorMessage);
        }
    },

    updateDoctor: async (formData) => {
        set({ isLoading: true });
        try {
            // Check if formData contains an image that starts with data:image
            const hasImageData = formData.image && formData.image.startsWith('data:image');

            // If there's image data, convert to FormData for file upload
            if (hasImageData) {
                const multipartFormData = new FormData();

                // Convert base64 to a Blob
                const imageBlob = await fetch(formData.image).then(r => r.blob());
                
                // Important: Use 'image' as the field name to match upload.single('image')
                multipartFormData.append('image', imageBlob, 'profile.jpg');

                // Add other form fields
                Object.keys(formData).forEach(key => {
                    if (key !== 'image') {
                        // Handle nested arrays like education and certifications
                        if (Array.isArray(formData[key])) {
                            multipartFormData.append(key, JSON.stringify(formData[key]));
                        } else {
                            multipartFormData.append(key, formData[key]);
                        }
                    }
                });

                // Explicitly add all required fields to ensure they are in the request body
                if (!multipartFormData.has('name')) multipartFormData.append('name', formData.name || '');
                if (!multipartFormData.has('email')) multipartFormData.append('email', formData.email?.toLowerCase() || '');
                if (!multipartFormData.has('specialty')) multipartFormData.append('specialty', formData.specialty || '');

                console.log("FormData entries:");
                for (let pair of multipartFormData.entries()) {
                    console.log(pair[0] + ': ' + (pair[0] === 'image' ? 'File data' : pair[1]));
                }

                // Use different content-type for multipart form data
                const res = await axiosInstance.put("/doctors/update", multipartFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                set({ doctor: res.data.updatedDoctor, isLoading: false });
                toast.success("Doctor profile updated successfully!");
                return res.data.updatedDoctor;
            } else {
                // Use JSON for regular updates without image
                const res = await axiosInstance.put("/doctors/update", {
                    ...formData,
                    email: formData.email?.toLowerCase(),
                });
                set({ doctor: res.data.updatedDoctor, isLoading: false });
                toast.success("Doctor profile updated successfully!");
                return res.data.updatedDoctor;
            }
        } catch (error) {
            console.error("Error updating doctor:", error);
            set({ isLoading: false });
            // Handle specific error messages
            let errorMessage = "Failed to update profile";
            if (error.code === "ERR_NETWORK") {
                errorMessage = "Network error. Please check your connection.";
            } else if (error.response) {
                errorMessage = error.response.data.message || "Update failed";
            }
            toast.error(errorMessage);
            return null;
        }
    },

    requestOtp: async ({ email }) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/doctors/send-otp", { email: email.toLowerCase() });
            set({ isLoading: false });
            toast.success("OTP sent to your email!");
            return true;
        } catch (error) {
            console.error("Error requesting OTP:", error);
            set({ isLoading: false });
            let errorMessage = "Failed to send OTP";
            if (error.code === "ERR_NETWORK") {
                errorMessage = "Network error. Please check your connection.";
            } else if (error.response) {
                errorMessage = error.response.data.message || "Failed to send OTP";
            }
            toast.error(errorMessage);
            return false;
        }
    },

    deleteDoctor: async (doctorId) => {
        set({ isDeleting: true });
        try {
            await axiosInstance.delete(`/doctors/delete/${doctorId}`);
            set({
                doctor: null,
                isDeleting: false
            });
            toast.success("Doctor deleted successfully!");
            return true;
        } catch (error) {
            console.error("Error deleting doctor:", error);
            set({ isDeleting: false });
            toast.error("Failed to delete doctor");
            return false;
        }
    },

    verifyOtp: async ({ email, otp }) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/doctors/verify-otp", { email: email.toLowerCase(), otp });
            set({ doctor: res.data.doctor, isLoading: false });
            toast.success("Login successful!");
            return true;
        } catch (error) {
            console.error("Error verifying OTP:", error);
            set({ isLoading: false });
            let errorMessage = "Invalid OTP";
            if (error.code === "ERR_NETWORK") {
                errorMessage = "Network error. Please check your connection.";
            } else if (error.response) {
                errorMessage = error.response.data.message || "Invalid OTP";
            }
            toast.error(errorMessage);
            return false;
        }
    },

    getAllDoctors: async () => {
        try {
            const res = await axiosInstance.get("/doctors/getDoctor");
            return res.data;
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error("Failed to fetch doctors");
            return null;
        }
    },

    getDoctorById: async (doctorId) => {
        try {
            const res = await axiosInstance.get(`/doctors/${doctorId}`);
            return res.data;
        } catch (error) {
            console.error("Error fetching doctor:", error);
            toast.error("Failed to fetch doctor");
            return null;
        }
    },

    getDoctorAvailability: async (doctorId) => {
        try {
            const res = await axiosInstance.get(`/doctors/availability/${doctorId}`);
            // Make sure we return a consistent format
            return res.data.availability || "No";
        } catch (error) {
            console.error("Error fetching doctor availability:", error);
            toast.error("Failed to fetch doctor's availability");
            return "No"; // Default to "No" if there's an error
        }
    },

    requestPasswordReset: async (email) => {
        try {
            set({ isLoading: true });
            const loadingToast = toast.loading("Sending reset link...");
            const res = await axiosInstance.post("/doctors/doctor-forgot-password", { 
                email: email.toLowerCase() 
            });
            toast.dismiss(loadingToast);
            set({ isLoading: false });
            
            // Always show success even if email doesn't exist (for security)
            toast.success("If an account exists with this email, a password reset link has been sent");
            return true;
        } catch (error) {
            console.error("Error requesting password reset:", error);
            set({ isLoading: false });
            let errorMessage = "Failed to send reset link";
            if (error.code === "ERR_NETWORK") {
                errorMessage = "Network error. Please check your connection.";
            } else {
                // For security, don't show specific error messages
                errorMessage = "Something went wrong. Please try again later.";
            }
            toast.error(errorMessage);
            return false;
        }
    },
    
    verifyResetToken: async (resetToken) => {
        try {
            const res = await axiosInstance.get(`/doctors/doctor-verify-reset-token/${resetToken}`);
            return res.data;
        } catch (error) {
            console.error("Error verifying reset token:", error);
            toast.error("Invalid or expired reset token");
            return { valid: false };
        }
    },
    
    resetPassword: async (resetToken, newPassword) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/doctors/doctor-reset-password", { 
                resetToken, 
                newPassword 
            });
            set({ isLoading: false });
            return true;
        } catch (error) {
            console.error("Error resetting password:", error);
            set({ isLoading: false });
            let errorMessage = "Failed to reset password";
            if (error.code === "ERR_NETWORK") {
                errorMessage = "Network error. Please check your connection.";
            } else if (error.response) {
                errorMessage = error.response.data.message || "Invalid or expired token";
            }
            toast.error(errorMessage);
            return false;
        }
    },
}));