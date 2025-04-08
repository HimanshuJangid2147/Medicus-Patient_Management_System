// import image from "../assets/logos/Logo.svg";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900 shadow-lg py-2"
          : "bg-gradient-to-r from-gray-900 to-gray-800 py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="./src/assets/logos/Logoo.svg" alt="Logo" />

            <span className="font-bold text-xl text-white ml-2">Medicus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors duration-200 ${
                isActive("/")
                  ? "text-green-500 border-b-2 border-green-500"
                  : "text-gray-300 hover:text-green-500"
              }`}
            >
              Home
            </Link>
            <Link
              to="/doctors"
              className={`font-medium transition-colors duration-200 ${
                isActive("/doctors")
                  ? "text-green-500 border-b-2 border-green-500"
                  : "text-gray-300 hover:text-green-500"
              }`}
            >
              Doctors
            </Link>
            <Link
              to="/appointments"
              className={`font-medium transition-colors duration-200 ${
                isActive("/appointments")
                  ? "text-green-500 border-b-2 border-green-500"
                  : "text-gray-300 hover:text-green-500"
              }`}
            >
              Appointments
            </Link>
            <Link
              to="/contact"
              className={`font-medium transition-colors duration-200 ${
                isActive("/contact")
                  ? "text-green-500 border-b-2 border-green-500"
                  : "text-gray-300 hover:text-green-500"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Action Button */}
          <div className="hidden md:block">
            <Link
              to="/appointments"
              className="px-5 py-2 rounded-full font-medium transition-colors duration-200 bg-green-600 text-white hover:bg-green-700"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-gray-700">
            <Link
              to="/"
              className={`block py-2 font-medium ${
                isActive("/") ? "text-green-500 font-bold" : "text-gray-300"
              }`}
            >
              Home
            </Link>
            <Link
              to="/doctors"
              className={`block py-2 font-medium ${
                isActive("/doctors")
                  ? "text-green-500 font-bold"
                  : "text-gray-300"
              }`}
            >
              Doctors
            </Link>
            <Link
              to="/appointments"
              className={`block py-2 font-medium ${
                isActive("/appointments")
                  ? "text-green-500 font-bold"
                  : "text-gray-300"
              }`}
            >
              Appointments
            </Link>
            <Link
              to="/contact"
              className={`block py-2 font-medium ${
                isActive("/contact")
                  ? "text-green-500 font-bold"
                  : "text-gray-300"
              }`}
            >
              Contact
            </Link>
            <Link
              to="/appointments"
              className="block py-2 px-4 text-center rounded-full mt-4 font-medium bg-green-600 text-white hover:bg-green-700"
            >
              Book Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
