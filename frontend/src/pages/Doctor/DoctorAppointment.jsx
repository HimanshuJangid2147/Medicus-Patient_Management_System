import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaHistory, FaUserMd, FaClipboardList, FaSignOutAlt, FaSearch, FaBell } from 'react-icons/fa';
import { useDoctorStore } from '../../store/useDoctorStore.js';
import { useAppointmentStore } from '../../store/useAppointmentStore.js';
import toast from 'react-hot-toast';
import AppointmentModal from '../../components/AppointmentModel';
import RescheduleAppointmentModal from '../../components/RescheduleModel'; // Import the RescheduleAppointmentModal
import CancelAppointmentModal from '../../components/CancelAppointmentModel';

const DoctorAppointmentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [allAppointments, setAllAppointments] = useState([]);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [historyAppointments, setHistoryAppointments] = useState([]);
    const [displayedAppointments, setDisplayedAppointments] = useState([]);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false); // Add state for reschedule modal
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'today', 'history'
    const [isLoading, setIsLoading] = useState(true);

    const { doctor, logout } = useDoctorStore();
    const appointmentStore = useAppointmentStore();

    // Fetch all appointments on mount
    useEffect(() => {
        fetchAppointments();
    }, []);

    // Create a reusable function to fetch and categorize appointments
    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const appointments = await appointmentStore.getAppointmentsByDoctor();

            if (appointments) {
                const today = new Date().toISOString().split('T')[0];

                // Categorize appointments
                const history = appointments.filter(appt =>
                    appt.status === 'Completed' ||
                    appt.status === 'Cancelled' ||
                    new Date(appt.date) < new Date(today)
                );

                const todayAppts = appointments.filter(appt =>
                    new Date(appt.date).toISOString().split('T')[0] === today &&
                    appt.status !== 'Completed' &&
                    appt.status !== 'Cancelled'
                );

                const active = appointments.filter(appt =>
                    appt.status !== 'Completed' &&
                    appt.status !== 'Cancelled'
                );

                setAllAppointments(active);
                setTodayAppointments(todayAppts);
                setHistoryAppointments(history);
                setDisplayedAppointments(active); // Default to showing all active appointments
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            toast.error('Failed to load appointments');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const term = e.target.value.toLowerCase();

        let appointmentsToFilter;

        // Determine which collection to filter based on active tab
        if (activeTab === 'today') {
            appointmentsToFilter = todayAppointments;
        } else if (activeTab === 'history') {
            appointmentsToFilter = historyAppointments;
        } else {
            appointmentsToFilter = allAppointments;
        }

        // Filter the appointments
        const filtered = appointmentsToFilter.filter((appt) =>
            appt.patientName?.toLowerCase().includes(term) ||
            appt.reason?.toLowerCase().includes(term) ||
            (appt._id && appt._id.toLowerCase().includes(term)) ||
            appt.doctorName?.toLowerCase().includes(term) ||
            appt.status?.toLowerCase().includes(term)
        );

        setDisplayedAppointments(filtered);
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Error logging out');
        }
    };

    // Handle canceling appointment
    const handleCancel = async (id, reason) => {
        try {
            const result = await appointmentStore.cancelAppointment(id, reason);

            if (result) {
                // Refresh appointments after cancellation
                await fetchAppointments();
                toast.success(`Appointment cancelled: ${reason}`);
                setIsCancelModalOpen(false);
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            toast.error('Failed to cancel appointment');
        }
    };

    // Handle confirming appointment
    const handleConfirm = async (id) => {
        try {
            const result = await appointmentStore.updateAppointment(id, { status: 'Confirmed' });

            if (result) {
                // Update the appointment status locally first for immediate feedback
                setDisplayedAppointments(displayedAppointments.map(appt =>
                    appt._id === id ? { ...appt, status: 'Confirmed' } : appt
                ));

                setAllAppointments(allAppointments.map(appt =>
                    appt._id === id ? { ...appt, status: 'Confirmed' } : appt
                ));

                setTodayAppointments(todayAppointments.map(appt =>
                    appt._id === id ? { ...appt, status: 'Confirmed' } : appt
                ));

                toast.success(`Appointment confirmed`);
            }
        } catch (error) {
            console.error('Error confirming appointment:', error);
            toast.error('Failed to confirm appointment');
        }
    };

    // Handle viewing appointment details
    const handleViewDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setIsDetailViewOpen(true);
    };

    // Handle scheduling new appointment
    const handleSchedule = async (data) => {
        try {
            // Format the data for the API
            const appointmentData = {
                patientId: data.patientId || "unknown", // You might want to get this from the form
                doctorId: doctor?.id,
                patientName: data.patient || "New Patient",
                doctorName: data.doctor,
                date: data.appointmentDate,
                time: data.appointmentTime || "10:00 AM",
                reason: data.reason,
                notes: data.additionalComments || "",
            };

            const newAppointment = await appointmentStore.createAppointment(appointmentData);

            if (newAppointment) {
                // Refresh appointments after creating new one
                await fetchAppointments();
                toast.success('Appointment scheduled successfully');
                setIsScheduleModalOpen(false);
            }
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            toast.error('Failed to schedule appointment');
        }
    };

    // Handle rescheduling appointment
    const handleReschedule = async (appointmentId, updatedData) => {
        try {
            // Update the appointment with the new date and time
            const result = await appointmentStore.rescheduleAppointment(appointmentId, {
                date: updatedData.appointmentDate,
                time: updatedData.appointmentTime
            });

            if (result) {
                // Refresh appointments after rescheduling
                await fetchAppointments();
                toast.success('Appointment rescheduled successfully');
                setIsRescheduleModalOpen(false);
            }
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            toast.error('Failed to reschedule appointment');
        }
    };

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchTerm('');

        // Update displayed appointments based on tab
        if (tab === 'today') {
            setDisplayedAppointments(todayAppointments);
        } else if (tab === 'history') {
            setDisplayedAppointments(historyAppointments);
        } else {
            setDisplayedAppointments(allAppointments);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 font-sans">
            {/* Header */}
            <header className="bg-white shadow-md p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <img src="./src/assets/logos/logoo.svg" alt="Logo" className="h-8" />
                    <h1 className="text-2xl font-bold text-teal-600">&nbsp;Medicus</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <FaSearch className="h-5 w-5" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    <button className="p-2 text-gray-600 hover:text-teal-600 relative">
                        <FaBell className="h-6 w-6" />
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-gray-600 hover:text-teal-600 transition-colors"
                    >
                        <FaSignOutAlt className="h-5 w-5 mr-2" />
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold text-gray-900">
                        Appointments
                    </h2>
                    <button
                        onClick={() => {
                            setSelectedAppointment(null);
                            setIsScheduleModalOpen(true);
                        }}
                        className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200 flex items-center"
                    >
                        <FaCalendarAlt className="mr-2" />
                        Schedule New Appointment
                    </button>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="flex space-x-2 border-b border-gray-200">
                        <button
                            onClick={() => handleTabChange('all')}
                            className={`py-2 px-4 font-medium ${
                                activeTab === 'all'
                                    ? 'text-teal-600 border-b-2 border-teal-500'
                                    : 'text-gray-500 hover:text-teal-600'
                            }`}
                        >
                            All Appointments
                        </button>
                        <button
                            onClick={() => handleTabChange('today')}
                            className={`py-2 px-4 font-medium ${
                                activeTab === 'today'
                                    ? 'text-teal-600 border-b-2 border-teal-500'
                                    : 'text-gray-500 hover:text-teal-600'
                            }`}
                        >
                            Today's Appointments
                        </button>
                        <button
                            onClick={() => handleTabChange('history')}
                            className={`py-2 px-4 font-medium ${
                                activeTab === 'history'
                                    ? 'text-teal-600 border-b-2 border-teal-500'
                                    : 'text-gray-500 hover:text-teal-600'
                            }`}
                        >
                            Appointment History
                        </button>
                    </div>
                </div>

                {/* Appointment List */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                            {activeTab === 'all' && (
                                <>
                                    <FaCalendarAlt className="h-6 w-6 text-teal-500 mr-2" />
                                    All Appointments
                                </>
                            )}
                            {activeTab === 'today' && (
                                <>
                                    <FaCalendarAlt className="h-6 w-6 text-teal-500 mr-2" />
                                    Today's Appointments
                                </>
                            )}
                            {activeTab === 'history' && (
                                <>
                                    <FaHistory className="h-6 w-6 text-teal-500 mr-2" />
                                    Appointment History
                                </>
                            )}
                        </h3>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Loading appointments...</p>
                        </div>
                    ) : displayedAppointments.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No appointments found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Patient
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reason
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {displayedAppointments.map((appointment) => (
                                    <tr key={appointment._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {appointment._id?.substring(0, 8) || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {appointment.patientName || "Unknown Patient"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(appointment.date)} at {appointment.time || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {appointment.reason || "General Visit"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    appointment.status === 'Confirmed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : appointment.status === 'Pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : appointment.status === 'Cancelled'
                                                                ? 'bg-red-100 text-red-800'
                                                                : appointment.status === 'Completed'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {appointment.status || "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleViewDetails(appointment)}
                                                    className="text-teal-600 hover:text-teal-800"
                                                >
                                                    View
                                                </button>

                                                {activeTab !== 'history' && appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
                                                    <>
                                                        {appointment.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleConfirm(appointment._id)}
                                                                className="text-green-600 hover:text-green-800"
                                                            >
                                                                Confirm
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                setSelectedAppointment(appointment);
                                                                setIsRescheduleModalOpen(true); // Open reschedule modal instead
                                                            }}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            Reschedule
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedAppointment(appointment);
                                                                setIsCancelModalOpen(true);
                                                            }}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="p-4 text-center text-gray-500 text-sm">
                Powered by <span className="font-medium text-teal-600">Medicus</span>
            </footer>

            {/* Appointment Details Modal */}
            {isDetailViewOpen && selectedAppointment && (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 backdrop-blur-md">
                    <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Appointment Details</h3>
                            <button
                                onClick={() => setIsDetailViewOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-teal-50 p-4 rounded-lg">
                                <p className="text-lg font-semibold text-teal-800">
                                    {selectedAppointment._id?.substring(0, 8) || "N/A"}
                                </p>
                                <p className="text-sm text-teal-600">
                                    {formatDate(selectedAppointment.date)} at {selectedAppointment.time || "N/A"}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Patient</p>
                                    <p className="font-medium">{selectedAppointment.patientName || "Unknown Patient"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Doctor</p>
                                    <p className="font-medium">{selectedAppointment.doctorName || doctor?.name || "Current Doctor"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Reason</p>
                                    <p className="font-medium">{selectedAppointment.reason || "General Visit"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            selectedAppointment.status === 'Confirmed'
                                                ? 'bg-green-100 text-green-800'
                                                : selectedAppointment.status === 'Pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : selectedAppointment.status === 'Cancelled'
                                                        ? 'bg-red-100 text-red-800'
                                                        : selectedAppointment.status === 'Completed'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {selectedAppointment.status || "Pending"}
                                    </span>
                                </div>
                                {selectedAppointment.specialty && (
                                    <div>
                                        <p className="text-sm text-gray-500">Specialty</p>
                                        <p className="font-medium">{selectedAppointment.specialty}</p>
                                    </div>
                                )}
                                {selectedAppointment.location && (
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-medium">{selectedAppointment.location}</p>
                                    </div>
                                )}
                            </div>

                            {selectedAppointment.notes && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500">Notes</p>
                                    <p className="text-gray-700 border-l-2 border-teal-500 pl-3 mt-1">
                                        {selectedAppointment.notes}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end space-x-2 mt-6">
                                {activeTab !== 'history' && selectedAppointment.status !== 'Completed' && selectedAppointment.status !== 'Cancelled' && (
                                    <>
                                        {selectedAppointment.status === 'Pending' && (
                                            <button
                                                onClick={() => {
                                                    handleConfirm(selectedAppointment._id);
                                                    setIsDetailViewOpen(false);
                                                }}
                                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            >
                                                Confirm
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                setIsRescheduleModalOpen(true); // Open reschedule modal
                                                setIsDetailViewOpen(false);
                                            }}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            Reschedule
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsCancelModalOpen(true);
                                                setIsDetailViewOpen(false);
                                            }}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => setIsDetailViewOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule New Appointment Modal */}
            <AppointmentModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                onSchedule={handleSchedule}
                appointment={null} // For new appointments, pass null
            />

            {/* Reschedule Modal - Use the dedicated RescheduleAppointmentModal component */}
            <RescheduleAppointmentModal
                isOpen={isRescheduleModalOpen}
                onClose={() => setIsRescheduleModalOpen(false)}
                appointment={selectedAppointment}
                onReschedule={handleReschedule}
            />

            {/* Cancel Modal */}
            <CancelAppointmentModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                appointment={selectedAppointment}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default DoctorAppointmentsPage;