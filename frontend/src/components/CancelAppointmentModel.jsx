import React, { useState, useEffect, useRef } from 'react';

const CancelAppointmentModal = ({ isOpen, onClose, appointment, onCancel }) => {
  const [cancelReason, setCancelReason] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const modalRef = useRef(null);
  
  // Reset form when modal opens with a new appointment
  useEffect(() => {
    if (isOpen && appointment) {
      setCancelReason('');
      setConfirmCancel(false);
    }
  }, [isOpen, appointment]);
  
  // Close modal when clicking outside
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onCancel(appointment.id, cancelReason);
    onClose();
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-gray-900 border border-red-900 rounded-lg w-full max-w-lg overflow-hidden shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Cancel Appointment</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6">
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-white mb-2">Appointment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Patient</p>
                <p className="text-white">{appointment.patient}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Date</p>
                <p className="text-white">{appointment.date}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs inline-block ${
                  appointment.status === 'Scheduled' ? 'bg-green-600' :
                  appointment.status === 'Pending' ? 'bg-blue-600' : 'bg-red-600'
                }`}>
                  {appointment.status}
                </span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Doctor</p>
                <p className="text-white">{appointment.doctor}</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Reason for Cancellation */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-2" htmlFor="cancelReason">
                Reason for cancellation
              </label>
              <textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancelling this appointment"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
                rows="3"
                required
              />
            </div>
            
            {/* Confirmation Checkbox */}
            <div className="mb-6">
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={confirmCancel}
                  onChange={(e) => setConfirmCancel(e.target.checked)}
                  className="mr-2 h-4 w-4 rounded border-gray-700 text-red-600 focus:ring-red-500"
                  required
                />
                <span>I confirm that I want to cancel this appointment</span>
              </label>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 transition-colors text-white py-3 px-4 rounded-lg font-medium"
              >
                Keep Appointment
              </button>
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 transition-colors text-white py-3 px-4 rounded-lg font-medium"
                disabled={!cancelReason || !confirmCancel}
              >
                Cancel Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;