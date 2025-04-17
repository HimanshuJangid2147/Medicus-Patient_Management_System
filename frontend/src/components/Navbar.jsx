import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
      <nav
          className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
              isScrolled ? "bg-white shadow-lg py-2" : "bg-white py-4"
          }`}
      >
        <div className="flex items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="./src/assets/logos/Logoo.svg" alt="Logo" className="h-8" />
            <span className="font-bold text-xl text-gray-800 ml-2">Medicus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
                to="/home"
                className={`font-medium ${
                    isActive("/home")
                        ? "text-teal-600 border-b-2 border-teal-600"
                        : "text-gray-600 hover:text-teal-600"
                }`}
            >
              Home
            </Link>
            <Link
                to="/doctors"
                className={`font-medium ${
                    isActive("/doctors")
                        ? "text-teal-600 border-b-2 border-teal-600"
                        : "text-gray-600 hover:text-teal-600"
                }`}
            >
              Doctors
            </Link>
            <Link
                to="/appointments"
                className={`font-medium ${
                    isActive("/appointments")
                        ? "text-teal-600 border-b-2 border-teal-600"
                        : "text-gray-600 hover:text-teal-600"
                }`}
            >
              Appointments
            </Link>
            <Link
                to="/contact"
                className={`font-medium ${
                    isActive("/contact")
                        ? "text-teal-600 border-b-2 border-teal-600"
                        : "text-gray-600 hover:text-teal-600"
                }`}
            >
              Contact
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center">
            {!authUser ? (
                <>
                  <Link
                      to="/login"
                      className="px-4 py-2 rounded-full border border-teal-500 text-teal-500 hover:bg-teal-50"
                  >
                    Login
                  </Link>
                  <Link
                      to="/appointments"
                      className="ml-4 px-4 py-2 rounded-full bg-teal-500 text-white hover:bg-teal-600"
                  >
                    Book Now
                  </Link>
                </>
            ) : (
                <div className="relative user-menu-container">
                  <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full border border-teal-500 text-teal-500 hover:bg-teal-50"
                  >
                    <User size={18} />
                    <span>{authUser.name || "Account"}</span>
                  </button>
                  {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                        >
                          Profile
                        </Link>
                        <Link
                            to="/appointment-history"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                        >
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
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
              className="md:hidden focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
                <svg
                    className="h-6 w-6 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
            ) : (
                <svg
                    className="h-6 w-6 text-teal-600"
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
            <div className="md:hidden px-4 pb-4 space-y-4 border-t border-gray-200">
              <Link
                  to="/home"
                  className={`block py-2 font-medium ${
                      isActive("/home") ? "text-teal-600 font-bold" : "text-gray-600"
                  }`}
              >
                Home
              </Link>
              <Link
                  to="/doctors"
                  className={`block py-2 font-medium ${
                      isActive("/doctors") ? "text-teal-600 font-bold" : "text-gray-600"
                  }`}
              >
                Doctors
              </Link>
              <Link
                  to="/appointments"
                  className={`block py-2 font-medium ${
                      isActive("/appointments")
                          ? "text-teal-600 font-bold"
                          : "text-gray-600"
                  }`}
              >
                Appointments
              </Link>
              <Link
                  to="/contact"
                  className={`block py-2 font-medium ${
                      isActive("/contact") ? "text-teal-600 font-bold" : "text-gray-600"
                  }`}
              >
                Contact
              </Link>
              {!authUser ? (
                  <>
                    <Link
                        to="/login"
                        className="block py-2 px-4 text-center rounded-full border border-teal-500 text-teal-500"
                    >
                      Login
                    </Link>
                    <Link
                        to="/appointments"
                        className="block py-2 px-4 text-center rounded-full bg-teal-500 text-white hover:bg-teal-600"
                    >
                      Book Now
                    </Link>
                  </>
              ) : (
                  <div className="border-t border-gray-200 pt-2">
                    <p className="text-gray-500 font-medium">Account</p>
                    <Link to="/profile" className="block py-2 text-gray-600">
                      Profile
                    </Link>
                    <Link to="/appointment-history" className="block py-2 text-gray-600">
                      My Appointments
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center py-2 text-red-600"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
              )}
            </div>
        )}
      </nav>
  );
}