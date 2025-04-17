import React, { useEffect, useState } from 'react';
import { useDoctorStore } from '../../store/useDoctorStore.js';
import Modal from '../../components/admin/Model.jsx';
import ResponsiveList from '../../components/admin/ResponsiveList.jsx';
import {
    MagnifyingGlassIcon, AdjustmentsHorizontalIcon, PlusIcon, PencilIcon, TrashIcon, CheckIcon,
    ArrowPathIcon, UserIcon
} from '@heroicons/react/24/outline';

const DoctorsPage = () => {
    const {
        getAllDoctors,
        updateDoctor,
        deleteDoctor,
        getDoctorById,
        isLoading,
    } = useDoctorStore();
    const [doctors, setDoctors] = useState([]);
    const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorFormData, setDoctorFormData] = useState({
        name: '',
        email: '',
        specialty: '',
        phone: '',
    });

    useEffect(() => {
        const fetchDoctors = async () => {
            const data = await getAllDoctors();
            if (data) setDoctors(data);
        };
        fetchDoctors();
    }, [getAllDoctors]);

    useEffect(() => {
        const filtered = doctors.filter(
            (doctor) =>
                doctor.name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
                doctor.email.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
                doctor.specialty.toLowerCase().includes(doctorSearchQuery.toLowerCase())
        );
        setFilteredDoctors(filtered);
    }, [doctors, doctorSearchQuery]);

    useEffect(() => {
        if (!isDoctorModalOpen) {
            setDoctorFormData({ name: '', email: '', specialty: '', phone: '' });
            setSelectedDoctor(null);
        }
    }, [isDoctorModalOpen]);

    const handelDeleteDoctor = async () => {
        try {
            if (selectedDoctor) {
                await deleteDoctor(selectedDoctor._id);
                setDoctors((prev) => prev.filter((doc) => doc._id !== selectedDoctor._id));
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDoctorChange = (e) => {
        const { name, value } = e.target;
        setDoctorFormData({ ...doctorFormData, [name]: value });
    };

    const handleOpenEditDoctorModal = async (doctor) => {
        const doctorData = await getDoctorById(doctor._id);
        if (doctorData) {
            setSelectedDoctor(doctorData);
            setDoctorFormData({
                name: doctorData.name,
                email: doctorData.email,
                specialty: doctorData.specialty || '',
                phone: doctorData.phone || '',
            });
            setIsDoctorModalOpen(true);
        }
    };

    const handleDoctorSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedDoctor) {
                await updateDoctor(doctorFormData);
                setDoctors((prev) =>
                    prev.map((doc) => (doc._id === selectedDoctor._id ? { ...doc, ...doctorFormData } : doc))
                );
            }
            setIsDoctorModalOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const renderDoctorCard = (doctor) => (
        <div key={doctor._id} className="bg-white rounded-lg p-5 mb-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-teal-100 text-teal-700 font-semibold rounded-full mr-3">
                        {doctor.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                        <p className="text-xs text-gray-500">{doctor.specialty}</p>
                    </div>
                </div>
            </div>
            <div className="text-gray-600 text-sm mt-2 mb-4">
                <p>Email: {doctor.email}</p>
                <p>Phone: {doctor.phone || 'N/A'}</p>
            </div>
            <div className="flex justify-end space-x-2 mt-3">
                <button
                    onClick={() => handleOpenEditDoctorModal(doctor)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                >
                    <PencilIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={() => {
                        setSelectedDoctor(doctor);
                        setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );

    const renderDoctorRow = (doctor) => (
        <tr key={doctor._id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-semibold">
                        {doctor.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                        <div className="text-sm text-gray-500">{doctor.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{doctor.specialty || '—'}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{doctor.phone || '—'}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex space-x-2">
                    {/*<button*/}
                    {/*    onClick={() => handleOpenEditDoctorModal(doctor)}*/}
                    {/*    className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"*/}
                    {/*>*/}
                    {/*    <PencilIcon className="h-5 w-5" />*/}
                    {/*</button>*/}
                    <button
                        onClick={() => {
                            setSelectedDoctor(doctor);
                            setIsDeleteModalOpen(true);
                        }}
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
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Doctor"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete {selectedDoctor?.name}? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handelDeleteDoctor}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md flex items-center"
                        >
                            {isLoading ? (
                                <>
                                    <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <TrashIcon className="h-4 w-4 mr-2" />
                                    Delete Doctor
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={isDoctorModalOpen}
                onClose={() => setIsDoctorModalOpen(false)}
                title={selectedDoctor ? 'Edit Doctor' : 'Create New Doctor'}
            >
                <form onSubmit={handleDoctorSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={doctorFormData.name}
                            onChange={handleDoctorChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter doctor name"
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
                            value={doctorFormData.email}
                            onChange={handleDoctorChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter doctor email"
                        />
                    </div>
                    <div>
                        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                            Specialty
                        </label>
                        <input
                            type="text"
                            id="specialty"
                            name="specialty"
                            value={doctorFormData.specialty}
                            onChange={handleDoctorChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter specialty"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={doctorFormData.phone}
                            onChange={handleDoctorChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsDoctorModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-md flex items-center"
                        >
                            {isLoading ? (
                                <>
                                    <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <CheckIcon className="h-4 w-4 mr-2" />
                                    Update Doctor
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
            <section className="mb-8">
                <h2 className="text-2xl md:text-cations3xl font-bold text-gray-800">Doctors Overview</h2>
                <p className="text-gray-600 mt-1">Manage all doctors here.</p>
            </section>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <div className="bg-teal-100 p-3 rounded-lg mr-4">
                            <UserIcon className="h-6 w-6 text-teal-600" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800">{doctors.length}</h3>
                            <p className="text-gray-600 text-sm">Total Doctors</p>
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
                            placeholder="Search doctors..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            value={doctorSearchQuery}
                            onChange={(e) => setDoctorSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200">
                            <AdjustmentsHorizontalIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">All Doctors</h2>
                    <button
                        onClick={async () => {
                            const data = await getAllDoctors();
                            if (data) setDoctors(data);
                        }}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
                    >
                        <ArrowPathIcon className="h-4 w-4 mr-1" />
                        Refresh
                    </button>
                </div>
                <ResponsiveList
                    items={filteredDoctors}
                    renderMobileCard={renderDoctorCard}
                    tableHeaders={['Name', 'Specialty', 'Phone', 'Actions']}
                    renderTableRow={renderDoctorRow}
                    isLoading={isLoading}
                    emptyMessage={doctorSearchQuery ? 'No doctors match your search.' : 'No doctors available.'}
                    emptyAction={() => setDoctorSearchQuery('')}
                    emptyActionLabel={doctorSearchQuery ? 'Clear search' : null}
                />
            </section>
        </>
    );
};

export default DoctorsPage;