import React, { useState, useEffect } from 'react';
import {
    FaUser, FaEnvelope, FaIdCard, FaUserMd, FaInfoCircle,
    FaCalendarAlt, FaPhone, FaClock, FaPencilAlt, FaMapMarkerAlt,
    FaSave, FaTimes, FaCamera, FaCertificate
} from 'react-icons/fa';
import { useDoctorStore } from "../../store/useDoctorStore.js";
import toast from 'react-hot-toast';

const DoctorProfile = () => {
    const { doctor, updateDoctor, isLoading } = useDoctorStore();
    const [isEditing, setIsEditing] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    // Profile data state
    const [profileData, setProfileData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        gender: '',
        specialty: '',
        bio: '',
        availability: '',
        workingHours: '',
        location: '',
        image: '',
        consultationFee: '',
        experience: '',
        education: [],
        certifications: []
    });

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

    // Fetch doctor data on component mount
    useEffect(() => {
        if (doctor) {
            setProfileData({
                name: doctor.name || '',
                username: doctor.username || '',
                email: doctor.email || '',
                phone: doctor.phone || '',
                gender: doctor.gender || '',
                specialty: doctor.specialty || '',
                bio: doctor.bio || '',
                availability: doctor.availability || '',
                workingHours: doctor.workingHours || '',
                location: doctor.location || '',
                image: doctor.image || '',
                consultationFee: doctor.consultationFee || '',
                experience: doctor.experience || '',
                education: doctor.education || [],
                certifications: doctor.certifications || []
            });

            if (doctor.image) {
                setImagePreview(doctor.image);
            }
        }
    }, [doctor]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
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
    const resizeAndCompressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // Create a canvas to resize the image
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = Math.round(height * (MAX_WIDTH / width));
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = Math.round(width * (MAX_HEIGHT / height));
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Draw resized image on canvas
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 with reduced quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    // Modify handleImageChange to use the new function
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setErrors((prev) => ({
                ...prev,
                image: 'Please select an image file',
            }));
            return;
        }

        try {
            const resizedImageData = await resizeAndCompressImage(file);
            setProfileData((prev) => ({
                ...prev,
                image: resizedImageData,
            }));
            setImagePreview(resizedImageData);

            // Clear any previous error
            if (errors.image) {
                setErrors((prev) => ({
                    ...prev,
                    image: null,
                }));
            }
        } catch (error) {
            console.error('Error processing image:', error);
            setErrors((prev) => ({
                ...prev,
                image: 'Failed to process image',
            }));
        }
    };

    // Add education entry
    const addEducation = () => {
        setProfileData((prev) => ({
            ...prev,
            education: [...prev.education, { degree: '', institution: '', year: '' }]
        }));
    };

    // Remove education entry
    const removeEducation = (index) => {
        setProfileData((prev) => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    // Handle education field change
    const handleEducationChange = (index, field, value) => {
        setProfileData((prev) => {
            const newEducation = [...prev.education];
            newEducation[index] = { ...newEducation[index], [field]: value };
            return { ...prev, education: newEducation };
        });
    };

    // Add certification entry
    const addCertification = () => {
        setProfileData((prev) => ({
            ...prev,
            certifications: [...prev.certifications, { name: '', issuedBy: '', year: '' }]
        }));
    };

    // Remove certification entry
    const removeCertification = (index) => {
        setProfileData((prev) => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }));
    };

    // Handle certification field change
    const handleCertificationChange = (index, field, value) => {
        setProfileData((prev) => {
            const newCertifications = [...prev.certifications];
            newCertifications[index] = { ...newCertifications[index], [field]: value };
            return { ...prev, certifications: newCertifications };
        });
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!profileData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!profileData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(profileData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (profileData.phone && !/^\d{10}$/.test(profileData.phone)) {
            newErrors.phone = 'Phone must be a 10-digit number';
        }

        if (!profileData.specialty.trim()) {
            newErrors.specialty = 'Specialty is required';
        }

        if (!profileData.bio.trim()) {
            newErrors.bio = 'Bio is required';
        } else if (profileData.bio.length < 20) {
            newErrors.bio = 'Bio must be at least 20 characters';
        }

        if (profileData.consultationFee && isNaN(Number(profileData.consultationFee))) {
            newErrors.consultationFee = 'Consultation fee must be a number';
        }

        if (profileData.experience && isNaN(Number(profileData.experience))) {
            newErrors.experience = 'Experience must be a number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await updateDoctor(profileData);
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Failed to update profile. Please try again.');
        }
    };

    // Toggle edit mode
    const toggleEditMode = () => {
        if (isEditing) {
            // If currently editing, reset form to original data
            if (doctor) {
                setProfileData({
                    name: doctor.name || '',
                    username: doctor.username || '',
                    email: doctor.email || '',
                    phone: doctor.phone || '',
                    gender: doctor.gender || '',
                    specialty: doctor.specialty || '',
                    bio: doctor.bio || '',
                    availability: doctor.availability || '',
                    workingHours: doctor.workingHours || '',
                    location: doctor.location || '',
                    image: doctor.image || '',
                    consultationFee: doctor.consultationFee || '',
                    experience: doctor.experience || '',
                    education: doctor.education || [],
                    certifications: doctor.certifications || []
                });

                if (doctor.image) {
                    setImagePreview(doctor.image);
                }
            }
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
            {/* Added pt-20 to prevent navbar overlap */}
            <div className="mx-auto">
                {/* Profile Header - Changed flex direction to be responsive */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
                    <button
                        type="button"
                        onClick={toggleEditMode}
                        className={`mt-4 sm:mt-0 px-4 py-2 flex items-center rounded-lg font-medium transition-all ${
                            isEditing
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                : 'bg-teal-500 text-white hover:bg-teal-600'
                        }`}
                    >
                        {isEditing ? (
                            <>
                                <FaTimes className="mr-2" />
                                Cancel Editing
                            </>
                        ) : (
                            <>
                                <FaPencilAlt className="mr-2" />
                                Edit Profile
                            </>
                        )}
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Sidebar - Improved responsive design */}
                        <div className="bg-teal-700 p-6 lg:p-8 lg:w-1/4 flex flex-col items-center text-black relative" >
                            <img src="./src/assets/images/admin_bg.jpg" alt="bg image"  className="absolute inset-0 w-full h-full object-cover opacity-60" />
                            {/* Profile Image */}
                            <div className="relative">
                                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden border-4 border-white">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUserMd className="text-teal-600 text-6xl" />
                                    )}
                                </div>

                                {isEditing && (
                                    <label
                                        htmlFor="photo-upload"
                                        className="absolute bottom-0 right-0 bg-white text-teal-600 rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100"
                                    >
                                        <FaCamera className="text-xl" />
                                        <input
                                            id="photo-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {/* Doctor Status */}
                            <div className={`mt-6 px-4 py-2 rounded-full ${
                                profileData.availability === 'Yes' ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                                {profileData.availability === 'Yes' ? 'Available' : 'Not Available'}
                            </div>

                            {/* Contact Information */}
                            <div className="mt-8 w-full space-y-3">
                                <h3 className="font-semibold text-xl mb-4">Contact</h3>

                                {profileData.email && (
                                    <div className="flex items-center">
                                        <FaEnvelope className="mr-3 flex-shrink-0" />
                                        <span className="text-teal-100 break-all">{profileData.email}</span>
                                    </div>
                                )}

                                {profileData.phone && (
                                    <div className="flex items-center">
                                        <FaPhone className="mr-3 flex-shrink-0" />
                                        <span className="text-teal-100">{profileData.phone}</span>
                                    </div>
                                )}

                                {profileData.location && (
                                    <div className="flex items-start">
                                        <FaMapMarkerAlt className="mr-3 mt-1 flex-shrink-0" />
                                        <span className="text-teal-100">{profileData.location}</span>
                                    </div>
                                )}

                                {profileData.workingHours && (
                                    <div className="flex items-start">
                                        <FaClock className="mr-3 mt-1 flex-shrink-0" />
                                        <span className="text-teal-100">{profileData.workingHours}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Main Content - Improved padding and scrolling */}
                        <div className="p-6 lg:p-8 lg:w-3/4 overflow-auto">
                            <form onSubmit={handleSubmit}>
                                {/* Personal Information Section */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                                        <FaUser className="mr-2 text-teal-600" />
                                        Personal Information
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {/* Name Field */}
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name
                                            </label>
                                            {isEditing ? (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        value={profileData.name}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-2 border ${
                                                            errors.name ? 'border-red-300' : 'border-gray-300'
                                                        } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                                                    />
                                                    {errors.name && (
                                                        <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-800 font-medium">{profileData.name}</p>
                                            )}
                                        </div>

                                        {/* Username Field */}
                                        <div>
                                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                                Username
                                            </label>
                                            <p className="text-gray-800 font-medium">@{profileData.username}</p>
                                        </div>

                                        {/* Email Field */}
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            {isEditing ? (
                                                <div className="relative">
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={profileData.email}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-2 border ${
                                                            errors.email ? 'border-red-300' : 'border-gray-300'
                                                        } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                                                    />
                                                    {errors.email && (
                                                        <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-800">{profileData.email}</p>
                                            )}
                                        </div>

                                        {/* Phone Field */}
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone
                                            </label>
                                            {isEditing ? (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        id="phone"
                                                        name="phone"
                                                        value={profileData.phone}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-2 border ${
                                                            errors.phone ? 'border-red-300' : 'border-gray-300'
                                                        } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                                                        placeholder="+1 (123) 456-7890"
                                                    />
                                                    {errors.phone && (
                                                        <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-800">{profileData.phone || 'Not provided'}</p>
                                            )}
                                        </div>

                                        {/* Gender Field - Improved radio button layout */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Gender
                                            </label>
                                            {isEditing ? (
                                                <div className="flex flex-wrap gap-4">
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="male"
                                                            checked={profileData.gender === 'male'}
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
                                                            checked={profileData.gender === 'female'}
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
                                                            checked={profileData.gender === 'other'}
                                                            onChange={handleChange}
                                                            className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                                                        />
                                                        <span className="ml-2 text-gray-700">Other</span>
                                                    </label>
                                                </div>
                                            ) : (
                                                <p className="text-gray-800 capitalize">{profileData.gender}</p>
                                            )}
                                        </div>

                                        {/* Location Field */}
                                        <div>
                                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                                Location
                                            </label>
                                            {isEditing ? (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        id="location"
                                                        name="location"
                                                        value={profileData.location}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                        placeholder="City, Country"
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-gray-800">{profileData.location || 'Not provided'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Details Section */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                                        <FaUserMd className="mr-2 text-teal-600" />
                                        Professional Details
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                        {/* Specialty Field */}
                                        <div>
                                            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                                                Specialty
                                            </label>
                                            {isEditing ? (
                                                <div className="relative">
                                                    <select
                                                        id="specialty"
                                                        name="specialty"
                                                        value={profileData.specialty}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-2 border ${
                                                            errors.specialty ? 'border-red-300' : 'border-gray-300'
                                                        } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white`}
                                                    >
                                                        <option value="">Select your specialty</option>
                                                        {specialties.map((specialty) => (
                                                            <option key={specialty} value={specialty}>
                                                                {specialty}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.specialty && (
                                                        <p className="text-red-600 text-xs mt-1">{errors.specialty}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-800">{profileData.specialty}</p>
                                            )}
                                        </div>

                                        {/* Experience Field */}
                                        <div>
                                            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                                                Years of Experience
                                            </label>
                                            {isEditing ? (
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        id="experience"
                                                        name="experience"
                                                        value={profileData.experience}
                                                        onChange={handleChange}
                                                        min="0"
                                                        max="70"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-gray-800">
                                                    {profileData.experience ? `${profileData.experience} years` : 'Not provided'}
                                                </p>
                                            )}
                                        </div>

                                        {/* Working Hours Field */}
                                        <div>
                                            <label htmlFor="workingHours" className="block text-sm font-medium text-gray-700 mb-1">
                                                Working Hours
                                            </label>
                                            {isEditing ? (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        id="workingHours"
                                                        name="workingHours"
                                                        value={profileData.workingHours}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                        placeholder="Mon-Fri: 9am-5pm"
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-gray-800">{profileData.workingHours || 'Not provided'}</p>
                                            )}
                                        </div>

                                        {/* Consultation Fee Field */}
                                        <div>
                                            <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-1">
                                                Consultation Fee
                                            </label>
                                            {isEditing ? (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        id="consultationFee"
                                                        name="consultationFee"
                                                        value={profileData.consultationFee}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                        placeholder="$100"
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-gray-800">{profileData.consultationFee || 'Not provided'}</p>
                                            )}
                                        </div>

                                        {/* Availability Field - Improved radio button layout */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Availability
                                            </label>
                                            {isEditing ? (
                                                <div className="flex flex-wrap gap-4">
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="availability"
                                                            value="Yes"
                                                            checked={profileData.availability === 'Yes'}
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
                                                            checked={profileData.availability === 'No'}
                                                            onChange={handleChange}
                                                            className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                                                        />
                                                        <span className="ml-2 text-gray-700">Not Available</span>
                                                    </label>
                                                </div>
                                            ) : (
                                                <p className="text-gray-800">
                                                    {profileData.availability === 'Yes' ? 'Available' : 'Not Available'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bio Field */}
                                    <div>
                                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                            Professional Bio
                                        </label>
                                        {isEditing ? (
                                            <div className="relative">
                        <textarea
                            id="bio"
                            name="bio"
                            value={profileData.bio}
                            onChange={handleChange}
                            rows="4"
                            className={`w-full px-4 py-2 border ${
                                errors.bio ? 'border-red-300' : 'border-gray-300'
                            } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                            placeholder="Briefly describe your professional experience, qualifications, and areas of expertise"
                        ></textarea>
                                                {errors.bio && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.bio}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-800 whitespace-pre-line">{profileData.bio}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Education Section */}
                                <div className="mb-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                                            <FaIdCard className="mr-2 text-teal-600" />
                                            Education
                                        </h2>
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={addEducation}
                                                className="text-teal-600 hover:text-teal-700 flex items-center text-sm font-medium"
                                            >
                                                + Add Education
                                            </button>
                                        )}
                                    </div>

                                    {!isEditing && profileData.education.length === 0 && (
                                        <p className="text-gray-500 italic">No education information provided</p>
                                    )}

                                    {(!isEditing && profileData.education.length > 0) && (
                                        <div className="space-y-4">
                                            {profileData.education.map((edu, index) => (
                                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="font-semibold text-gray-800">{edu.degree}</p>
                                                    <p className="text-gray-600">{edu.institution}</p>
                                                    <p className="text-gray-500 text-sm">{edu.year}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {isEditing && (
                                        <div className="space-y-4">
                                            {profileData.education.map((edu, index) => (
                                                <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEducation(index)}
                                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Degree/Certificate
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={edu.degree}
                                                                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                                placeholder="MD, PhD, etc."
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Institution
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={edu.institution}
                                                                onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                                placeholder="University name"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Year
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={edu.year}
                                                                onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                                placeholder="2010-2014"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Certifications Section */}
                                <div className="mb-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                                            <FaCertificate className="mr-2 text-teal-600" />
                                            Certifications
                                        </h2>
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={addCertification}
                                                className="text-teal-600 hover:text-teal-700 flex items-center text-sm font-medium"
                                            >
                                                + Add Certification
                                            </button>
                                        )}
                                    </div>

                                    {!isEditing && profileData.certifications.length === 0 && (
                                        <p className="text-gray-500 italic">No certification information provided</p>
                                    )}

                                    {(!isEditing && profileData.certifications.length > 0) && (
                                        <div className="space-y-4">
                                            {profileData.certifications.map((cert, index) => (
                                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="font-semibold text-gray-800">{cert.name}</p>
                                                    <p className="text-gray-600">{cert.issuedBy}</p>
                                                    <p className="text-gray-500 text-sm">{cert.year}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {isEditing && (
                                        <div className="space-y-4">
                                            {profileData.certifications.map((cert, index) => (
                                                <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCertification(index)}
                                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Certification Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={cert.name}
                                                                onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                                placeholder="Certification name"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Issued By
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={cert.issuedBy}
                                                                onChange={(e) => handleCertificationChange(index, 'issuedBy', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                                placeholder="Issuing organization"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Year
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={cert.year}
                                                                onChange={(e) => handleCertificationChange(index, 'year', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                                placeholder="2021"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                {isEditing && (
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium flex items-center hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave className="mr-2" />
                                                    Save Profile
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;