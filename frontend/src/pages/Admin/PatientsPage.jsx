// PatientsPage.jsx
import React, { useEffect, useState } from 'react';
import { usePatientFormStore } from '../../store/usePatientFormStore.js';
import Modal from '../../components/Admin/Model.jsx';
import ResponsiveList from '../../components/Admin/ResponsiveList.jsx';
import {
    MagnifyingGlassIcon, AdjustmentsHorizontalIcon, PlusIcon, PencilIcon, TrashIcon, CheckIcon,
    ArrowPathIcon, UserIcon
} from '@heroicons/react/24/outline';

const PatientsPage = () => {
    const {
        patients,
        getAllPatients,
        createPatient,
        updatePatientById, // Use updatePatientById
        deletePatient,
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
    } = usePatientFormStore();
    const [patientSearchQuery, setPatientSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientFormData, setPatientFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
    });

    useEffect(() => {
        getAllPatients();
    }, [getAllPatients]);

    useEffect(() => {
        const filtered = patients.filter(
            (patient) =>
                patient.fullName.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
                patient.email.toLowerCase().includes(patientSearchQuery.toLowerCase())
        );
        setFilteredPatients(filtered);
    }, [patients, patientSearchQuery]);

    useEffect(() => {
        if (!isPatientModalOpen) {
            setPatientFormData({
                fullName: '',
                email: '',
                phoneNumber: '',
                dateOfBirth: '',
                gender: '',
            });
            setSelectedPatient(null);
        }
    }, [isPatientModalOpen]);

    const handlePatientChange = (e) => {
        const { name, value } = e.target;
        setPatientFormData({ ...patientFormData, [name]: value });
    };

    const handleOpenCreatePatientModal = () => {
        setSelectedPatient(null);
        setPatientFormData({
            fullName: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: '',
            gender: '',
        });
        setIsPatientModalOpen(true);
    };

    const handleOpenEditPatientModal = (patient) => {
        setSelectedPatient(patient);
        setPatientFormData({
            fullName: patient.fullName,
            email: patient.email,
            phoneNumber: patient.phoneNumber || '',
            dateOfBirth: patient.dateOfBirth?.split('T')[0] || '',
            gender: patient.gender || '',
        });
        setIsPatientModalOpen(true);
    };

    const handleOpenDeletePatientModal = (patient) => {
        setSelectedPatient(patient);
        setIsDeleteModalOpen(true);
    };

    const handlePatientSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedPatient) {
                await updatePatientById(selectedPatient._id, patientFormData); // Use updatePatientById
            } else {
                await createPatient(patientFormData);
            }
            setIsPatientModalOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeletePatient = async () => {
        try {
            if (selectedPatient) {
                await deletePatient(selectedPatient._id);
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderPatientCard = (patient) => (
        <div key={patient._id} className="bg-white rounded-lg p-5 mb-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-teal-100 text-teal-700 font-semibold rounded-full mr-3">
                        {patient.fullName.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{patient.fullName}</h3>
                        <p className="text-xs text-gray-500">{patient.email}</p>
                    </div>
                </div>
            </div>
            <div className="text-gray-600 text-sm mt-2 mb-4">
                <p>Phone: {patient.phoneNumber || 'N/A'}</p>
                <p>DOB: {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                <p>Gender: {patient.gender || 'N/A'}</p>
            </div>
            <div className="flex justify-end space-x-2 mt-3">
                <button
                    onClick={() => handleOpenEditPatientModal(patient)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                >
                    <PencilIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={() => handleOpenDeletePatientModal(patient)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );

    const renderPatientRow = (patient) => (
        <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-semibold">
                        {patient.fullName.charAt(0)}
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{patient.fullName}</div>
                        <div className="text-sm text-gray-500">{patient.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{patient.phoneNumber || '—'}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                    {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '—'}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{patient.gender || '—'}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleOpenEditPatientModal(patient)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => handleOpenDeletePatientModal(patient)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <>
            <Modal
                isOpen={isPatientModalOpen}
                onClose={() => setIsPatientModalOpen(false)}
                title={selectedPatient ? 'Edit Patient' : 'Create New Patient'}
            >
                <form onSubmit={handlePatientSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={patientFormData.fullName}
                            onChange={handlePatientChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter patient name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={patientFormData.email}
                            onChange={handlePatientChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter patient email"
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={patientFormData.phoneNumber}
                            onChange={handlePatientChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={patientFormData.dateOfBirth}
                            onChange={handlePatientChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                            Gender
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={patientFormData.gender}
                            onChange={handlePatientChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsPatientModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating || isUpdating}
                            className="px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-md flex items-center"
                        >
                            {(isCreating || isUpdating) ? (
                                <>
                                    <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                                    {selectedPatient ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    <CheckIcon className="h-4 w-4 mr-2" />
                                    {selectedPatient ? 'Update Patient' : 'Create Patient'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Patient">
                <div className="flex items-center mb-4">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                        <TrashIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Delete Patient</h3>
                </div>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete "{selectedPatient?.fullName}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeletePatient}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md flex items-center"
                    >
                        {isDeleting ? (
                            <>
                                <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete
                            </>
                        )}
                    </button>
                </div>
            </Modal>
            <section className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Patients Overview</h2>
                <p className="text-gray-600 mt-1">View and manage all patients in the system.</p>
            </section>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <div className="bg-teal-100 p-3 rounded-lg mr-4">
                            <UserIcon className="h-6 w-6 text-teal-600" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800">{patients.length}</h3>
                            <p className="text-gray-600 text-sm">Total Patients</p>
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
                            placeholder="Search patients..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            value={patientSearchQuery}
                            onChange={(e) => setPatientSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200">
                            <AdjustmentsHorizontalIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={handleOpenCreatePatientModal}
                            className="bg-teal-500 hover:bg-teal-600 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                        >
                            <PlusIcon className="h-5 w-5 mr-1" />
                            New Patient
                        </button>
                    </div>
                </div>
            </div>
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">All Patients</h2>
                    <button
                        onClick={() => getAllPatients()}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
                    >
                        <ArrowPathIcon className="h-4 w-4 mr-1" />
                        Refresh
                    </button>
                </div>
                <ResponsiveList
                    items={filteredPatients}
                    renderMobileCard={renderPatientCard}
                    tableHeaders={['Name', 'Phone', 'Date of Birth', 'Gender', 'Actions']}
                    renderTableRow={renderPatientRow}
                    isLoading={isLoading}
                    emptyMessage={patientSearchQuery ? 'No patients match your search.' : 'No patients in the system.'}
                    emptyAction={patientSearchQuery ? () => setPatientSearchQuery('') : handleOpenCreatePatientModal}
                    emptyActionLabel={patientSearchQuery ? 'Clear search' : 'Create Patient'}
                />
            </section>
        </>
    );
};

export default PatientsPage;