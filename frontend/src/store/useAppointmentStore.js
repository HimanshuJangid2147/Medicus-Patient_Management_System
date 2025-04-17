import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAppointmentStore = create((set, get) => ({
    appointments: [],
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,

    getAllAppointments: async () => {
        try {
            const res = await axiosInstance.get("/appointments/getAll-appointments");
            console.log("API response for appointments:", res.data);
            set({ appointments: res.data, isLoading: false });
            return res.data;
        } catch (error) {
            console.error("Error fetching appointments:", error);
            set({ isLoading: false });
            toast.error("Failed to fetch appointments");
            return null;
        }
    },

    getAppointmentById: async (appointmentId) => {
        try {
            const res = await axiosInstance.get(`/appointments/${appointmentId}`);
            return res.data;
        } catch (error) {
            console.error("Error fetching appointment:", error);
            toast.error("Failed to fetch appointment");
            return null;
        }
    },

    getAppointmentsByPatient: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/appointments/patient");
            set({ isLoading: false });
            return res.data;
        } catch (error) {
            set({ isLoading: false });
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Please login to view your appointments");
            } else {
                toast.error("Failed to fetch your appointments");
            }
            console.error("Error fetching patient appointments:", error);
            return null;
        }
    },

    getAppointmentsByDoctor: async () => {
        try {
            const res = await axiosInstance.get("/appointments/doctor");
            return res.data;
        } catch (error) {
            console.error("Error fetching doctor appointments:", error);
            toast.error("Failed to fetch your appointments");
            return null;
        }
    },

    createAppointment: async (formData) => {
        set({ isCreating: true });
        try {
            const appointmentData = {
                patientId: formData.patientId,
                doctorId: formData.doctorId,
                patientName: formData.patientName,
                doctorName: formData.doctorName,
                date: formData.date,
                time: formData.time,
                reason: formData.reason,
                notes: formData.additionalComments,
            };

            const res = await axiosInstance.post("/appointments/create", appointmentData);
            const newAppointment = res.data.appointment;
            set({
                appointments: [...get().appointments, newAppointment],
                isCreating: false
            });
            toast.success("Appointment created successfully!");
            return newAppointment;
        } catch (error) {
            console.error("Error creating appointment:", error);
            set({ isCreating: false });
            toast.error(error.response?.data?.message || "Failed to create appointment");
            return null;
        }
    },

    updateAppointment: async (appointmentId, formData) => {
        set({ isUpdating: true });
        try {
            const res = await axiosInstance.put(`/appointments/${appointmentId}`, formData);
            const updatedAppointment = res.data.appointment;
            set({
                appointments: get().appointments.map(app =>
                    app._id === appointmentId ? updatedAppointment : app
                ),
                isUpdating: false
            });
            toast.success("Appointment updated successfully!");
            return updatedAppointment;
        } catch (error) {
            console.error("Error updating appointment:", error);
            set({ isUpdating: false });
            toast.error(error.response?.data?.message || "Failed to update appointment");
            return null;
        }
    },

    deleteAppointment: async (appointmentId) => {
        set({ isDeleting: true });
        try {
            await axiosInstance.delete(`/appointments/${appointmentId}`);
            set({
                appointments: get().appointments.filter(app => app._id !== appointmentId),
                isDeleting: false
            });
            toast.success("Appointment deleted successfully!");
            return true;
        } catch (error) {
            console.error("Error deleting appointment:", error);
            set({ isDeleting: false });
            toast.error(error.response?.data?.message || "Failed to delete appointment");
            return false;
        }
    },

    cancelAppointment: async (appointmentId, cancellationReason) => {
        set({ isUpdating: true });
        try {
            const res = await axiosInstance.put(`/appointments/cancel/${appointmentId}`, {
                cancellationReason
            });

            // Update the local state with the cancelled appointment
            const updatedAppointment = res.data.appointment;

            set({
                appointments: get().appointments.map(app =>
                    app._id === appointmentId ? {
                        ...app,
                        status: 'Cancelled',
                        cancellationReason: cancellationReason,
                        notes: updatedAppointment.notes // Update notes to include who cancelled
                    } : app
                ),
                isUpdating: false
            });

            toast.success("Appointment cancelled successfully!");
            return updatedAppointment;
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            set({ isUpdating: false });
            toast.error(error.response?.data?.message || "Failed to cancel appointment");
            return null;
        }
    },

    rescheduleAppointment : async (appointmentId, formData) => {
        // Debug logs to verify what's being passed
        console.log("Rescheduling appointment with ID:", appointmentId);
        console.log("Form data:", formData);

        if (!appointmentId) {
            console.error("No appointmentId provided!");
            toast.error("Missing appointment ID");
            return null;
        }

        set({ isUpdating: true });
        try {
            const res = await axiosInstance.put(`/appointments/reschedule/${appointmentId}`, formData);

            // Handle the case where the response might not include appointment property
            const updatedAppointment = res.data.appointment || res.data;

            // Update the appointments list with the updated appointment
            set({
                appointments: get().appointments.map(app =>
                    app._id === appointmentId ? updatedAppointment : app
                ),
                isUpdating: false
            });

            toast.success("Appointment rescheduled successfully!");
            return updatedAppointment;
        } catch (error) {
            console.error("Error rescheduling appointment:", error);
            set({ isUpdating: false });
            toast.error(error.response?.data?.message || "Failed to reschedule appointment");
            return null;
        }
    },
}));