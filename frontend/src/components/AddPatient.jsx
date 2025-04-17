import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientFormStore } from '../store/usePatientFormStore.js';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaHeartbeat, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AddPatient = () => {
    const navigate = useNavigate();
    const { createPatient, isCreating } = usePatientFormStore();

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'Male',
        bloodGroup: '',
        address: '',
        medicalHistory: '',
        allergies: '',
        medications: '',
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        }
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            // Handle nested objects (emergency contact)
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else {
            // Handle regular fields
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.fullName || !formData.email || !formData.phone) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const newPatient = await createPatient(formData);

            if (newPatient) {
                toast.success('Patient created successfully!');
                navigate('/doctor-patients');
            }
        } catch (error) {
            console.error('Error creating patient:', error);
            toast.error('Failed to create patient');
        }
    };

    // Go back to previous page
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 font-sans p-25">
            {/* Header */}
            <div className="max-w-8xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-teal-600 px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white flex items-center">
                        <FaUser className="mr-2" /> Add New Patient
                    </h1>
                    <button
                        onClick={handleBack}
                        className="flex items-center text-white hover:bg-teal-700 px-4 py-2 rounded-lg transition-colors"
                    >
                        <FaArrowLeft className="mr-2" /> Back
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>

                            <div>
                                <label className="block text-gray-700 mb-1">Full Name *</label>
                                <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                                    <FaUser className="text-gray-400 mr-2" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="flex-1 bg-transparent outline-none"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Email *</label>
                                <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                                    <FaEnvelope className="text-gray-400 mr-2" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="flex-1 bg-transparent outline-none"
                                        placeholder="patient@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Phone *</label>
                                <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                                    <FaPhone className="text-gray-400 mr-2" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="flex-1 bg-transparent outline-none"
                                        placeholder="(123) 456-7890"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Date of Birth</label>
                                <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                                    <FaCalendarAlt className="text-gray-400 mr-2" />
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className="flex-1 bg-transparent outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-800"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Blood Group</label>
                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-800"
                                >
                                    <option value="">Select Blood Group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-800 h-24"
                                    placeholder="Enter patient's full address"
                                ></textarea>
                            </div>
                        </div>

                        {/* Medical Information and Emergency Contact */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Medical Information</h2>

                            <div>
                                <label className="block text-gray-700 mb-1">Medical History</label>
                                <textarea
                                    name="medicalHistory"
                                    value={formData.medicalHistory}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-800 h-24"
                                    placeholder="Any previous medical conditions, surgeries, etc."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Allergies</label>
                                <textarea
                                    name="allergies"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-800 h-20"
                                    placeholder="List any allergies to medications, food, etc."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Current Medications</label>
                                <textarea
                                    name="medications"
                                    value={formData.medications}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-800 h-20"
                                    placeholder="List current medications and dosages"
                                ></textarea>
                            </div>

                            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-6">Emergency Contact</h2>

                            <div>
                                <label className="block text-gray-700 mb-1">Contact Name</label>
                                <input
                                    type="text"
                                    name="emergencyContact.name"
                                    value={formData.emergencyContact.name}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-800"
                                    placeholder="Emergency contact name"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Relationship</label>
                                <input
                                    type="text"
                                    name="emergencyContact.relationship"
                                    value={formData.emergencyContact.relationship}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-800"
                                    placeholder="Spouse, Parent, Child, etc."
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Emergency Phone</label>
                                <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                                    <FaPhone className="text-gray-400 mr-2" />
                                    <input
                                        type="tel"
                                        name="emergencyContact.phone"
                                        value={formData.emergencyContact.phone}
                                        onChange={handleChange}
                                        className="flex-1 bg-transparent outline-none"
                                        placeholder="(123) 456-7890"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                        >
                            {isCreating ? (
                                <>
                                    <div className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                                    Creating Patient...
                                </>
                            ) : (
                                <>
                                    <FaHeartbeat className="mr-2" />
                                    Add Patient
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <footer className="max-w-4xl mx-auto p-4 text-center text-gray-500 text-sm mt-6">
                Powered by <span className="font-medium text-teal-600">Medicus</span>
            </footer>
        </div>
    );
};

export default AddPatient;