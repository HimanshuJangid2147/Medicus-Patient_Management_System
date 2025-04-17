import React, { useState, useEffect } from 'react';
import {
    FaUserMd, FaSearch, FaFilter, FaPlus, FaEdit,
    FaTrash, FaArrowLeft, FaSignOutAlt, FaBell
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { usePatientFormStore } from '../../store/usePatientFormStore.js';
import { useDoctorStore } from '../../store/useDoctorStore.js';
import toast from 'react-hot-toast';

const ManagePatients = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filters, setFilters] = useState({
        gender: 'all',
        ageRange: 'all',
        lastVisit: 'all'
    });

    const navigate = useNavigate();
    const patientStore = usePatientFormStore();
    const { doctor, logout } = useDoctorStore();

    // Fetch patients on mount
    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true);
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
                setIsLoading(false);
            }
        };

        fetchPatients();
    }, []);

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        applyFilters(e.target.value, filters);
    };

    // Apply filters
    const applyFilters = (search = searchTerm, filterOptions = filters) => {
        const term = search.toLowerCase();

        let filtered = patients.filter((patient) =>
            patient.fullName?.toLowerCase().includes(term) ||
            patient.email?.toLowerCase().includes(term)
        );

        // Apply gender filter
        if (filterOptions.gender !== 'all') {
            filtered = filtered.filter(patient =>
                patient.gender?.toLowerCase() === filterOptions.gender.toLowerCase()
            );
        }

        // Apply age range filter
        if (filterOptions.ageRange !== 'all') {
            filtered = filtered.filter(patient => {
                const age = calculateAge(patient.dateOfBirth);
                if (filterOptions.ageRange === 'under18') return age < 18;
                if (filterOptions.ageRange === '18to40') return age >= 18 && age <= 40;
                if (filterOptions.ageRange === '41to60') return age >= 41 && age <= 60;
                if (filterOptions.ageRange === 'over60') return age > 60;
                return true;
            });
        }

        // Apply last visit filter
        if (filterOptions.lastVisit !== 'all') {
            const today = new Date();
            filtered = filtered.filter(patient => {
                if (!patient.lastVisit) return filterOptions.lastVisit === 'never';

                const lastVisitDate = new Date(patient.lastVisit);
                const diffTime = Math.abs(today - lastVisitDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (filterOptions.lastVisit === 'lastMonth') return diffDays <= 30;
                if (filterOptions.lastVisit === 'last3Months') return diffDays <= 90;
                if (filterOptions.lastVisit === 'last6Months') return diffDays <= 180;
                if (filterOptions.lastVisit === 'overYear') return diffDays > 365;

                return true;
            });
        }

        setFilteredPatients(filtered);
    };

    // Update filters
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        applyFilters(searchTerm, newFilters);
    };

    // Calculate age from date of birth
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

    // Format last visit date
    const formatLastVisit = (patient) => {
        if (patient.lastVisit) {
            return new Date(patient.lastVisit).toLocaleDateString();
        }
        return "No previous visits";
    };

    // Handle edit patient
    const handleEditPatient = (patient) => {
        navigate(`/patients/edit/${patient._id}`);
    };

    // Handle delete patient
    const handleDeletePatient = async () => {
        if (!selectedPatient) return;

        try {
            const success = await patientStore.deletePatient(selectedPatient._id);
            if (success) {
                setPatients(patients.filter(p => p._id !== selectedPatient._id));
                setFilteredPatients(filteredPatients.filter(p => p._id !== selectedPatient._id));
                setShowDeleteConfirm(false);
                setSelectedPatient(null);
            }
        } catch (error) {
            console.error('Error deleting patient:', error);
            toast.error('Failed to delete patient');
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Error logging out');
        }
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
                            placeholder="Search patients..."
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
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/doctor-dashboard')}
                            className="mr-4 p-2 rounded-full hover:bg-teal-100 transition-colors"
                        >
                            <FaArrowLeft className="h-5 w-5 text-teal-600" />
                        </button>
                        <h2 className="text-3xl font-semibold text-gray-900">
                            Manage Patients
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate('/patients/add')}
                        className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200"
                    >
                        <FaPlus className="h-4 w-4 mr-2" />
                        Add New Patient
                    </button>
                </div>

                {/* Filter Controls */}
                <div className="bg-white rounded-xl shadow p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => setShowFilterMenu(!showFilterMenu)}
                                className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors mr-4"
                            >
                                <FaFilter className="h-4 w-4 mr-2 text-teal-600" />
                                Filters
                            </button>
                            {filters.gender !== 'all' || filters.ageRange !== 'all' || filters.lastVisit !== 'all' ? (
                                <div className="text-sm text-gray-600">
                                    Active filters:
                                    {filters.gender !== 'all' && (
                                        <span className="ml-2 px-2 py-1 bg-teal-100 rounded text-teal-700">{filters.gender}</span>
                                    )}
                                    {filters.ageRange !== 'all' && (
                                        <span className="ml-2 px-2 py-1 bg-teal-100 rounded text-teal-700">
                      {filters.ageRange === 'under18' ? 'Under 18' :
                          filters.ageRange === '18to40' ? '18-40' :
                              filters.ageRange === '41to60' ? '41-60' : 'Over 60'}
                    </span>
                                    )}
                                    {filters.lastVisit !== 'all' && (
                                        <span className="ml-2 px-2 py-1 bg-teal-100 rounded text-teal-700">
                      {filters.lastVisit === 'lastMonth' ? 'Last Month' :
                          filters.lastVisit === 'last3Months' ? 'Last 3 Months' :
                              filters.lastVisit === 'last6Months' ? 'Last 6 Months' :
                                  filters.lastVisit === 'overYear' ? 'Over a Year' : 'Never Visited'}
                    </span>
                                    )}
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">No filters applied</div>
                            )}
                        </div>
                        <div className="text-sm text-gray-600">
                            Total Patients: <span className="font-semibold">{filteredPatients.length}</span>
                        </div>
                    </div>

                    {/* Filter Menu */}
                    {showFilterMenu && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                            {/* Gender Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                    value={filters.gender}
                                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="all">All Genders</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Age Range Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                                <select
                                    value={filters.ageRange}
                                    onChange={(e) => handleFilterChange('ageRange', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="all">All Ages</option>
                                    <option value="under18">Under 18</option>
                                    <option value="18to40">18-40</option>
                                    <option value="41to60">41-60</option>
                                    <option value="over60">Over 60</option>
                                </select>
                            </div>

                            {/* Last Visit Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Visit</label>
                                <select
                                    value={filters.lastVisit}
                                    onChange={(e) => handleFilterChange('lastVisit', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="all">Any Time</option>
                                    <option value="lastMonth">Last Month</option>
                                    <option value="last3Months">Last 3 Months</option>
                                    <option value="last6Months">Last 6 Months</option>
                                    <option value="overYear">Over a Year</option>
                                    <option value="never">Never Visited</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Patients List */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                            <FaUserMd className="h-6 w-6 text-teal-500 mr-2" />
                            Patient Records
                        </h3>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {filteredPatients.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-gray-500">No patients found</p>
                                    <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters</p>
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Patient Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact Info
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Age/Gender
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Last Visit
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Medical Info
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredPatients.map((patient) => (
                                        <tr key={patient._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                              <span className="text-teal-600 font-semibold">
                                {(patient.fullName || 'U').charAt(0)}
                              </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{patient.fullName || 'Unknown'}</div>
                                                        <div className="text-sm text-gray-500">ID: {patient._id.substring(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{patient.email || 'No email'}</div>
                                                <div className="text-sm text-gray-500">{patient.phone || 'No phone'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{calculateAge(patient.dateOfBirth)} years</div>
                                                <div className="text-sm text-gray-500">{patient.gender || 'Not specified'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatLastVisit(patient)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 truncate max-w-xs">
                                                    {patient.medicalConditions || 'No conditions recorded'}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                    Allergies: {patient.allergies || 'None'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="p-4 text-center text-gray-500 text-sm mt-6">
                Powered by <span className="font-medium text-teal-600">Medicus</span>
            </footer>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete patient record for{' '}
                            <span className="font-semibold">{selectedPatient?.fullName || 'this patient'}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setSelectedPatient(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeletePatient}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete Patient
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePatients;