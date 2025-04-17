import React, { useState, useEffect, useRef } from 'react';
import { useAppointmentStore } from '../store/useAppointmentStore.js';
import toast from 'react-hot-toast';

const RescheduleAppointmentModal = ({ isOpen, onClose, appointment, onReschedule }) => {
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [confirmReschedule, setConfirmReschedule] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef(null);
    const { rescheduleAppointment } = useAppointmentStore();

    // Display info only (not editable)
    const [doctorName, setDoctorName] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (isOpen && appointment) {
            setDoctorName(appointment.doctorName || '');
            setReason(appointment.reason || '');
            setAppointmentDate(appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '');
            setAppointmentTime(appointment.time || '');
            setConfirmReschedule(false);
        }
    }, [isOpen, appointment]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Debug log to verify appointment object
        console.log("Submitting appointment:", appointment);

        if (!appointment || !appointment._id) {
            toast.error('Invalid appointment data: Missing appointment ID');
            return;
        }

        setIsSubmitting(true);
        try {
            // Only include date and time in the request as per API requirements
            const updatedData = {
                date: appointmentDate,
                time: appointmentTime
            };

            const appointmentId = appointment._id;
            const result = await rescheduleAppointment(appointmentId, updatedData);

            if (result) {
                // For the UI update, pass both ID and result
                onReschedule(appointmentId, result);
                toast.success('Appointment rescheduled successfully');
                onClose();
            }
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            toast.error(error.response?.data?.message || 'Failed to reschedule appointment');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !appointment) return null;

    return (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="bg-white rounded-lg w-full max-w-lg overflow-hidden shadow-2xl transform transition-all animate-fade-in"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Reschedule Appointment</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors text-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full h-8 w-8 flex items-center justify-center"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6">
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Current Appointment</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500 text-sm">Patient</p>
                                <p className="text-gray-800 font-medium">{appointment.patientName || 'You'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Doctor</p>
                                <p className="text-gray-800 font-medium">Dr. {doctorName}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Date</p>
                                <p className="text-gray-800 font-medium">{appointment.date}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Time</p>
                                <p className="text-gray-800 font-medium">{appointment.time}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-500 text-sm">Reason</p>
                                <p className="text-gray-800 font-medium">{reason}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2" htmlFor="date">
                                New Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="date"
                                    value={appointmentDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:outline-none pl-10"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2" htmlFor="time">
                                New Time
                            </label>
                            <div className="relative">
                                <input
                                    type="time"
                                    id="time"
                                    value={appointmentTime}
                                    onChange={(e) => setAppointmentTime(e.target.value)}
                                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:outline-none pl-10"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={confirmReschedule}
                                    onChange={(e) => setConfirmReschedule(e.target.checked)}
                                    className="mr-2 h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 transition-all"
                                    required
                                />
                                <span className="group-hover:text-gray-900 transition-colors">
                                    I confirm that I want to reschedule this appointment
                                </span>
                            </label>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 border-2 border-teal-500 text-teal-500 hover:bg-teal-50 transition-all py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                                disabled={isSubmitting}
                            >
                                Keep Current Schedule
                            </button>
                            <button
                                type="submit"
                                className={`flex-1 bg-teal-500 hover:bg-teal-600 transition-all text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 ${
                                    (!appointmentDate || !appointmentTime || !confirmReschedule || isSubmitting)
                                        ? 'opacity-60 cursor-not-allowed'
                                        : ''
                                }`}
                                disabled={!appointmentDate || !appointmentTime || !confirmReschedule || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Rescheduling...
                                    </span>
                                ) : (
                                    'Reschedule Appointment'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RescheduleAppointmentModal;