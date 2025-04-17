import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const usePatientFormStore = create((set, get) => ({
    patient: null,
    patients: [], 
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null, // Added error state

    createPatient: async (formData) => {
        set({ isCreating: true, error: null });
        try {
            const res = await axiosInstance.post("/patients/create", formData);
            const newPatient = res.data.patient;

            // Update both patient and patients list
            set(state => ({
                patient: newPatient,
                patients: [...state.patients, newPatient],
                isCreating: false
            }));

            toast.success(res.data.message || "Patient created successfully!");
            return newPatient;
        } catch (error) {
            console.error("Error creating patient:", error);
            
            // More specific error handling based on status code
            const errorMessage = error.response?.data?.message || "Failed to create patient";
            
            set({ 
                isCreating: false, 
                error: {
                    message: errorMessage,
                    statusCode: error.response?.status || 500
                }
            });
            
            toast.error(errorMessage);
            return null;
        }
    },

    getAllPatients: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get("/patients/all");
            set({ patients: res.data, isLoading: false });
            return res.data;
        } catch (error) {
            console.error("Error fetching patients:", error);
            
            const errorMessage = error.response?.data?.message || "Failed to fetch patients";
            
            set({ 
                isLoading: false,
                error: {
                    message: errorMessage,
                    statusCode: error.response?.status || 500
                }
            });
            
            toast.error(errorMessage);
            return [];
        }
    },

    getPatientById: async (patientId) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get(`/patients/${patientId}`);
            const patient = res.data;

            set({
                patient: patient,
                isLoading: false
            });
            return patient;
        } catch (error) {
            console.error("Error fetching patient:", error);
            
            // Handle 404 differently
            const statusCode = error.response?.status || 500;
            const errorMessage = error.response?.data?.message || "Failed to fetch patient";
            
            set({ 
                isLoading: false,
                error: {
                    message: errorMessage,
                    statusCode: statusCode
                }
            });
            
            toast.error(errorMessage);
            
            // Return null with descriptive error for 404
            if (statusCode === 404) {
                return { notFound: true };
            }
            
            return null;
        }
    },

    getPatientsByUser: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get("/patients/user");
            const patients = res.data || [];

            set({
                patients: patients,
                isLoading: false
            });
            return patients;
        } catch (error) {
            console.error("Error fetching patients:", error);
            
            const errorMessage = error.response?.data?.message || "Failed to fetch patients";
            
            set({ 
                isLoading: false,
                error: {
                    message: errorMessage,
                    statusCode: error.response?.status || 500
                }
            });
            
            toast.error(errorMessage);
            return [];
        }
    },

    updatePatient: async (patientId, formData) => {
        set({ isUpdating: true, error: null });
        try {
            const res = await axiosInstance.put(`/patients/${patientId}`, formData);
            const updatedPatient = res.data.patient;

            // Update both patient and patients list
            set(state => ({
                patient: updatedPatient,
                patients: state.patients.map(p =>
                    p._id === patientId ? updatedPatient : p
                ),
                isUpdating: false
            }));

            toast.success(res.data.message || "Patient updated successfully!");
            return updatedPatient;
        } catch (error) {
            console.error("Error updating patient:", error);
            
            const statusCode = error.response?.status || 500;
            const errorMessage = error.response?.data?.message || "Failed to update patient";
            
            set({ 
                isUpdating: false,
                error: {
                    message: errorMessage,
                    statusCode: statusCode
                }
            });
            
            toast.error(errorMessage);
            
            // Special handling for common errors
            if (statusCode === 404) {
                return { notFound: true };
            } else if (statusCode === 403) {
                return { unauthorized: true };
            }
            
            return null;
        }
    },

    updatePatientById: async (patientId, formData) => {
        set({ isUpdating: true, error: null });
        try {
            const res = await axiosInstance.put(`/patients/update/${patientId}`, formData);
            const updatedPatient = res.data.patient;

            // Update both patient and patients list
            set(state => ({
                patient: updatedPatient,
                patients: state.patients.map(p =>
                    p._id === patientId ? updatedPatient : p
                ),
                isUpdating: false
            }));

            toast.success(res.data.message || "Patient updated successfully!");
            return updatedPatient;
        } catch (error) {
            console.error("Error updating patient:", error);
            
            const statusCode = error.response?.status || 500;
            const errorMessage = error.response?.data?.message || "Failed to update patient";
            
            set({ 
                isUpdating: false,
                error: {
                    message: errorMessage,
                    statusCode: statusCode
                }
            });
            
            toast.error(errorMessage);
            
            // Special handling for common errors
            if (statusCode === 404) {
                return { notFound: true };
            } else if (statusCode === 403) {
                return { unauthorized: true };
            } else if (statusCode === 400) {
                return { validationError: true, message: errorMessage };
            }
            
            return null;
        }
    },

    deletePatient: async (patientId) => {
        set({ isDeleting: true, error: null });
        try {
            await axiosInstance.delete(`/patients/${patientId}`);

            // Remove from patients list and reset current patient if it was deleted
            set(state => ({
                patient: state.patient?._id === patientId ? null : state.patient,
                patients: state.patients.filter(p => p._id !== patientId),
                isDeleting: false
            }));

            toast.success("Patient deleted successfully!");
            return true;
        } catch (error) {
            console.error("Error deleting patient:", error);
            
            const statusCode = error.response?.status || 500;
            const errorMessage = error.response?.data?.message || "Failed to delete patient";
            
            set({ 
                isDeleting: false,
                error: {
                    message: errorMessage,
                    statusCode: statusCode
                }
            });
            
            toast.error(errorMessage);
            
            // Special handling for authorization errors
            if (statusCode === 403) {
                return { unauthorized: true };
            }
            
            return false;
        }
    },

    // Add a reset method to clear state
    resetState: () => {
        set({
            patient: null,
            error: null,
            isLoading: false,
            isCreating: false,
            isUpdating: false,
            isDeleting: false
        });
    },
    
    // Clear only error state
    clearError: () => {
        set({ error: null });
    }
}));