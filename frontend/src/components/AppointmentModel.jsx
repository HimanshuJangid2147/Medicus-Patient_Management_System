import React, { useState, useEffect, useRef } from 'react';

// AppointmentModal Component
const AppointmentModal = ({ isOpen, onClose, onSchedule }) => {
  const [doctor, setDoctor] = useState('');
  const [reason, setReason] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const modalRef = useRef(null);
  
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

  // Mock data for available doctors
  useEffect(() => {
    const mockDoctors = [
      { id: 1, name: 'Dr. Adam Smith', specialty: 'General Physician' },
      { id: 2, name: 'Dr. Alex Ramirez', specialty: 'Cardiologist' },
      { id: 3, name: 'Dr. Michael May', specialty: 'Neurologist' },
      { id: 4, name: 'Dr. Jasmine Lee', specialty: 'Pediatrician' },
      { id: 5, name: 'Dr. Hardik Sharma', specialty: 'Dermatologist' },
    ];
    setAvailableDoctors(mockDoctors);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSchedule({ doctor, reason, appointmentDate });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-gray-900 border border-blue-900 rounded-lg w-full max-w-lg overflow-hidden shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Schedule Appointment</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6">
          <p className="text-gray-400 mb-6">Please fill in the following details to schedule</p>
          
          <form onSubmit={handleSubmit}>
            {/* Doctor Selection */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-2" htmlFor="doctor">
                Doctor
              </label>
              <div className="relative">
                <div 
                  className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {doctor ? (
                        <>
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                            <span className="text-white font-medium">
                              {doctor.split(' ')[1][0]}
                            </span>
                          </div>
                          <span className="text-white">{doctor}</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span className="text-gray-400">Select a doctor</span>
                        </>
                      )}
                    </div>
                  </div>
                  <svg 
                    className={`h-5 w-5 text-gray-400 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {availableDoctors.map((doc) => (
                      <div 
                        key={doc.id}
                        className="flex items-center p-3 hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          setDoctor(doc.name);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                          <span className="text-white font-medium">{doc.name.split(' ')[1][0]}</span>
                        </div>
                        <div>
                          <p className="text-white">{doc.name}</p>
                          <p className="text-gray-400 text-sm">{doc.specialty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Reason for appointment */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-2" htmlFor="reason">
                Reason for appointment
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="ex: Annual monthly check-up"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                rows="4"
              />
            </div>
            
            {/* Appointment Date */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-2" htmlFor="date">
                Expected appointment date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none pl-10"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white py-3 px-4 rounded-lg font-medium"
              disabled={!doctor || !reason || !appointmentDate}
            >
              Schedule appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;