import React, { useState, useEffect, useRef } from 'react';
import { useAppointmentStore } from "../store/useAppointmentStore.js";
import toast from "react-hot-toast";

const CancelAppointmentModal = ({ isOpen, onClose, appointment, onCancel }) => {
  const [cancelReason, setCancelReason] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);

  const { cancelAppointment } = useAppointmentStore();

  useEffect(() => {
    if (isOpen && appointment) {
      setCancelReason('');
      setConfirmCancel(false);
    }
  }, [isOpen, appointment]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!appointment || !appointment._id) {
      toast.error("Invalid appointment data");
      return;
    }

    setIsSubmitting(true);
    try {
      // Use the store's cancelAppointment function instead of direct axios call
      const result = await cancelAppointment(appointment._id, cancelReason);

      if (result) {
        onCancel(appointment._id, cancelReason);
        toast.success('Appointment cancelled successfully');
        onClose();
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
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
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Cancel Appointment</h2>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors text-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full h-8 w-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Appointment Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Patient</p>
                  <p className="text-gray-800 font-medium">{appointment.patientName || 'You'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Doctor</p>
                  <p className="text-gray-800 font-medium">Dr. {appointment.doctorName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Date</p>
                  <p className="text-gray-800 font-medium">{appointment.date}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Time</p>
                  <p className="text-gray-800 font-medium">{appointment.time}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Reason for Cancellation */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="cancelReason">
                  Reason for cancellation
                </label>
                <textarea
                    id="cancelReason"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Please provide a reason for cancelling this appointment"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:border-teal-500 focus:ring-teal-500 focus:ring-opacity-50 focus:outline-none transition-all"
                    rows="3"
                    required
                />
              </div>

              {/* Confirmation Checkbox */}
              <div className="mb-6">
                <label className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer group">
                  <input
                      type="checkbox"
                      checked={confirmCancel}
                      onChange={(e) => setConfirmCancel(e.target.checked)}
                      className="mr-2 h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 transition-all"
                      required
                  />
                  <span className="group-hover:text-gray-900 transition-colors">I confirm that I want to cancel this appointment</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 border-2 border-teal-500 text-teal-500 hover:bg-teal-50 transition-all py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                    disabled={isSubmitting}
                >
                  Keep Appointment
                </button>
                <button
                    type="submit"
                    className={`flex-1 bg-red-500 hover:bg-red-600 transition-all text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
                        (!cancelReason || !confirmCancel || isSubmitting) ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                    disabled={!cancelReason || !confirmCancel || isSubmitting}
                >
                  {isSubmitting ? (
                      <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cancelling...
                  </span>
                  ) : 'Cancel Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default CancelAppointmentModal;