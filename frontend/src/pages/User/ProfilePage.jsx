import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaCalendarAlt, FaUserMd, FaEdit, FaLock } from "react-icons/fa";
import { useAuthStore } from "../../store/useAuthStore.js";
import { Loader2, CheckCircle, AlertCircle, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const { authUser, isUpdatingProfile, updateUser, isCheckingAuth } = useAuthStore();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        patientId: "",
        dateOfBirth: "",
        emergencyContact: "",
        gender: ""
    });
    const [formErrors, setFormErrors] = useState({});

    // Redirect if not authenticated
    useEffect(() => {
        if (!isCheckingAuth && !authUser) {
            toast.error("You must be logged in to view this page");
            navigate("/login");
        }
    }, [authUser, isCheckingAuth, navigate]);

    // Populate form with user data when available
    useEffect(() => {
        if (authUser) {
            setFormData({
                name: authUser.name || "",
                email: authUser.email || "",
                phone: authUser.phone || "",
                patientId: authUser._id || "",
                dateOfBirth: authUser.dateOfBirth || "",
                emergencyContact: authUser.emergencyContact || "",
                gender: authUser.gender || ""
            });
        }
    }, [authUser]);

    // Form validation
    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = "Name is required";
        if (!formData.email.trim()) errors.email = "Email is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";

        if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
            errors.phone = "Phone number should have 10 digits";
        }

        if (formData.emergencyContact && !/^\d{10}$/.test(formData.emergencyContact.replace(/[^0-9]/g, ''))) {
            errors.emergencyContact = "Emergency contact should have 10 digits";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear specific error when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        try {
            await updateUser(formData);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            // Note: Toast is already shown in useAuthStore
        }
    };

    const handleCancel = () => {
        // Reset form to current user data
        if (authUser) {
            setFormData({
                name: authUser.name || "",
                email: authUser.email || "",
                phone: authUser.phone || "",
                patientId: authUser._id || "",
                dateOfBirth: authUser.dateOfBirth || "",
                emergencyContact: authUser.emergencyContact || "",
                gender: authUser.gender || ""
            });
        }
        setFormErrors({});
        setIsEditing(false);
    };

    // Show loading state while checking authentication
    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-teal-600" />
                    <p className="mt-4 text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    // Format phone number for display
    const formatPhoneNumber = (phoneNumberString) => {
        if (!phoneNumberString) return "";
        const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phoneNumberString;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header with hospital logo */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-teal-600 rounded-md flex items-center justify-center mr-3">
                            <FaUserMd className="text-white text-xl" />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800">Medicus Health System</h1>
                    </div>
                    <div className="text-sm text-teal-600 font-medium">
                        Patient Portal
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Page title */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                        <p className="mt-1 text-gray-600">
                            View and manage your personal information
                        </p>
                    </div>

                    {/* Profile content */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {/* Profile banner */}
                        <div className="h-24 bg-gradient-to-r from-teal-500 to-teal-700 relative">
                            <div className="absolute -bottom-12 left-8">
                                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                                    <div className="w-full h-full rounded-full bg-teal-100 flex items-center justify-center">
                                        <FaUser className="text-teal-600 text-3xl" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile body */}
                        <div className="pt-16 pb-8 px-8">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Left sidebar */}
                                <div className="md:w-1/3">
                                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                        <h3 className="font-semibold text-xl text-gray-800 mb-2">
                                            {formData.name || "Himanshu Jangid"}
                                        </h3>
                                        <div className="flex items-center mb-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                                Active Patient
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs font-medium text-gray-500 uppercase">Patient ID</div>
                                                <div className="flex items-center mt-1">
                                                    <FaIdCard className="text-teal-500 mr-2" />
                                                    <span className="text-gray-700">{formData.patientId || "67f7b602887e6773fa261416"}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-xs font-medium text-gray-500 uppercase">Date of Birth</div>
                                                <div className="flex items-center mt-1">
                                                    <FaCalendarAlt className="text-teal-500 mr-2" />
                                                    <span className="text-gray-700">{formData.dateOfBirth || "Not provided"}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-xs font-medium text-gray-500 uppercase">Gender</div>
                                                <div className="flex items-center mt-1">
                                                    <FaUser className="text-teal-500 mr-2" />
                                                    <span className="text-gray-700">{formData.gender || "male"}</span>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <h4 className="font-medium text-gray-700 mb-3">Quick Actions</h4>
                                            <div className="space-y-2">
                                                <a href="/appointments" className="block text-sm text-teal-600 hover:text-teal-800 hover:underline">
                                                    Schedule Appointment
                                                </a>
                                                <a href="/appointment-history" className="block text-sm text-teal-600 hover:text-teal-800 hover:underline">
                                                    View Appointment Records
                                                </a>
                                                <a href="/contact" className="block text-sm text-teal-600 hover:text-teal-800 hover:underline">
                                                    Contact Us
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right content */}
                                <div className="md:w-2/3">
                                    <div className="mb-6 flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                                        {!isEditing && (
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center text-sm font-medium text-teal-600 hover:text-teal-800"
                                            >
                                                <FaEdit className="mr-1" /> Edit Details
                                            </button>
                                        )}
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Name */}
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Full Name
                                                </label>
                                                <div className="relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                        <FaUser className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        value={formData.name || "Himanshu Jangid"}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full pl-10 pr-4 py-2 border ${
                                                            formErrors.name ? "border-red-300 focus:ring-red-500 focus:border-red-500" :
                                                                isEditing ? "border-teal-300 focus:ring-teal-500 focus:border-teal-500" : "border-gray-300"
                                                        } rounded-md ${!isEditing ? "bg-gray-50 cursor-not-allowed" : "bg-white"}`}
                                                    />
                                                </div>
                                                {formErrors.name && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                                                )}
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email Address
                                                </label>
                                                <div className="relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                        <FaEnvelope className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={formData.email || "jmonmac755@gmail.com"}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full pl-10 pr-4 py-2 border ${
                                                            formErrors.email ? "border-red-300 focus:ring-red-500 focus:border-red-500" :
                                                                isEditing ? "border-teal-300 focus:ring-teal-500 focus:border-teal-500" : "border-gray-300"
                                                        } rounded-md ${!isEditing ? "bg-gray-50 cursor-not-allowed" : "bg-white"}`}
                                                    />
                                                </div>
                                                {formErrors.email && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                                )}
                                            </div>

                                            {/* Phone */}
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Phone Number
                                                </label>
                                                <div className="relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                        <FaPhone className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        id="phone"
                                                        name="phone"
                                                        value={formData.phone || "(XXX) XXX-XXXX"}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        placeholder="(XXX) XXX-XXXX"
                                                        className={`w-full pl-10 pr-4 py-2 border ${
                                                            formErrors.phone ? "border-red-300 focus:ring-red-500 focus:border-red-500" :
                                                                isEditing ? "border-teal-300 focus:ring-teal-500 focus:border-teal-500" : "border-gray-300"
                                                        } rounded-md ${!isEditing ? "bg-gray-50 cursor-not-allowed" : "bg-white"}`}
                                                    />
                                                </div>
                                                {formErrors.phone && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                                                )}
                                            </div>

                                            {/* Emergency Contact */}
                                            <div>
                                                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Emergency Contact
                                                </label>
                                                <div className="relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                        <FaPhone className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        id="emergencyContact"
                                                        name="emergencyContact"
                                                        value={formData.emergencyContact || "(XXX) XXX-XXXX"}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        placeholder="(XXX) XXX-XXXX"
                                                        className={`w-full pl-10 pr-4 py-2 border ${
                                                            formErrors.emergencyContact ? "border-red-300 focus:ring-red-500 focus:border-red-500" :
                                                                isEditing ? "border-teal-300 focus:ring-teal-500 focus:border-teal-500" : "border-gray-300"
                                                        } rounded-md ${!isEditing ? "bg-gray-50 cursor-not-allowed" : "bg-white"}`}
                                                    />
                                                </div>
                                                {formErrors.emergencyContact && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.emergencyContact}</p>
                                                )}
                                            </div>

                                            {/* Gender */}
                                            {isEditing && (
                                                <div>
                                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Gender
                                                    </label>
                                                    <div className="relative rounded-md shadow-sm">
                                                        <select
                                                            id="gender"
                                                            name="gender"
                                                            value={formData.gender || "male"}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-3 pr-4 py-2 border border-teal-300 focus:ring-teal-500 focus:border-teal-500 rounded-md"
                                                        >
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="non-binary">Non-binary</option>
                                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Date of Birth - enabled only when editing */}
                                            {isEditing && (
                                                <div>
                                                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Date of Birth
                                                    </label>
                                                    <div className="relative rounded-md shadow-sm">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                            <FaCalendarAlt className="text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="date"
                                                            id="dateOfBirth"
                                                            name="dateOfBirth"
                                                            value={formData.dateOfBirth}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-10 pr-4 py-2 border border-teal-300 focus:ring-teal-500 focus:border-teal-500 rounded-md"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Privacy Notice */}
                                        <div className="mt-4 bg-blue-50 rounded-lg p-4 flex items-start">
                                            <Shield className="text-blue-500 mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                                            <div>
                                                <h4 className="text-sm font-medium text-blue-800">Privacy Protection</h4>
                                                <p className="text-xs text-blue-700 mt-1">
                                                    Your personal information is protected under HIPAA guidelines. Medicus does not share your data with third parties without your explicit consent.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        {isEditing && (
                                            <div className="flex justify-end space-x-3 mt-6">
                                                <button
                                                    type="button"
                                                    onClick={handleCancel}
                                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-sm"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isUpdatingProfile}
                                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center"
                                                >
                                                    {isUpdatingProfile ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </form>

                                    {/* Security section */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Account Security</h3>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <FaLock className="text-teal-600 mr-3" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-800">Password & Authentication</h4>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Last updated {authUser?.lastPasswordUpdate ? new Date(authUser.lastPasswordUpdate).toLocaleDateString() : 'Never'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <a
                                                    href="/reset-password"
                                                    className="text-sm font-medium text-teal-600 hover:text-teal-800 hover:underline"
                                                >
                                                    Update
                                                </a>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <AlertCircle className="text-amber-500 mr-3 h-5 w-5" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-800">Two-Factor Authentication</h4>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Coming Soon
                                                        </p>
                                                    </div>
                                                </div>
                                                <a
                                                    className="text-sm font-medium text-teal-600 hover:text-teal-800 hover:underline"
                                                >
                                                    Coming Soon
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;