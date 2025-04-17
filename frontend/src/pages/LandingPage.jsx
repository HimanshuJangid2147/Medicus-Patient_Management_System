import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserInjured, FaUserMd, FaUserCog, FaArrowRight } from 'react-icons/fa';

const LandingPage = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm py-4 px-4 md:px-8 fixed w-full z-50">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <img src="./src/assets/logos/logoo.svg" alt="Medicus Logo" className="h-10" />
                        <h1 className="text-2xl font-bold text-teal-600 ml-2">Medicus</h1>
                    </div>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/about" className="text-gray-600 hover:text-teal-600 transition-colors">About</Link>
                        <Link to="/doctors" className="text-gray-600 hover:text-teal-600 transition-colors">Doctors</Link>
                        <Link to="/contact" className="text-gray-600 hover:text-teal-600 transition-colors">Contact</Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 md:px-8 bg-gray-50">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className={`w-full md:w-1/2 transform transition-all duration-700 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800">
                                Welcome to <span className="text-teal-600">Medicus</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                                A comprehensive patient management system designed to provide seamless healthcare experiences for patients, doctors, and administrators.
                            </p>
                            <p className="text-gray-800 font-medium mb-6">
                                Choose your access portal below to get started
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/signup"
                                    className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-center flex items-center justify-center"
                                >
                                    Patient Access
                                    <FaArrowRight className="ml-2" />
                                </Link>
                                <Link
                                    to="/doctor-login"
                                    className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-center"
                                >
                                    Doctor Access
                                </Link>
                            </div>
                        </div>

                        <div className={`w-full md:w-1/2 mt-12 md:mt-0 transform transition-all duration-700 delay-200 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                            <div className="relative mx-auto max-w-md">
                                <div className="absolute -inset-1 rounded-2xl bg-teal-200 opacity-30 blur-xl"></div>
                                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="./src/assets/images/appointmentside.png"
                                        alt="Healthcare professionals"
                                        className="w-full h-auto opacity-90"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Access Options */}
            <section className="py-16 px-4 md:px-8">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800">User Access Portals</h2>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Select the appropriate portal based on your role to access specialized features tailored to your needs.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Patient Access */}
                        <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="h-16 bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center">
                                <FaUserInjured className="text-white text-2xl" />
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Patient Access</h2>
                                <p className="text-gray-600 mb-6">
                                    Register an account, book appointments, view medical records, and manage your healthcare journey.
                                </p>
                                <ul className="text-gray-600 mb-8 space-y-3">
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 bg-teal-500 rounded-full mr-2"></span>
                                        Book appointments with specialists
                                    </li>
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 bg-teal-500 rounded-full mr-2"></span>
                                        Access medical history
                                    </li>
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 bg-teal-500 rounded-full mr-2"></span>
                                        Receive follow-up reminders
                                    </li>
                                </ul>
                                <Link 
                                    to="/signup" 
                                    className="inline-flex items-center justify-center w-full bg-teal-500 text-white py-3 px-6 rounded-lg font-medium transition-colors hover:bg-teal-600"
                                >
                                    Sign Up as Patient
                                    <FaArrowRight className="ml-2" />
                                </Link>
                                <p className="text-center mt-4 text-gray-500">
                                    Already have an account? <Link to="/login" className="text-teal-600 hover:underline">Login</Link>
                                </p>
                            </div>
                        </div>

                        {/* Doctor Access */}
                        <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 delay-200 transform hover:-translate-y-2 overflow-hidden ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="h-16 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                                <FaUserMd className="text-white text-2xl" />
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctor Access</h2>
                                <p className="text-gray-600 mb-6">
                                    Manage appointments, patient records, prescriptions, and treatment plans efficiently.
                                </p>
                                <ul className="text-gray-600 mb-8 space-y-3">
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                                        View and manage patient appointments
                                    </li>
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                                        Access complete patient histories
                                    </li>
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                                        Schedule follow-up consultations
                                    </li>
                                </ul>
                                <Link 
                                    to="/doctor-login" 
                                    className="inline-flex items-center justify-center w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium transition-colors hover:bg-blue-600"
                                >
                                    Login as Doctor
                                    <FaArrowRight className="ml-2" />
                                </Link>
                                <p className="text-center mt-4 text-gray-500">
                                    Need an account? <Link to="/doctor-register" className="text-blue-600 hover:underline">Register</Link>
                                </p>
                            </div>
                        </div>

                        {/* Admin Access */}
                        <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 delay-400 transform hover:-translate-y-2 overflow-hidden ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="h-16 bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                                <FaUserCog className="text-white text-2xl" />
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Access</h2>
                                <p className="text-gray-600 mb-6">
                                    Oversee the entire system, manage users, monitor operations, and generate reports.
                                </p>
                                <ul className="text-gray-600 mb-8 space-y-3">
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 bg-purple-500 rounded-full mr-2"></span>
                                        Manage doctors and staff
                                    </li>
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 bg-purple-500 rounded-full mr-2"></span>
                                        Generate system-wide reports
                                    </li>
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 bg-purple-500 rounded-full mr-2"></span>
                                        Monitor system performance
                                    </li>
                                </ul>
                                <Link 
                                    to="/admin-login" 
                                    className="inline-flex items-center justify-center w-full bg-purple-500 text-white py-3 px-6 rounded-lg font-medium transition-colors hover:bg-purple-600"
                                >
                                    Login as Admin
                                    <FaArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 md:px-8 bg-gray-50">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Why Choose Medicus</h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        {/* Feature 1 */}
                        <div className={`bg-white rounded-xl p-6 shadow-md text-center transform transition-all duration-500 hover:-translate-y-2 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-800">Expert Doctors</h3>
                            <p className="text-gray-600 text-sm">Board-certified specialists with years of clinical experience</p>
                        </div>

                        {/* Feature 2 */}
                        <div className={`bg-white rounded-xl p-6 shadow-md text-center transform transition-all duration-500 delay-100 hover:-translate-y-2 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-800">Easy Scheduling</h3>
                            <p className="text-gray-600 text-sm">Book appointments online in minutes, 24/7</p>
                        </div>

                        {/* Feature 3 */}
                        <div className={`bg-white rounded-xl p-6 shadow-md text-center transform transition-all duration-500 delay-200 hover:-translate-y-2 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-800">Telehealth</h3>
                            <p className="text-gray-600 text-sm">Virtual consultations from the comfort of your home</p>
                        </div>

                        {/* Feature 4 */}
                        <div className={`bg-white rounded-xl p-6 shadow-md text-center transform transition-all duration-500 delay-300 hover:-translate-y-2 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-800">Digital Records</h3>
                            <p className="text-gray-600 text-sm">Secure access to your medical records, test results, and personalized health plans</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 px-4 md:px-8 bg-teal-500">
                <div className="container mx-auto">
                    <div className="text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
                        <p className="text-lg mb-8 max-w-2xl mx-auto">
                            Create your account today and experience seamless healthcare management.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                to="/signup"
                                className="inline-block bg-white text-teal-600 font-medium px-8 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-100"
                            >
                                Sign Up as Patient
                            </Link>
                            <Link
                                to="/doctor-register"
                                className="inline-block bg-teal-600 text-white border border-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 hover:bg-teal-700"
                            >
                                Register as Doctor
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 md:px-8 bg-gray-100">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <img src="./src/assets/logos/logoo.svg" alt="Medicus Logo" className="h-8" />
                                <h3 className="text-xl font-bold text-teal-600 ml-2">Medicus</h3>
                            </div>
                            <p className="text-gray-600">Providing quality healthcare services for a healthier tomorrow.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4 text-gray-800">Services</h3>
                            <ul className="space-y-2">
                                <li><span>Cardiology</span></li>
                                <li><span>Dermatology</span></li>
                                <li><span>Orthopedics</span></li>
                                <li><span>Pediatrics</span></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4 text-gray-800">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link to="/about" className="text-gray-600 hover:text-teal-600">About Us</Link></li>
                                <li><Link to="/contact" className="text-gray-600 hover:text-teal-600">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4 text-gray-800">Contact</h3>
                            <p className="text-gray-600">Medicus Hospital,<br />Near Sophia College</p>
                            <p className="text-gray-600 mt-2">contact@medicus.com<br />+91 98260 00000</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-300 pt-6 text-center text-gray-600">
                        <p>&copy; {new Date().getFullYear()} Medicus. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;