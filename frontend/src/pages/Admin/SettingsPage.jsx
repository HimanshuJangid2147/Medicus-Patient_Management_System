import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore.js';
import Modal from '../../components/Admin/Model.jsx';
import {
    UserIcon, EnvelopeIcon, PhoneIcon, CogIcon, ArrowPathIcon, CheckIcon
} from '@heroicons/react/24/outline';

const SettingsPage = () => {
    const { admin, updateAdminProfile, isLoading } = useAdminStore();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileFormData, setProfileFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (admin) {
            setProfileFormData({
                name: admin.name || '',
                email: admin.email || '',
                phone: admin.phone || '',
            });
        }
    }, [admin]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileFormData({ ...profileFormData, [name]: value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateAdminProfile(profileFormData);
            setIsProfileModalOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Modal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                title="Edit Profile"
            >
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={profileFormData.name}
                            onChange={handleProfileChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter your name"
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
                            value={profileFormData.email}
                            onChange={handleProfileChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter your email"
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
                            value={profileFormData.phone}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsProfileModalOpen(false)}
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
                                    Update Profile
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
            <section className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Settings</h2>
                <p className="text-gray-600 mt-1">Manage your profile and system settings.</p>
            </section>
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Admin Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                        <UserIcon className="h-6 w-6 text-teal-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="text-gray-800 font-medium">{admin?.name || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <EnvelopeIcon className="h-6 w-6 text-teal-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-800 font-medium">{admin?.email || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <PhoneIcon className="h-6 w-6 text-teal-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-gray-800 font-medium">{admin?.phone || 'N/A'}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                        <CogIcon className="h-5 w-5 mr-2" />
                        Edit Profile
                    </button>
                </div>
            </section>
        </>
    );
};

export default SettingsPage;