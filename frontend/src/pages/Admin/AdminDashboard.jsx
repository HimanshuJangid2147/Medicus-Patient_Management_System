import React, { useEffect, useState } from 'react';
import AppointmentModal from '../../components/AppointmentModel';
import CancelAppointmentModal from '../../components/CancelAppointmentModel';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    scheduled: 94,
    pending: 32,
    cancelled: 56,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Mock data for appointments (replace with API call later)
  useEffect(() => {
    // Simulate API loading
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockAppointments = [
        { id: 1, patient: 'Phoenix Baker', date: 'Jan 4, 2022', status: 'Scheduled', doctor: 'Dr. Alex Ramirez' },
        { id: 2, patient: 'Candice Wu', date: 'Jan 2, 2022', status: 'Pending', doctor: 'Dr. Michael May' },
        { id: 3, patient: 'Lana Steiner', date: 'Jan 4, 2022', status: 'Cancelled', doctor: 'Dr. Jasmine Lee' },
        { id: 4, patient: 'Drew Cano', date: 'Jan 8, 2022', status: 'Scheduled', doctor: 'Dr. Hardik Sharma' },
        { id: 5, patient: 'Natali Craig', date: 'Jan 6, 2022', status: 'Pending', doctor: 'Dr. Alva Cruz' },
      ];
      setAppointments(mockAppointments);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Show notification temporarily
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Status badge styling helper
  const getStatusStyle = (status) => {
    switch(status) {
      case 'Scheduled': return 'bg-green-600';
      case 'Pending': return 'bg-blue-600';
      case 'Cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  // Handle opening schedule modal
  const handleOpenScheduleModal = (appointment = null) => {
    setSelectedAppointment(appointment);
    setIsScheduleModalOpen(true);
  };

  // Handle opening cancel modal
  const handleOpenCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelModalOpen(true);
  };

  // Handle appointment scheduling
  const handleScheduleAppointment = (appointmentData) => {
    console.log('Appointment scheduled:', appointmentData);
    // In a real app, you would make an API call here
    // and then update the appointments list
    
    // For demo purposes, let's update stats
    setStats(prev => ({
      ...prev,
      scheduled: prev.scheduled + 1,
      pending: Math.max(0, prev.pending - 1)
    }));
    
    // Show success notification
    setNotification({
      type: 'success',
      message: 'Appointment scheduled successfully!'
    });
  };

  // Handle appointment cancellation
  const handleCancelAppointment = (appointmentId, reason) => {
    console.log('Appointment cancelled:', { appointmentId, reason });
    
    // Update appointment status in the list
    setAppointments(prevAppointments => 
      prevAppointments.map(app => 
        app.id === appointmentId 
          ? { ...app, status: 'Cancelled' } 
          : app
      )
    );
    
    // Update stats
    setStats(prev => ({
      ...prev,
      scheduled: Math.max(0, prev.scheduled - 1),
      cancelled: prev.cancelled + 1
    }));
    
    // Show success notification
    setNotification({
      type: 'error',
      message: 'Appointment cancelled successfully'
    });
  };

  // Mobile appointment card component
  const AppointmentCard = ({ appointment }) => (
    <div className="bg-gray-700 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full mr-2">
            {appointment.patient.charAt(0)}
          </span>
          <span className="font-medium">{appointment.patient}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mt-3">
        <div>
          <p className="text-gray-400">Date</p>
          <p>{appointment.date}</p>
        </div>
        <div>
          <p className="text-gray-400">Doctor</p>
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full mr-2">
              {appointment.doctor.split(' ')[1].charAt(0)}
            </span>
            <span>{appointment.doctor}</span>
          </div>
        </div>
      </div>
      <div className="flex mt-4 space-x-2">
        {appointment.status !== 'Cancelled' && (
          <>
            <button 
              className="bg-green-600 hover:bg-green-700 transition-colors text-white px-3 py-1 rounded flex-1"
              onClick={() => handleOpenScheduleModal(appointment)}
            >
              {appointment.status === 'Scheduled' ? 'Reschedule' : 'Schedule'}
            </button>
            <button 
              className="bg-red-600 hover:bg-red-700 transition-colors text-white px-3 py-1 rounded flex-1"
              onClick={() => handleOpenCancelModal(appointment)}
            >
              Cancel
            </button>
          </>
        )}
        {appointment.status === 'Cancelled' && (
          <button 
            className="bg-green-600 hover:bg-green-700 transition-colors text-white px-3 py-1 rounded w-full"
            onClick={() => handleOpenScheduleModal(appointment)}
          >
            Reschedule
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6 lg:p-8">
      {/* Schedule Appointment Modal */}
      <AppointmentModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleScheduleAppointment}
      />

      {/* Cancel Appointment Modal */}
      <CancelAppointmentModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        appointment={selectedAppointment}
        onCancel={handleCancelAppointment}
      />

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <p className="text-white font-medium">{notification.message}</p>
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center mr-2">
            <span className="font-bold text-white">CP</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold">CarePulse</h1>
        </div>
        <div className="flex items-center">
          <span className="mr-2 hidden md:inline">Admin</span>
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="font-bold text-white">A</span>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold">Welcome, Admin</h2>
        <p className="text-gray-400 mt-1">Start your day by managing new appointments</p>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-green-900 bg-opacity-50 p-3 rounded-lg mr-4">
              <span className="text-2xl">📅</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold">{stats.scheduled}</h3>
              <p className="text-gray-400 text-sm">Scheduled</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-blue-900 bg-opacity-50 p-3 rounded-lg mr-4">
              <span className="text-2xl">⏳</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold">{stats.pending}</h3>
              <p className="text-gray-400 text-sm">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg sm:col-span-2 lg:col-span-1">
          <div className="flex items-center">
            <div className="bg-red-900 bg-opacity-50 p-3 rounded-lg mr-4">
              <span className="text-2xl">🚫</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold">{stats.cancelled}</h3>
              <p className="text-gray-400 text-sm">Cancelled</p>
            </div>
          </div>
        </div>
      </section>

      {/* Appointments Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Appointments</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleOpenScheduleModal()}
              className="bg-green-600 hover:bg-green-700 transition-colors px-3 py-1 rounded text-sm"
            >
              New Appointment
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 transition-colors px-3 py-1 rounded text-sm">
              View All
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Mobile View (Cards) */}
            <div className="block md:hidden">
              {appointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="p-4 text-left">Patient</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Doctor</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-gray-600 hover:bg-gray-700 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full mr-2">
                            {appointment.patient.charAt(0)}
                          </span>
                          {appointment.patient}
                        </div>
                      </td>
                      <td className="p-4">{appointment.date}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full mr-2">
                            {appointment.doctor.split(' ')[1].charAt(0)}
                          </span>
                          {appointment.doctor}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          {appointment.status !== 'Cancelled' && (
                            <>
                              <button 
                                className="bg-green-600 hover:bg-green-700 transition-colors text-white px-3 py-1 rounded text-sm"
                                onClick={() => handleOpenScheduleModal(appointment)}
                              >
                                {appointment.status === 'Scheduled' ? 'Reschedule' : 'Schedule'}
                              </button>
                              <button 
                                className="bg-red-600 hover:bg-red-700 transition-colors text-white px-3 py-1 rounded text-sm"
                                onClick={() => handleOpenCancelModal(appointment)}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {appointment.status === 'Cancelled' && (
                            <button 
                              className="bg-green-600 hover:bg-green-700 transition-colors text-white px-3 py-1 rounded text-sm"
                              onClick={() => handleOpenScheduleModal(appointment)}
                            >
                              Reschedule
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;