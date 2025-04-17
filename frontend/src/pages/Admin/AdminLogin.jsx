import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAdminStore } from "../../store/useAdminStore.js";

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState(null);

    // Get admin login function and loading state from store
    const { adminlogin, isLoading } = useAdminStore();

    // Check for remembered credentials on component mount
    useEffect(() => {
        const remembered = localStorage.getItem("rememberedCredentials");
        if (remembered) {
            const { email, rememberMe } = JSON.parse(remembered);
            setFormData(prev => ({ ...prev, email }));
            setRememberMe(rememberMe);
        }
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear errors when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleRememberMe = (e) => {
        setRememberMe(e.target.checked);
        if (!e.target.checked) {
            localStorage.removeItem("rememberedCredentials");
        }
    };

    // Validate form inputs
    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError(null);

        if (!validateForm()) return;

        // Save credentials to localStorage if remember me is checked
        if (rememberMe) {
            localStorage.setItem(
                "rememberedCredentials",
                JSON.stringify({
                    email: formData.email,
                    rememberMe,
                })
            );
        } else {
            localStorage.removeItem("rememberedCredentials");
        }

        try {
            // Call the login function from the store
            const success = await adminlogin(formData);
            if (!success) {
                setLoginError('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 font-sans">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url(./src/assets/images/admin_bg.jpg)',
                }}
            >
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-2xl p-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <img src="./src/assets/logos/logoo.svg" alt="Logo" />
                    <h1 className="text-3xl font-bold text-gray-900">&nbsp;Medicus</h1>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
                    Admin Sign In
                </h2>
                <p className="text-gray-600 text-center mb-8">
                    Access your dashboard to manage appointments
                </p>

                {/* Error Banner */}
                {loginError && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex justify-between items-center animate-shake">
                        <span>{loginError}</span>
                        <button
                            onClick={() => setLoginError(null)}
                            className="text-red-700 hover:text-red-900"
                            aria-label="Dismiss error message"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </span>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
                                placeholder="Enter your email"
                                aria-describedby={errors.email ? 'email-error' : undefined}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.email && (
                            <p id="email-error" className="text-red-600 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4m2-4c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m-2 5v-1m0-3a9 9 0 100-18 9 9 0 000 18z" />
                                </svg>
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-12 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
                                placeholder="Enter your password"
                                aria-describedby={errors.password ? 'password-error' : undefined}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p id="password-error" className="text-red-600 text-xs mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={handleRememberMe}
                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        {/* Forgot Password */}
                        <div>
                            <a
                                href="#"
                                className="text-sm text-teal-600 hover:text-teal-700 transition-colors"
                            >
                                Forgot Password?
                            </a>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !formData.email || !formData.password}
                        className={`w-full px-4 py-2 flex items-center justify-center space-x-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105 disabled:bg-teal-300 disabled:cursor-not-allowed`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <span>Signing In...</span>
                            </>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-8">
                    Powered by{' '}
                    <span className="font-medium text-teal-600">Medicus</span>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;