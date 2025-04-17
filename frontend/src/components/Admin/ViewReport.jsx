import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaCalendarAlt, FaUserMd, FaUser, FaFileMedical, FaArrowLeft, FaDownload, FaFilter } from 'react-icons/fa';
import { useDoctorStore } from '../../store/useDoctorStore.js';
import { useAppointmentStore } from '../../store/useAppointmentStore.js';
import { usePatientFormStore } from '../../store/usePatientFormStore.js';
import toast from 'react-hot-toast';

// Sample chart component using recharts
const SimpleBarChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-center py-10 text-gray-500">No data available for chart</div>;
    }

    return (
        <div className="h-64 w-full">
            <div style={{ width: '100%', height: '100%' }}>
                {/* We'd normally use Recharts here, but for simplicity creating a static chart representation */}
                <div className="flex h-full items-end justify-around p-4">
                    {data.map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div
                                className="bg-teal-500 w-12 rounded-t-lg shadow-md transition-all hover:bg-teal-600"
                                style={{
                                    height: `${(item.value / Math.max(...data.map(d => d.value))) * 80}%`,
                                    minHeight: '20px'
                                }}
                            ></div>
                            <div className="mt-2 text-xs text-gray-700">{item.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ViewReports = () => {
    const navigate = useNavigate();
    const { doctor } = useDoctorStore();
    const { appointments } = useAppointmentStore();
    const { patients } = usePatientFormStore();

    const [isLoading, setIsLoading] = useState(true);
    const [reportPeriod, setReportPeriod] = useState('month');
    const [patientVisitData, setPatientVisitData] = useState([]);
    const [appointmentStats, setAppointmentStats] = useState({
        total: 0,
        completed: 0,
        cancelled: 0,
        pending: 0,
    });
    const [recentAppointments, setRecentAppointments] = useState([]);

    // Fetch data on mount
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Fetch appointments if not already in store
                let appointmentsData = appointments;
                if (!appointmentsData || appointmentsData.length === 0) {
                    appointmentsData = await useAppointmentStore.getState().getAllAppointments();
                }

                // Fetch patients if not already in store
                let patientsData = patients;
                if (!patientsData || patientsData.length === 0) {
                    patientsData = await usePatientFormStore.getState().getAllPatients();
                }

                if (appointmentsData) {
                    generateReports(appointmentsData, reportPeriod);
                }
            } catch (error) {
                console.error('Error loading report data:', error);
                toast.error('Failed to load report data');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // Handle period change
    useEffect(() => {
        if (appointments && appointments.length > 0) {
            generateReports(appointments, reportPeriod);
        }
    }, [reportPeriod]);

    // Generate report data
    const generateReports = (appointmentsData, period) => {
        // Calculate statistics
        const stats = {
            total: appointmentsData.length,
            completed: appointmentsData.filter(a => a.status === 'Completed').length,
            cancelled: appointmentsData.filter(a => a.status === 'Cancelled').length,
            pending: appointmentsData.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length,
        };
        setAppointmentStats(stats);

        // Get recent appointments
        const sorted = [...appointmentsData].sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentAppointments(sorted.slice(0, 5));

        // Generate patient visit data based on period
        const now = new Date();
        const visitData = [];

        if (period === 'week') {
            // Last 7 days
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
                const dayStr = date.toISOString().split('T')[0];

                const count = appointmentsData.filter(a =>
                    a.date.split('T')[0] === dayStr && a.status !== 'Cancelled'
                ).length;

                visitData.push({ name: dayName, value: count });
            }
        } else if (period === 'month') {
            // Last 4 weeks
            for (let i = 3; i >= 0; i--) {
                const weekStart = new Date(now);
                weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);

                const weekStartStr = weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                const weekEndStr = weekEnd.toLocaleDateString(undefined, { day: 'numeric' });

                const count = appointmentsData.filter(a => {
                    const appDate = new Date(a.date);
                    return appDate >= weekStart && appDate <= weekEnd && a.status !== 'Cancelled';
                }).length;

                visitData.push({ name: `${weekStartStr}-${weekEndStr}`, value: count });
            }
        } else if (period === 'year') {
            // Last 6 months
            for (let i = 5; i >= 0; i--) {
                const monthDate = new Date(now);
                monthDate.setMonth(monthDate.getMonth() - i);
                const monthName = monthDate.toLocaleDateString(undefined, { month: 'short' });

                const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
                const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

                const count = appointmentsData.filter(a => {
                    const appDate = new Date(a.date);
                    return appDate >= monthStart && appDate <= monthEnd && a.status !== 'Cancelled';
                }).length;

                visitData.push({ name: monthName, value: count });
            }
        }

        setPatientVisitData(visitData);
    };

    // Go back to previous page
    const handleBack = () => {
        navigate(-1);
    };

    // Simulate report download
    const handleExportReport = () => {
        toast.success('Exporting report as PDF...');
        // In a real implementation, this would generate and download a PDF
        setTimeout(() => {
            toast.success('Report downloaded successfully');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 font-sans p-25">
            {/* Header */}
            <header className="max-w-8xl mx-auto bg-white rounded-2xl shadow-xl p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <FaChartLine className="text-teal-600 mr-2" />
                            Medical Reports Dashboard
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Dr. {doctor?.name || 'Doctor'} | {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleBack}
                            className="flex items-center text-teal-600 hover:text-teal-700 px-4 py-2 border border-teal-600 rounded-lg transition-colors"
                        >
                            <FaArrowLeft className="mr-2" /> Back to Dashboard
                        </button>
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
                </div>
            ) : (
                <main className="max-w-8xl mx-auto">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-gray-500 text-sm font-medium">Total Appointments</h3>
                                <span className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                    <FaCalendarAlt />
                                </span>
                            </div>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{appointmentStats.total}</p>
                            <p className="text-xs text-gray-500 mt-1">All time</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-gray-500 text-sm font-medium">Completed</h3>
                                <span className="p-2 rounded-lg bg-green-100 text-green-600">
                                    <FaUserMd />
                                </span>
                            </div>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{appointmentStats.completed}</p>
                            <p className="text-xs text-green-500 mt-1">
                                {appointmentStats.total ?
                                    `${Math.round((appointmentStats.completed / appointmentStats.total) * 100)}% completion rate` :
                                    'No appointments yet'}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-gray-500 text-sm font-medium">Pending/Confirmed</h3>
                                <span className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                                    <FaUser />
                                </span>
                            </div>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{appointmentStats.pending}</p>
                            <p className="text-xs text-yellow-500 mt-1">Requires action</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-gray-500 text-sm font-medium">Cancelled</h3>
                                <span className="p-2 rounded-lg bg-red-100 text-red-600">
                                    <FaFileMedical />
                                </span>
                            </div>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{appointmentStats.cancelled}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {appointmentStats.total ?
                                    `${Math.round((appointmentStats.cancelled / appointmentStats.total) * 100)}% cancellation rate` :
                                    'No cancellations'}
                            </p>
                        </div>
                    </div>

                    {/* Patient Visit Chart */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Patient Visits</h2>
                                <div className="flex items-center text-sm">
                                    <label className="mr-2 text-gray-600">
                                        <FaFilter className="inline mr-1" /> Period:
                                    </label>
                                    <select
                                        value={reportPeriod}
                                        onChange={(e) => setReportPeriod(e.target.value)}
                                        className="border rounded-md p-1"
                                    >
                                        <option value="week">Last 7 Days</option>
                                        <option value="month">Last 4 Weeks</option>
                                        <option value="year">Last 6 Months</option>
                                    </select>
                                </div>
                            </div>
                            <SimpleBarChart data={patientVisitData} />
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Recent Appointments</h2>
                                <button className="text-teal-600 hover:text-teal-700 text-sm">
                                    View All
                                </button>
                            </div>

                            <div className="space-y-4">
                                {recentAppointments.length > 0 ? (
                                    recentAppointments.map((appointment, index) => (
                                        <div key={index} className="border-b last:border-b-0 pb-3 last:pb-0">
                                            <p className="font-medium">{appointment.patientName}</p>
                                            <div className="flex justify-between text-sm">
                                                <p className="text-gray-600">
                                                    {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                                                </p>
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                    appointment.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                        appointment.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {appointment.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-4">No recent appointments</p>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            )}

            {/* Footer */}
            <footer className="max-w-6xl mx-auto p-4 text-center text-gray-600 text-sm mt-6">
                <p>© {new Date().getFullYear()} Medical Practice Management System. All rights reserved.</p>
                <p className="mt-1">Data last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                <div className="mt-2">
                    <button className="text-teal-600 hover:text-teal-700 mx-2">Privacy Policy</button>
                    <span className="text-gray-400">|</span>
                    <button className="text-teal-600 hover:text-teal-700 mx-2">Terms of Service</button>
                    <span className="text-gray-400">|</span>
                    <button className="text-teal-600 hover:text-teal-700 mx-2">Contact Support</button>
                </div>
            </footer>
        </div>
    );
};

export default ViewReports;