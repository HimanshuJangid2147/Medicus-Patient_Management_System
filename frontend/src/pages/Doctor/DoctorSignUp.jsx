import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserMd, FaIdCard, FaInfoCircle } from 'react-icons/fa';
import { useDoctorStore } from "../../store/useDoctorStore.js";
import toast from 'react-hot-toast';

const DoctorSignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: 'male',
        specialty: '',
        bio: '',
        availability: 'No',
        image: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const { doctorSignup, isLoading, isSigningUp } = useDoctorStore();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setErrors((prev) => ({
                ...prev,
                image: 'Please select an image file',
            }));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                image: reader.result,
            }));
            setImagePreview(reader.result);

            // Clear any previous error
            if (errors.image) {
                setErrors((prev) => ({
                    ...prev,
                    image: null,
                }));
            }
        };
        reader.readAsDataURL(file);
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Specialty validation
        if (!formData.specialty.trim()) {
            newErrors.specialty = 'Specialty is required';
        }

        // Bio validation
        if (!formData.bio.trim()) {
            newErrors.bio = 'Bio is required';
        } else if (formData.bio.length < 20) {
            newErrors.bio = 'Bio must be at least 20 characters';
        }

        // Terms agreement validation
        if (!agreeToTerms) {
            newErrors.terms = 'You must agree to the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await doctorSignup(formData);
        } catch (error) {
            console.error('Signup error:', error);
            toast.error('An unexpected error occurred. Please try again.');
        }
    };

    // List of specialties
    const specialties = [
        'Cardiology',
        'Dermatology',
        'Endocrinology',
        'Gastroenterology',
        'Neurology',
        'Obstetrics and Gynecology',
        'Oncology',
        'Ophthalmology',
        'Orthopedics',
        'Pediatrics',
        'Psychiatry',
        'Pulmonology',
        'Radiology',
        'Urology',
        'Other'
    ];

    // Determine if signup button should be disabled
    const isSignupButtonDisabled = isLoading || isSigningUp || !formData.name || !formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.specialty || !formData.bio || !agreeToTerms;

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 font-sans">
            {/* Signup Card - Wider with horizontal layout */}
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up">
                {/* Two-column layout */}
                <div className="flex flex-col md:flex-row">
                    {/* Left sidebar with logo and profile image upload */}
                    <div className="bg-teal-600 p-8 md:w-1/4 flex flex-col items-center justify-between text-white">
                        <div className="w-full">
                            {/* Logo */}
                            <div className="flex items-center justify-center mb-12">
                                <img src="./src/assets/logos/logoo.svg" alt="Logo" className="h-12" />
                                <h1 className="text-3xl font-bold">&nbsp;Medicus</h1>
                            </div>

                            {/* Profile Image Upload */}
                            <div className="flex flex-col items-center space-y-4 mb-8">
                                <div className="w-32 h-32 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden border-4 border-white">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Profile Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUserMd className="text-teal-600 text-5xl" />
                                    )}
                                </div>
                                <label
                                    htmlFor="image-upload"
                                    className="text-sm text-white font-medium cursor-pointer hover:underline transition-colors"
                                >
                                    Upload Profile Picture
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                {errors.image && (
                                    <p className="text-red-200 text-xs mt-1">
                                        {errors.image}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sidebar info section */}
                        <div className="text-center">
                            <h3 className="font-semibold mb-2">Join Our Healthcare Network</h3>
                            <p className="text-teal-100 text-sm">Connect with patients and grow your practice with our digital healthcare platform.</p>
                        </div>
                    </div>

                    {/* Main form area */}
                    <div className="p-8 md:w-3/4">
                        {/* Header & Title */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Doctor Registration
                            </h2>
                            <p className="text-gray-600">
                                Create an account to join the Medicus platform
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Three column layout for main form fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                {/* Column 1 */}
                                <div className="space-y-4">
                                    {/* Name Field */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                                <FaUser className="h-5 w-5" />
                                            </span>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-2 border ${
                                                    errors.name ? 'border-red-300' : 'border-gray-300'
                                                } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
                                                placeholder="Dr. John Doe"
                                                disabled={isSigningUp}
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="text-red-600 text-xs mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Username Field */}
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                            Username
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                                <FaIdCard className="h-5 w-5" />
                                            </span>
                                            <input
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-2 border ${
                                                    errors.username ? 'border-red-300' : 'border-gray-300'
                                                } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
                                                placeholder="drjohn"
                                                disabled={isSigningUp}
                                            />
                                        </div>
                                        {errors.username && (
                                            <p className="text-red-600 text-xs mt-1">
                                                {errors.username}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                                <FaEnvelope className="h-5 w-5" />
                                            </span>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-2 border ${
                                                    errors.email ? 'border-red-300' : 'border-gray-300'
                                                } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
                                                placeholder="doctor@example.com"
                                                disabled={isSigningUp}
                                                autoComplete="email"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-red-600 text-xs mt-1">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Column 2 */}
                                <div className="space-y-4">
                                    {/* Password Field */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                                <FaLock className="h-5 w-5" />
                                            </span>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-10 py-2 border ${
                                                    errors.password ? 'border-red-300' : 'border-gray-300'
                                                } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
                                                placeholder="Minimum 8 characters"
                                                disabled={isSigningUp}
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                                tabIndex="-1"
                                            >
                                                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-red-600 text-xs mt-1">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                                <FaLock className="h-5 w-5" />
                                            </span>
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-10 py-2 border ${
                                                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                                } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
                                                placeholder="Confirm your password"
                                                disabled={isSigningUp}
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                                tabIndex="-1"
                                            >
                                                {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="text-red-600 text-xs mt-1">
                                                {errors.confirmPassword}
                                            </p>
                                        )}
                                    </div>

                                    {/* Gender Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <div className="flex space-x-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="male"
                                                    checked={formData.gender === 'male'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                                                />
                                                <span className="ml-2 text-gray-700">Male</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="female"
                                                    checked={formData.gender === 'female'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                                                />
                                                <span className="ml-2 text-gray-700">Female</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="other"
                                                    checked={formData.gender === 'other'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                                                />
                                                <span className="ml-2 text-gray-700">Other</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 3 */}
                                <div className="space-y-4">
                                    {/* Specialty Selection */}
                                    <div>
                                        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                                            Specialty
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                                <FaUserMd className="h-5 w-5" />
                                            </span>
                                            <select
                                                id="specialty"
                                                name="specialty"
                                                value={formData.specialty}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-2 border ${
                                                    errors.specialty ? 'border-red-300' : 'border-gray-300'
                                                } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white`}
                                                disabled={isSigningUp}
                                            >
                                                <option value="">Select your specialty</option>
                                                {specialties.map((specialty) => (
                                                    <option key={specialty} value={specialty}>
                                                        {specialty}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.specialty && (
                                            <p className="text-red-600 text-xs mt-1">
                                                {errors.specialty}
                                            </p>
                                        )}
                                    </div>

                                    {/* Availability */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                                        <div className="flex space-x-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="availability"
                                                    value="Yes"
                                                    checked={formData.availability === 'Yes'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                                                />
                                                <span className="ml-2 text-gray-700">Available</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="availability"
                                                    value="No"
                                                    checked={formData.availability === 'No'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                                                />
                                                <span className="ml-2 text-gray-700">Not Available</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio Field - Full Width */}
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                    Professional Bio
                                </label>
                                <div className="relative">
                                    <span className="absolute top-3 left-3 text-gray-500">
                                        <FaInfoCircle className="h-5 w-5" />
                                    </span>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows="3"
                                        className={`w-full pl-10 pr-4 py-2 border ${
                                            errors.bio ? 'border-red-300' : 'border-gray-300'
                                        } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
                                        placeholder="Briefly describe your professional experience, qualifications, and areas of expertise"
                                        disabled={isSigningUp}
                                    ></textarea>
                                </div>
                                {errors.bio && (
                                    <p className="text-red-600 text-xs mt-1">
                                        {errors.bio}
                                    </p>
                                )}
                            </div>

                            {/* Terms and Button - Horizontal Layout */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                                {/* Terms and Conditions */}
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="terms"
                                            name="terms"
                                            type="checkbox"
                                            checked={agreeToTerms}
                                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                            disabled={isSigningUp}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="text-gray-600">
                                            I agree to the <a href="#" className="text-teal-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a>
                                        </label>
                                        {errors.terms && (
                                            <p className="text-red-600 text-xs mt-1">
                                                {errors.terms}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSignupButtonDisabled}
                                    className={`md:w-auto w-full px-8 py-2 flex items-center justify-center bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105 disabled:bg-teal-300 disabled:cursor-not-allowed`}
                                >
                                    {isSigningUp ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Creating Account...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </div>

                            {/* Login Link */}
                            <div className="text-center md:text-right mt-4">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <a href="/doctor-login" className="text-teal-600 hover:underline font-medium">
                                        Sign in
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorSignup;