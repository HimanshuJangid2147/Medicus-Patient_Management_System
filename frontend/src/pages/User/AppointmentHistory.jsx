import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppointmentStore } from '../../store/useAppointmentStore.js';
import { format } from 'date-fns';
import SuccessfulAppointment from '../../components/AppointmentSucessfull.jsx';
import CancelAppointmentModal from '../../components/CancelAppointmentModel.jsx';
import toast from 'react-hot-toast';

export default function AppointmentHistory() {
    const { getAppointmentsByPatient, isLoading } = useAppointmentStore();
    const [appointments, setAppointments] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [error, setError] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showSuccessfulView, setShowSuccessfulView] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointmentsByPatient();
                if (data) {
                    setAppointments(data);
                }
            } catch (err) {
                setError("Unable to load appointments. Please try again later.");
                console.error(err);
            }
        };

        fetchAppointments();
    }, [getAppointmentsByPatient]);

    const handleViewAppointment = (appointment) => {
        // Format appointment data for the SuccessfulAppointment component
        const formattedAppointment = {
            id: appointment._id,
            patientName: appointment.patientName || 'Patient',
            doctorName: appointment.doctorName,
            specialty: appointment.specialty || 'General',
            date: appointment.date,
            time: appointment.time,
            location: appointment.location || 'Main Hospital'
        };

        setSelectedAppointment(formattedAppointment);
        setShowSuccessfulView(true);
    };

    const handleCancelAppointment = (appointment) => {
        // Format only the essential data needed by the modal
        const formattedAppointment = {
            _id: appointment._id,
            patientName: appointment.patientName,
            doctorName: appointment.doctorName,
            date: appointment.date,
            time: appointment.time,
            reason: appointment.reason
        };

        setSelectedAppointment(formattedAppointment);
        setShowCancelModal(true);
    };

    const handleCancelSuccess = async (appointmentId, reason) => {
        try {
            // Call the store's cancelAppointment function
            const result = await useAppointmentStore.getState().cancelAppointment(appointmentId, reason);

            if (result) {
                // Close the modal after successful cancellation
                setShowCancelModal(false);
                setSelectedAppointment(null);
                toast.success('Appointment cancelled successfully');
            }
        } catch (error) {
            toast.error('Failed to cancel appointment', error);
        }
    };

    const handleBookAnother = () => {
        setShowSuccessfulView(false);
        navigate('/appointments/new');
    };

    const getAppointmentStatus = (appointment) => {
        // First check if the appointment has been cancelled
        if (appointment.status?.toLowerCase() === 'cancelled' || appointment.cancellationReason) {
            return 'cancelled';
        }

        const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
        const now = new Date();

        if (appointmentDate < now) {
            return 'completed';
        } else {
            return 'upcoming';
        }
    };

    const getStatusClass = (appointment) => {
        // Check cancellation status first
        if (appointment.status?.toLowerCase() === 'cancelled' || appointment.cancellationReason) {
            return 'bg-red-100 text-red-800'; // Cancelled style
        }

        const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
        const now = new Date();

        // If appointment is in the past
        if (appointmentDate < now) {
            return 'bg-gray-100 text-gray-700'; // Completed
        }

        // If appointment is within the next 24 hours
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (appointmentDate < tomorrow) {
            return 'bg-yellow-100 text-yellow-800'; // Upcoming soon
        }

        // Future appointments
        return 'bg-teal-100 text-teal-800'; // Scheduled
    };

    const filteredAppointments = appointments.filter(appointment => {
        if (filterStatus === 'all') return true;

        const status = getAppointmentStatus(appointment);
        return status === filterStatus;
    });

    // If viewing an appointment details
    if (showSuccessfulView && selectedAppointment) {
        return (
            <SuccessfulAppointment
                appointmentData={selectedAppointment}
                onBookAnother={handleBookAnother}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-25">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Your Appointment History</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        View and manage all your medical appointments
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        {/* Filter tabs with improved spacing and visual hierarchy */}
                        <div className="flex mb-6 border-b overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-4 py-3 font-medium text-sm transition-colors ${
                                    filterStatus === 'all'
                                        ? 'border-b-2 border-teal-500 text-teal-600 font-semibold'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                All Appointments
                            </button>
                            <button
                                onClick={() => setFilterStatus('upcoming')}
                                className={`px-4 py-3 font-medium text-sm transition-colors ${
                                    filterStatus === 'upcoming'
                                        ? 'border-b-2 border-teal-500 text-teal-600 font-semibold'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Upcoming
                            </button>
                            <button
                                onClick={() => setFilterStatus('completed')}
                                className={`px-4 py-3 font-medium text-sm transition-colors ${
                                    filterStatus === 'completed'
                                        ? 'border-b-2 border-teal-500 text-teal-600 font-semibold'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Completed
                            </button>
                            <button
                                onClick={() => setFilterStatus('cancelled')}
                                className={`px-4 py-3 font-medium text-sm transition-colors ${
                                    filterStatus === 'cancelled'
                                        ? 'border-b-2 border-teal-500 text-teal-600 font-semibold'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Cancelled
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                            </div>
                        ) : filteredAppointments.length === 0 ? (
                            <div className="text-center py-12">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 mx-auto text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <p className="mt-4 text-gray-600">
                                    {filterStatus === 'all'
                                        ? "You don't have any appointments yet."
                                        : filterStatus === 'upcoming'
                                            ? "You don't have any upcoming appointments."
                                            : filterStatus === 'cancelled'
                                                ? "You don't have any cancelled appointments."
                                                : "You don't have any completed appointments."}
                                </p>
                                <Link
                                    to="/appointments/new"
                                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 transition-all"
                                >
                                    Book an Appointment
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-hidden">
                                <ul className="divide-y divide-gray-200">
                                    {filteredAppointments.map((appointment) => {
                                        const appointmentDate = new Date(appointment.date);
                                        const formattedDate = format(appointmentDate, 'MMMM d, yyyy');
                                        const formattedTime = appointment.time;
                                        const status = getAppointmentStatus(appointment);
                                        const statusClass = getStatusClass(appointment);

                                        return (
                                            <li key={appointment._id} className="py-6 hover:bg-gray-50 transition-colors rounded-lg">
                                                <div className="flex items-center justify-between flex-wrap gap-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-7 w-7 text-teal-600"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="font-medium text-gray-900 text-lg">
                                                                Dr. {appointment.doctorName}
                                                            </div>
                                                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4 mr-1 text-gray-400"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                    />
                                                                </svg>
                                                                {formattedDate} at {formattedTime}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <span
                                                            className={`px-3 py-1.5 text-xs font-medium rounded-full ${statusClass}`}
                                                        >
                                                            {status === 'cancelled' ? 'Cancelled' :
                                                                status === 'completed' ? 'Completed' : 'Upcoming'}
                                                        </span>
                                                        <div className="flex-shrink-0 flex space-x-2">
                                                            <button
                                                                onClick={() => handleViewAppointment(appointment)}
                                                                className="bg-white text-teal-600 hover:text-teal-800 hover:bg-teal-50 font-medium py-1.5 px-4 rounded-md border border-teal-200 hover:border-teal-300 text-sm transition-all flex items-center"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4 mr-1"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                    />
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                    />
                                                                </svg>
                                                                View
                                                            </button>
                                                            {status === 'upcoming' && (
                                                                <button
                                                                    onClick={() => handleCancelAppointment(appointment)}
                                                                    className="bg-white text-red-600 hover:text-red-800 hover:bg-red-50 font-medium py-1.5 px-4 rounded-md border border-red-200 hover:border-red-300 text-sm transition-all flex items-center"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4 mr-1"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M6 18L18 6M6 6l12 12"
                                                                        />
                                                                    </svg>
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 ml-14">
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">Reason for visit:</span> {appointment.reason}
                                                    </p>
                                                    {appointment.cancellationReason && (
                                                        <p className="text-sm text-red-600 mt-1">
                                                            <span className="font-medium"> Cancellation reason:</span> {appointment.cancellationReason}
                                                        </p>
                                                    )}
                                                    {appointment.notes && !appointment.cancellationReason && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            <span className="font-medium">Notes:</span> {appointment.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link
                        to="/appointments"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 transition-all"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        Book a New Appointment
                    </Link>
                    <Link
                        to="/home"
                        className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        Return to Home
                    </Link>
                </div>
            </div>

            {/* Cancel Appointment Modal */}
            <CancelAppointmentModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                appointment={selectedAppointment}
                onCancel={handleCancelSuccess}
            />
        </div>
    );
}