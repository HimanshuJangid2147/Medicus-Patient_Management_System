import { axiosInstance } from "../lib/axios.js";
import { create } from "zustand";
import toast from "react-hot-toast";

export const useContactUsStore = create((set) => ({
    isLoading: false,
    isSending: false,

    sendContactEmail: async (formData) => {
        set({ isSending: true });
        try {
            const res = await axiosInstance.post("/contact", formData);
            toast.success("Message sent successfully!");
            return res.data;
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = error.response?.data?.message || "Failed to send message";
            toast.error(errorMessage);
            return null;
        } finally {
            set({ isSending: false });
        }
    },
}));