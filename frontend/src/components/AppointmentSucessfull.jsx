import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function SuccessfulAppointment({ appointmentData }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Default appointment data in case none is provided
  const defaultAppointmentData = {
    id: 'APP123456',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    date: '2025-04-15',
    time: '10:30 AM',
    location: 'Main Hospital, Floor 3, Room 302'
  };
  
  // Use provided data or default
  const appointment = appointmentData || defaultAppointmentData;
  
  useEffect(() => {
    setIsLoaded(true);
    
    // You could add analytics tracking here
    // trackAppointmentConfirmation(appointment.id);
  }, []);
  
  // Format the appointment date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-25 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className={`transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-green-600 bg-opacity-20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          {/* Success Message */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Appointment <span className="text-green-500">Confirmed!</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Your appointment has been successfully scheduled. We're looking forward to seeing you.
            </p>
          </div>
          
          {/* Appointment Details Card */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl mb-10 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
            
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Appointment Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Appointment ID</p>
                    <p className="font-medium">{appointment.id}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Patient Name</p>
                    <p className="font-medium">{appointment.patientName}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Doctor</p>
                    <p className="font-medium">{appointment.doctorName}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Specialty</p>
                    <p className="font-medium">{appointment.specialty}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Date</p>
                    <p className="font-medium">{formatDate(appointment.date)}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Time</p>
                    <p className="font-medium">{appointment.time}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="font-medium">{appointment.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Important Information */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 mb-10">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Important Information
            </h3>
            
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Please arrive 15 minutes before your scheduled appointment time.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Bring your insurance card and a valid ID.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                If you need to cancel or reschedule, please do so at least 24 hours in advance.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Wear a mask during your visit as per our health safety protocols.
              </li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/dashboard" 
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-center"
            >
              Go to Dashboard
            </Link>
            
            <Link 
              to="/appointments" 
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-center"
            >
              Manage Appointments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}