import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useMedicalRecordStore = create((set, get) => ({
    medicalRecords: [],
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,

    getAllMedicalRecords: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/medical-records/getAll-medicalRecords");
            set({ medicalRecords: res.data, isLoading: false });
            return res.data;
        } catch (error) {
            console.error("Error fetching medical records:", error);
            set({ isLoading: false });
            toast.error("Failed to fetch medical records");
            return null;
        }
    },

    getMedicalRecordById: async (recordId) => {
        try {
            const res = await axiosInstance.get(`/medical-records/${recordId}`);
            return res.data;
        } catch (error) {
            console.error("Error fetching medical record:", error);
            toast.error("Failed to fetch medical record");
            return null;
        }
    },

    getMedicalRecordsByPatient: async () => {
        try {
            const res = await axiosInstance.get(`/medical-records/patient`);
            return res.data;
        } catch (error) {
            console.error("Error fetching patient's medical records:", error);
            toast.error("Failed to fetch patient's medical records");
            return null;
        }
    },

    createMedicalRecord: async (formData) => {
        set({ isCreating: true });
        try {
            const res = await axiosInstance.post("/medical-records/create", formData);
            // Based on your controller response, medical record is nested in the response
            const newRecord = res.data.record;
            set({
                medicalRecords: [...get().medicalRecords, newRecord],
                isCreating: false
            });
            toast.success("Medical record created successfully!");
            return newRecord;
        } catch (error) {
            console.error("Error creating medical record:", error);
            set({ isCreating: false });
            toast.error(error.response?.data?.message || "Failed to create medical record");
            return null;
        }
    },

    updateMedicalRecord: async (recordId, formData) => {
        set({ isUpdating: true });
        try {
            const res = await axiosInstance.put(`/medical-records/${recordId}`, formData);
            // Based on your controller response, the updated medical record is in res.data.record
            const updatedRecord = res.data.record;
            set({
                medicalRecords: get().medicalRecords.map(record =>
                    record._id === recordId ? updatedRecord : record
                ),
                isUpdating: false
            });
            toast.success("Medical record updated successfully!");
            return updatedRecord;
        } catch (error) {
            console.error("Error updating medical record:", error);
            set({ isUpdating: false });
            toast.error(error.response?.data?.message || "Failed to update medical record");
            return null;
        }
    },

    deleteMedicalRecord: async (recordId) => {
        set({ isDeleting: true });
        try {
            await axiosInstance.delete(`/medical-records/${recordId}`);
            set({
                medicalRecords: get().medicalRecords.filter(record => record._id !== recordId),
                isDeleting: false
            });
            toast.success("Medical record deleted successfully!");
            return true;
        } catch (error) {
            console.error("Error deleting medical record:", error);
            set({ isDeleting: false });
            toast.error(error.response?.data?.message || "Failed to delete medical record");
            return false;
        }
    },
}));