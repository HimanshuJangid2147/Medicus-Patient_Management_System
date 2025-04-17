import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDoctorStore } from '../store/useDoctorStore.js';
import { LogOut, User } from 'lucide-react';

export default function DoctorNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const { doctor, doctorlogout } = useDoctorStore();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setShowUserMenu(false);
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showUserMenu && !event.target.closest('.user-menu-container')) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserMenu]);

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        await doctorlogout();
        setShowUserMenu(false);
        navigate("/");
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
                isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white py-4'
            }`}
        >
            <div className="flex items-center justify-between px-4">
                {/* Logo */}
                <Link to="/doctor-dashboard" className="flex items-center">
                    <img src="https://res.cloudinary.com/dkjreh2ll/image/upload/v1744134727/Logoo_rxxq4g.svg" alt="Logo" className="h-8" />
                    <span className="font-bold text-xl text-gray-800 ml-2">Medicus Doctor</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link
                        to="/doctor-dashboard"
                        className={`font-medium ${
                            isActive('/doctor-dashboard')
                                ? 'text-teal-600 border-b-2 border-teal-600'
                                : 'text-gray-600 hover:text-teal-600'
                        }`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/doctor-appointments"
                        className={`font-medium ${
                            isActive('/doctor-appointments')
                                ? 'text-teal-600 border-b-2 border-teal-600'
                                : 'text-gray-600 hover:text-teal-600'
                        }`}
                    >
                        Appointments
                    </Link>
                    <Link
                        to="/doctor-profile"
                        className={`font-medium ${
                            isActive('/doctor-profile')
                                ? 'text-teal-600 border-b-2 border-teal-600'
                                : 'text-gray-600 hover:text-teal-600'
                        }`}
                    >
                        Profile
                    </Link>
                </div>

                {/* Action Buttons */}
                <div className="hidden md:flex items-center">
                    {doctor ? (
                        <div className="relative user-menu-container">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 px-4 py-2 rounded-full border border-teal-500 text-teal-500 hover:bg-teal-50"
                            >
                                <User size={18} />
                                <span>{doctor.name || 'Doctor Account'}</span>
                            </button>
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    <Link to="/doctor-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50">
                                        Profile
                                    </Link>
                                    <Link to="/doctor-appointments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50">
                                        My Appointments
                                    </Link>
                                    <div className="border-t border-gray-100"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut size={16} className="mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/doctor-login"
                            className="px-4 py-2 rounded-full border border-teal-500 text-teal-500 hover:bg-teal-50"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden px-4 pb-4 space-y-4 border-t border-gray-200">
                    <Link
                        to="/doctor-dashboard"
                        className={`block py-2 font-medium ${
                            isActive('/doctor-dashboard') ? 'text-teal-600 font-bold' : 'text-gray-600'
                        }`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/doctor-appointments"
                        className={`block py-2 font-medium ${
                            isActive('/doctor-appointments') ? 'text-teal-600 font-bold' : 'text-gray-600'
                        }`}
                    >
                        Appointments
                    </Link>
                    <Link
                        to="/doctor-profile"
                        className={`block py-2 font-medium ${
                            isActive('/doctor-profile') ? 'text-teal-600 font-bold' : 'text-gray-600'
                        }`}
                    >
                        Profile
                    </Link>
                    {doctor ? (
                        <div className="border-t border-gray-200 pt-2">
                            <p className="text-gray-500 font-medium">Doctor Account</p>
                            <Link to="/doctor-profile" className="block py-2 text-gray-600">Profile</Link>
                            <Link to="/doctor-appointments" className="block py-2 text-gray-600">My Appointments</Link>
                            <button onClick={handleLogout} className="flex items-center py-2 text-red-600">
                                <LogOut size={16} className="mr-2" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/doctor-login" className="block py-2 px-4 text-center rounded-full border border-teal-500 text-teal-500">
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}