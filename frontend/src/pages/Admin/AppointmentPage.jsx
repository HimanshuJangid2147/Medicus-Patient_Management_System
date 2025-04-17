import React, { useEffect, useState } from 'react';
import { useAppointmentStore } from '../../store/useAppointmentStore.js';
import AppointmentModal from '../../components/AppointmentModel.jsx';
import RescheduleAppointmentModal from '../../components/RescheduleModel.jsx';
import CancelAppointmentModal from '../../components/CancelAppointmentModel.jsx';
import ResponsiveList from '../../components/Admin/ResponsiveList.jsx';
import {
    CalendarIcon,
    ClockIcon,
    XCircleIcon,
    ArrowPathIcon,
    UserIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AppointmentsPage = () => {
    const {
        appointments,
        getAllAppointments,
        createAppointment,
        isLoading,
        isCreating,
        isUpdating,
    } = useAppointmentStore();

    const [appointmentStats, setAppointmentStats] = useState({ scheduled: 0, pending: 0, cancelled: 0 });
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false); // New state
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [appointmentSearchQuery, setAppointmentSearchQuery] = useState('');
    const [appointmentTab, setAppointmentTab] = useState('all');
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        const fetchAppointments = async () => {
            await getAllAppointments();
        };
        fetchAppointments();
    }, [getAllAppointments]);

    useEffect(() => {
        const stats = {
            scheduled: appointments.filter((app) => app.status === 'Scheduled').length,
            pending: appointments.filter((app) => app.status === 'Pending').length,
            cancelled: appointments.filter((app) => app.status === 'Cancelled').length,
        };
        setAppointmentStats(stats);
    }, [appointments]);

    const filteredAppointments = appointments.filter((appointment) => {
        const search = appointmentSearchQuery.toLowerCase();
        const matchesSearch =
            appointment.patientName?.toLowerCase().includes(search) ||
            appointment.doctorName?.toLowerCase().includes(search) ||
            appointment.reason?.toLowerCase().includes(search) ||
            appointment.notes?.toLowerCase().includes(search);

        if (appointmentTab === 'all') return matchesSearch;
        return matchesSearch && appointment.status.toLowerCase() === appointmentTab.toLowerCase();
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Scheduled':
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'Pending':
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 border border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Scheduled':
                return <CalendarIcon className="h-4 w-4 text-green-600" />;
            case 'Pending':
                return <ClockIcon className="h-4 w-4 text-blue-600" />;
            case 'Cancelled':
                return <XCircleIcon className="h-4 w-4 text-red-600" />;
            default:
                return null;
        }
    };

    const handleOpenScheduleModal = () => {
        setSelectedAppointment(null);
        setIsScheduleModalOpen(true);
    };

    const handleOpenRescheduleModal = (appointment) => {
        // Ensure we have a valid appointment object with the correct ID format
        const formattedAppointment = {
            _id: appointment._id || appointment.id, // Ensure we have a valid ID
            patientName: appointment.patientName || '',
            doctorName: appointment.doctorName || '',
            date: appointment.date || '',
            time: appointment.time || '',
            reason: appointment.reason || '',
            // Include any other necessary fields
        };

        // Log to verify we have a valid ID
        console.log("Opening reschedule modal with appointment ID:", formattedAppointment._id);

        setSelectedAppointment(formattedAppointment);
        setIsRescheduleModalOpen(true);
    };

    const handleScheduleAppointment = async (appointmentData) => {
        try {
            await createAppointment({
                ...appointmentData,
                status: 'Scheduled',
            });
            toast.success('New appointment created successfully!');
            setIsScheduleModalOpen(false);
        } catch (error) {
            console.error('Error creating appointment:', error);
            toast.error('There was a problem creating the appointment');
        }
    };

    const handleRescheduleSuccess = async (appointmentId, updatedData) => {
        // Ensure the appointments list is refreshed after rescheduling
        try {
            // Refresh appointments to get the updated list
            await getAllAppointments();
            setIsRescheduleModalOpen(false);
            setSelectedAppointment(null);
            toast.success('Appointment rescheduled successfully');
        } catch (error) {
            console.error('Error refreshing appointments after reschedule:', error);
            toast.error('Appointment was rescheduled but failed to refresh the list');
        }
    };

    const handleCancelSuccess = async (appointmentId, reason) => {
        try {
            const result = await useAppointmentStore.getState().cancelAppointment(appointmentId, reason);
            if (result) {
                setShowCancelModal(false);
                setSelectedAppointment(null);
                toast.success('Appointment cancelled successfully');
            }
        } catch (error) {
            toast.error('Failed to cancel appointment: ' + error);
        }
    };

    const refreshAppointments = async () => {
        try {
            await getAllAppointments();
            toast.success('Appointments refreshed');
        } catch (error) {
            toast.error('Failed to refresh appointments');
        }
    };

    const clearFilters = () => {
        setAppointmentSearchQuery('');
        setAppointmentTab('all');
    };

    const renderAppointmentCard = (appointment) => (
        <div
            key={appointment._id}
            className="bg-white rounded-lg p-5 mb-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-teal-100 text-teal-700 font-semibold rounded-full mr-3">
                        {appointment.patientName?.charAt(0) || 'P'}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{appointment.patientName || 'Unknown'}</h3>
                    </div>
                </div>
                <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(appointment.status)}`}>
                    {getStatusIcon(appointment.status)}
                    <span className="ml-1">{appointment.status}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mt-3">
                <div className="flex items-start">
                    <CalendarIcon className="h-4 w-4 mr-2 mt-0.5 text-teal-500" />
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                        <p className="font-medium">
                            {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'No date'}
                        </p>
                        <p className="text-xs">{appointment.time || 'No time set'}</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <UserIcon className="h-4 w-4 mr-2 mt-0.5 text-teal-500" />
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Doctor</p>
                        <p className="font-medium">{appointment.doctorName || 'Unknown'}</p>
                    </div>
                </div>
            </div>
            <div className="flex mt-4 space-x-2">
                {appointment.status !== 'Cancelled' && (
                    <>
                        <button
                            className="bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors px-4 py-2 rounded-md flex-1 flex items-center justify-center text-sm font-medium"
                            onClick={() => handleOpenRescheduleModal(appointment)}
                            disabled={isUpdating}
                        >
                            <ArrowPathIcon className="h-4 w-4 mr-1" />
                            Reschedule
                        </button>
                        <button
                            className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors px-4 py-2 rounded-md flex-1 flex items-center justify-center text-sm font-medium"
                            onClick={() => handleOpenCancelModal(appointment)}
                            disabled={isUpdating}
                        >
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Cancel
                        </button>
                    </>
                )}
                {appointment.status === 'Cancelled' && (
                    <button
                        className="bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors px-4 py-2 rounded-md w-full flex items-center justify-center text-sm font-medium"
                        onClick={() => handleOpenRescheduleModal(appointment)}
                        disabled={isUpdating}
                    >
                        <ArrowPathIcon className="h-4 w-4 mr-1" />
                        Reschedule
                    </button>
                )}
            </div>
        </div>
    );

    const renderAppointmentRow = (appointment) => (
        <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
            <td className="py-4 px-6">
                <div className="flex items-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-teal-100 text-teal-700 font-semibold rounded-full mr-3">
                        {appointment.patientName?.charAt(0) || 'P'}
                    </div>
                    <p className="font-medium text-gray-800">{appointment.patientName || 'Unknown'}</p>
                </div>
            </td>
            <td className="py-4 px-6">
                <p className="text-gray-800">
                    {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'No date'}
                </p>
                <p className="text-xs text-gray-500">{appointment.time || 'No time set'}</p>
            </td>
            <td className="py-4 px-6">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(appointment.status)}`}>
                    {getStatusIcon(appointment.status)}
                    <span className="ml-1">{appointment.status}</span>
                </div>
            </td>
            <td className="py-4 px-6">
                <div className="flex items-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 font-semibold rounded-full mr-2">
                        {appointment.doctorName?.split(' ')?.[1]?.charAt(0) || 'D'}
                    </div>
                    <p className="text-gray-800">{appointment.doctorName || 'Unknown'}</p>
                </div>
            </td>
            <td className="py-4 px-6">
                <div className="flex space-x-2">
                    {appointment.status !== 'Cancelled' && (
                        <>
                            <button
                                className="bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors px-3 py-1 rounded-md text-xs font-medium"
                                onClick={() => handleOpenRescheduleModal(appointment)}
                                disabled={isUpdating}
                            >
                                <ArrowPathIcon className="h-3 w-3 inline mr-1" />
                                Reschedule
                            </button>
                            <button
                                className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors px-3 py-1 rounded-md text-xs font-medium"
                                onClick={() => handleOpenCancelModal(appointment)}
                                disabled={isUpdating}
                            >
                                <XCircleIcon className="h-3 w-3 inline mr-1" />
                                Cancel
                            </button>
                        </>
                    )}
                    {appointment.status === 'Cancelled' && (
                        <button
                            className="bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors px-3 py-1 rounded-md text-xs font-medium"
                            onClick={() => handleOpenRescheduleModal(appointment)}
                            disabled={isUpdating}
                        >
                            <ArrowPathIcon className="h-3 w-3 inline mr-1" />
                            Reschedule
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );

    const handleOpenCancelModal = (appointment) => {
        const formattedAppointment = {
            _id: appointment._id,
            patientName: appointment.patientName,
            doctorName: appointment.doctorName,
            date: appointment.date,
            time: appointment.time,
            reason: appointment.reason,
        };
        setSelectedAppointment(formattedAppointment);
        setShowCancelModal(true);
    };

    return (
        <>
            <AppointmentModal
                isOpen={isScheduleModalOpen}
                onClose={() => {
                    setIsScheduleModalOpen(false);
                    setSelectedAppointment(null);
                }}
                onSchedule={handleScheduleAppointment}
                appointment={null}
                isLoading={isCreating}
            />
            <RescheduleAppointmentModal
                isOpen={isRescheduleModalOpen}
                onClose={() => {
                    setIsRescheduleModalOpen(false);
                    setSelectedAppointment(null);
                }}
                appointment={selectedAppointment}
                onReschedule={handleRescheduleSuccess}
            />
            <CancelAppointmentModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                appointment={selectedAppointment}
                onCancel={handleCancelSuccess}
            />
            <section className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Appointments Overview</h2>
                <p className="text-gray-600 mt-1">Manage all appointments here.</p>
            </section>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-lg mr-4">
                            <CalendarIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800">{appointmentStats.scheduled}</h3>
                            <p className="text-gray-600 text-sm">Scheduled Appointments</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-lg mr-4">
                            <ClockIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800">{appointmentStats.pending}</h3>
                            <p className="text-gray-600 text-sm">Pending Appointments</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center">
                        <div className="bg-red-100 p-3 rounded-lg mr-4">
                            <XCircleIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800">{appointmentStats.cancelled}</h3>
                            <p className="text-gray-600 text-sm">Cancelled Appointments</p>
                        </div>
                    </div>
                </div>
            </section>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search appointments, patients or doctors..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            value={appointmentSearchQuery}
                            onChange={(e) => setAppointmentSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            className="p-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200"
                            onClick={clearFilters}
                            title="Clear filters"
                        >
                            <AdjustmentsHorizontalIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="flex space-x-1 mt-4 border-b border-gray-200">
                    {['all', 'scheduled', 'pending', 'cancelled'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setAppointmentTab(tab)}
                            className={`px-4 py-2 text-sm font-medium ${
                                appointmentTab === tab ? 'text-teal-600 border-b-2 border-teal-500' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Appointments</h2>
                    <button
                        onClick={refreshAppointments}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Refreshing...' : 'Refresh'}
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </button>
                </div>
                <ResponsiveList
                    items={filteredAppointments}
                    renderMobileCard={renderAppointmentCard}
                    tableHeaders={['Patient', 'Date & Time', 'Status', 'Doctor', 'Actions']}
                    renderTableRow={renderAppointmentRow}
                    isLoading={isLoading}
                    emptyMessage="There are no appointments matching your current filters."
                    emptyAction={clearFilters}
                    emptyActionLabel="Clear filters"
                />
            </section>
        </>
    );
};

export default AppointmentsPage;