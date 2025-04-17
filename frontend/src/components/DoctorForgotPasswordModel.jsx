import React, { useState, useRef, useEffect } from 'react';
import { useDoctorStore } from "../store/useDoctorStore.js";
import toast from "react-hot-toast";

const DoctorForgotPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef(null);

    const { requestPasswordReset } = useDoctorStore();

    useEffect(() => {
        if (isOpen) {
            setEmail('');
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await requestPasswordReset(email);

            if (result) {
                toast.success("Password reset link sent to your email");
                onClose();
            }
        } catch (error) {
            console.error('Error requesting password reset:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div
                ref={modalRef}
                className="bg-white rounded-lg w-full max-w-lg overflow-hidden shadow-2xl transform transition-all animate-fade-in"
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Doctor Password Reset</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors text-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full h-8 w-8 flex items-center justify-center"
                    >
                        ×
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <p className="text-gray-600 mb-6">
                        Enter your registered email address below and we'll send you a link to reset your password.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2 font-medium" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:border-teal-500 focus:ring-teal-500 focus:ring-opacity-50 focus:outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 border-2 border-teal-500 text-teal-500 hover:bg-teal-50 transition-all py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`flex-1 bg-teal-500 hover:bg-teal-600 transition-all text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 ${
                                    (!email || isSubmitting) ? 'opacity-60 cursor-not-allowed' : ''
                                }`}
                                disabled={!email || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Sending...
                                    </span>
                                ) : 'Send Reset Link'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorForgotPasswordModal;