import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUserMd, FaClipboardList, FaSignOutAlt, FaSearch, FaBell } from 'react-icons/fa';
import { useDoctorStore } from '../../store/useDoctorStore.js';
import { useAppointmentStore } from '../../store/useAppointmentStore.js';
import { usePatientFormStore } from '../../store/usePatientFormStore.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import AppointmentModal from '../../components/AppointmentModel';
import SuccessfulAppointment from '../../components/AppointmentSucessfull';
import CancelAppointmentModal from '../../components/CancelAppointmentModel';

const DoctorDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isSuccessView, setIsSuccessView] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [successAppointmentData, setSuccessAppointmentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPatientsLoading, setIsPatientsLoading] = useState(true);
    const [loadingReports, setLoadingReports] = useState(false); // New state for reports loading

    const navigate = useNavigate(); // Initialize useNavigate hook
    const { doctor, logout } = useDoctorStore();
    const appointmentStore = useAppointmentStore();
    const patientStore = usePatientFormStore();

    // Fetch appointments on mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const doctorAppointments = await appointmentStore.getAppointmentsByDoctor();

                if (doctorAppointments) {
                    setAppointments(doctorAppointments);
                    setFilteredAppointments(doctorAppointments);

                    // Filter for today's appointments
                    const today = new Date().toISOString().split('T')[0];
                    const todaysAppointments = doctorAppointments.filter(
                        appt => new Date(appt.date).toISOString().split('T')[0] === today
                    );
                    setFilteredAppointments(todaysAppointments);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                toast.error('Failed to load appointments');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fetch patients on mount
    useEffect(() => {
        const fetchPatients = async () => {
            setIsPatientsLoading(true);
            try {
                const patientData = await patientStore.getAllPatients();

                if (patientData) {
                    setPatients(patientData);
                    setFilteredPatients(patientData);
                }
            } catch (error) {
                console.error('Error fetching patients:', error);
                toast.error('Failed to load patients');
            } finally {
                setIsPatientsLoading(false);
            }
        };

        fetchPatients();
    }, []);

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const term = e.target.value.toLowerCase();

        const filteredAppointments = appointments.filter((appt) =>
            appt.patientName?.toLowerCase().includes(term) ||
            appt.reason?.toLowerCase().includes(term) ||
            appt.doctorName?.toLowerCase().includes(term) ||
            (appt._id && appt._id.toLowerCase().includes(term))
        );

        setFilteredAppointments(filteredAppointments);

        // Also filter patients
        const filteredPatients = patients.filter((patient) =>
            patient.name?.toLowerCase().includes(term) ||
            patient.email?.toLowerCase().includes(term)
        );
        setFilteredPatients(filteredPatients);
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

    // Handle scheduling new appointment
    const handleSchedule = async (data) => {
        try {
          // Format the data for the API
          const appointmentData = {
            patientId: data.patientId || "unknown",
            doctorId: doctor?.id || data.doctorId,
            patientName: data.patient || "New Patient",
            doctorName: data.doctor,
            date: data.appointmentDate,
            time: data.appointmentTime,
            reason: data.reason,
            notes: data.additionalComments || "",
          };
      
          const newAppointment = await appointmentStore.createAppointment(appointmentData);

            if (newAppointment) {
                // Refresh appointments
                const updatedAppointments = await appointmentStore.getAppointmentsByDoctor();
                setAppointments(updatedAppointments);

                // Update filtered appointments for today
                const today = new Date().toISOString().split('T')[0];
                const todaysAppointments = updatedAppointments.filter(
                    appt => new Date(appt.date).toISOString().split('T')[0] === today
                );
                setFilteredAppointments(todaysAppointments);

                // Show success view
                setSuccessAppointmentData(newAppointment);
                setIsSuccessView(true);
            }
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            toast.error('Failed to schedule appointment');
        }
    };

    // Handle adding a new patient
    const handleAddPatient = () => {
        // Navigate to add patient page
        navigate("/patients/add");
        toast.success("Navigating to add patient page");
    };

    // Handle viewing reports
    const handleViewReports = async () => {
        setLoadingReports(true);
        try {
            // Navigate to reports page
            navigate("/doctor/reports");
            toast.success("Navigating to reports dashboard");
        } catch (error) {
            console.error('Error accessing reports:', error);
            toast.error('Failed to load reports');
        } finally {
            setLoadingReports(false);
        }
    };

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 'N/A';

        const birthDate = new Date(dateOfBirth);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    // Handle canceling appointment
    const handleCancel = async (id, reason) => {
        try {
            const result = await appointmentStore.cancelAppointment(id, reason);

            if (result) {
                // Refresh appointments
                const updatedAppointments = await appointmentStore.getAppointmentsByDoctor();
                setAppointments(updatedAppointments);

                // Update filtered appointments for today
                const today = new Date().toISOString().split('T')[0];
                const todaysAppointments = updatedAppointments.filter(
                    appt => new Date(appt.date).toISOString().split('T')[0] === today
                );
                setFilteredAppointments(todaysAppointments);

                toast.success(`Appointment cancelled: ${reason}`);
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            toast.error('Failed to cancel appointment');
        }
    };

    // Handle rescheduling appointment
    const handleReschedule = (appointment) => {
        setSelectedAppointment(appointment);
        setIsScheduleModalOpen(true);
    };

    // Handle viewing appointment
    const handleView = (appointment) => {
        setSuccessAppointmentData(appointment);
        setIsSuccessView(true);
    };

    // Handle confirming appointment
    const handleConfirm = async (id) => {
        try {
            const result = await appointmentStore.updateAppointment(id, { status: 'Confirmed' });

            if (result) {
                // Refresh appointments
                const updatedAppointments = await appointmentStore.getAppointmentsByDoctor();
                setAppointments(updatedAppointments);

                // Update filtered appointments for today
                const today = new Date().toISOString().split('T')[0];
                const todaysAppointments = updatedAppointments.filter(
                    appt => new Date(appt.date).toISOString().split('T')[0] === today
                );
                setFilteredAppointments(todaysAppointments);

                toast.success(`Appointment confirmed`);
            }
        } catch (error) {
            console.error('Error confirming appointment:', error);
            toast.error('Failed to confirm appointment');
        }
    };

    // Handle viewing patient profile
    const handleViewPatient = (patientId) => {
        // Navigate to patient profile page
        navigate(`/patients/${patientId}`);
        toast.success("Viewing patient profile");
    };

    // Close success view
    const closeSuccessView = () => {
        setIsSuccessView(false);
        setSuccessAppointmentData(null);
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatLastVisit = (patient) => {
        if (patient.lastVisit) {
            return new Date(patient.lastVisit).toLocaleDateString();
        }

        // Check if there's an appointment history to determine the last visit
        const recentAppointment = appointments.find(
            appt => appt.patientId === patient._id &&
                new Date(appt.date) < new Date() &&
                appt.status !== 'Cancelled'
        );

        if (recentAppointment) {
            return new Date(recentAppointment.date).toLocaleDateString();
        }

        return "No previous visits";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 font-sans">
            {isSuccessView ? (
                <SuccessfulAppointment
                    appointmentData={successAppointmentData}
                    onClose={closeSuccessView}
                />
            ) : (
                <>
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
                                    placeholder="Search patients or appointments..."
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
                        <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                            Welcome, Dr. {doctor?.name || 'Doctor'}
                        </h2>

                        {/* Dashboard Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Today's Appointments */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 col-span-2">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <FaCalendarAlt className="h-6 w-6 text-teal-500 mr-2" />
                                        Today's Appointments
                                    </h3>
                                    <a href="/doctor-appointments" className="text-teal-600 hover:text-teal-700 text-sm">
                                        View All
                                    </a>
                                </div>

                                {isLoading ? (
                                    <div className="flex justify-center items-center h-40">
                                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredAppointments.length === 0 ? (
                                            <p className="text-gray-500 text-center py-10">No appointments today</p>
                                        ) : (
                                            filteredAppointments.map((appt) => (
                                                <div
                                                    key={appt._id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                                                >
                                                    <div>
                                                        <p className="text-gray-900 font-medium">{appt.patientName}</p>
                                                        <p className="text-gray-600 text-sm">
                                                            {appt.time} - {appt.reason}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span
                                                            className={`text-sm px-3 py-1 rounded-full ${
                                                                appt.status === 'Confirmed'
                                                                    ? 'bg-teal-100 text-teal-700'
                                                                    : appt.status === 'Cancelled'
                                                                        ? 'bg-red-100 text-red-700'
                                                                        : 'bg-yellow-100 text-yellow-700'
                                                            }`}
                                                        >
                                                            {appt.status}
                                                        </span>
                                                        {appt.status !== 'Cancelled' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleView(appt)}
                                                                    className="text-teal-600 hover:text-teal-700"
                                                                >
                                                                    View
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReschedule(appt)}
                                                                    className="text-teal-600 hover:text-teal-700"
                                                                >
                                                                    Reschedule
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedAppointment(appt);
                                                                        setIsCancelModalOpen(true);
                                                                    }}
                                                                    className="text-red-600 hover:text-red-700"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                {appt.status === 'Pending' && (
                                                                    <button
                                                                        onClick={() => handleConfirm(appt._id)}
                                                                        className="text-teal-600 hover:text-teal-700"
                                                                    >
                                                                        Confirm
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <FaClipboardList className="h-6 w-6 text-teal-500 mr-2" />
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleViewReports}
                                        disabled={loadingReports}
                                        className="w-full px-4 py-3 bg-white text-teal-600 border border-teal-500 rounded-lg hover:bg-teal-50 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                                    >
                                        {loadingReports ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-t-2 border-r-2 border-teal-600 rounded-full mr-2"></div>
                                                Loading Reports...
                                            </>
                                        ) : (
                                            'View Reports'
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Patient Overview */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 col-span-3">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <FaUserMd className="h-6 w-6 text-teal-500 mr-2" />
                                        Patient Overview
                                    </h3>
                                    <a href="/doctor-patients" className="text-teal-600 hover:text-teal-700 text-sm">
                                        Manage Patients
                                    </a>
                                </div>

                                {isPatientsLoading ? (
                                    <div className="flex justify-center items-center h-40">
                                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredPatients.length === 0 ? (
                                            <p className="text-gray-500 text-center py-10">No patients found</p>
                                        ) : (
                                            filteredPatients.map((patient) => (
                                                <div
                                                    key={patient._id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                                                >
                                                    <div>
                                                        <p className="text-gray-900 font-medium">{patient.fullName || 'Unknown'}</p>
                                                        <p className="text-gray-600 text-sm">
                                                            Age: {calculateAge(patient.dateOfBirth) || 'N/A'} |
                                                            Last Visit: {formatLastVisit(patient)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="p-4 text-center text-gray-500 text-sm">
                        Powered by <span className="font-medium text-teal-600">Medicus</span>
                    </footer>
                </>
            )}

            {/* Modals */}
            <AppointmentModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                onSchedule={(data) => {
                    if (selectedAppointment) {
                        // Reschedule existing appointment
                        appointmentStore.rescheduleAppointment(selectedAppointment._id, {
                            date: data.appointmentDate,
                            time: data.appointmentTime || "10:00 AM",
                            reason: data.reason,
                            doctorName: data.doctor,
                            notes: data.additionalComments || selectedAppointment.notes || ""
                        }).then(result => {
                            if (result) {
                                // Refresh appointments
                                appointmentStore.getAppointmentsByDoctor().then(updatedAppointments => {
                                    setAppointments(updatedAppointments);

                                    // Update filtered appointments for today
                                    const today = new Date().toISOString().split('T')[0];
                                    const todaysAppointments = updatedAppointments.filter(
                                        appt => new Date(appt.date).toISOString().split('T')[0] === today
                                    );
                                    setFilteredAppointments(todaysAppointments);

                                    // Show success view with updated appointment
                                    setSuccessAppointmentData(result);
                                    setIsSuccessView(true);
                                });
                            }
                        });
                    } else {
                        // Schedule new appointment
                        handleSchedule(data);
                    }
                    setSelectedAppointment(null);
                    setIsScheduleModalOpen(false);
                }}
            />
            <CancelAppointmentModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                appointment={selectedAppointment}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default DoctorDashboard;