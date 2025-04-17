import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import { useDoctorStore } from "../../store/useDoctorStore.js";
import toast from "react-hot-toast";
import VerificationPopUp from "../../components/VeriificationPopUp.jsx";
import DoctorForgotPasswordModal from "../../components/DoctorForgotPasswordModel.jsx";
import { useLocation } from "react-router-dom";

const DoctorLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [requestingOtp, setRequestingOtp] = useState(false);
  const location = useLocation();

  // Get login and OTP functions from store
  const { doctorlogin, isLoading, requestOtp, verifyOtp, isLoggingIn } =
    useDoctorStore();

  // Check for remembered credentials on mount and display any messages
  useEffect(() => {
    const remembered = localStorage.getItem("doctorCredentials");
    if (remembered) {
      try {
        const { email, rememberMe } = JSON.parse(remembered);
        setFormData((prev) => ({ ...prev, email }));
        setOtpEmail(email); // Also set the email for OTP login
        setRememberMe(rememberMe);
      } catch (error) {
        console.error("Error parsing remembered credentials:", error);
        localStorage.removeItem("doctorCredentials");
      }
    }

    // Show toast messages passed from other components (e.g., after password reset)
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, [location.state]);

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
    // Clear general login error when user makes changes
    if (loginError) {
      setLoginError(null);
    }
  };

  // Handle Remember Me checkbox
  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
    if (!e.target.checked) {
      localStorage.removeItem("doctorCredentials");
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    if (!validateForm()) return;

    // Save credentials if "Remember Me" is checked
    if (rememberMe) {
      localStorage.setItem(
        "doctorCredentials",
        JSON.stringify({
          email: formData.email.trim(),
          rememberMe,
        })
      );
    }

    try {
      const success = await doctorlogin({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!success) {
        setLoginError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An unexpected error occurred. Please try again.");
    }
  };

  // Handle email change for OTP login
  const handleOtpEmailChange = (e) => {
    setOtpEmail(e.target.value);
    if (loginError) setLoginError(null);
  };

  // Validate email for OTP request
  const validateOtpEmail = () => {
    if (!otpEmail.trim()) {
      toast.error("Please enter an email address");
      return false;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(otpEmail)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  // Handle OTP request
  const handleOtpRequest = async () => {
    if (!validateOtpEmail()) return;

    try {
      setRequestingOtp(true);
      const success = await requestOtp({ email: otpEmail.trim() });
      if (success) {
        setShowOtpPopup(true);
        // Clear any previous errors
        setLoginError(null);
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setRequestingOtp(false);
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (code) => {
    if (!code || code.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      const success = await verifyOtp({
        email: otpEmail.trim(),
        otp: code,
      });

      if (success) {
        setShowOtpPopup(false);
        // Save email if login is successful via OTP
        if (rememberMe) {
          localStorage.setItem(
            "doctorCredentials",
            JSON.stringify({
              email: otpEmail.trim(),
              rememberMe,
            })
          );
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid verification code");
    }
  };

  // Function to close the error banner
  const closeErrorBanner = () => {
    setLoginError(null);
  };

  // Handle forgot password click
  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPasswordModal(true);
  };

  // Determine if login button should be disabled
  const isLoginButtonDisabled =
    isLoading || isLoggingIn || !formData.email || !formData.password;

  // Determine if OTP button should be disabled
  const isOtpButtonDisabled = requestingOtp || isLoading || !otpEmail;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 font-sans">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <img src="./src/assets/logos/logoo.svg" alt="Logo" className="h-10" />
          <h1 className="text-3xl font-bold text-teal-600">&nbsp;Medicus</h1>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
          Doctor Sign In
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Access your dashboard to manage patient appointments
        </p>

        {/* Error Banner */}
        {loginError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex justify-between items-center animate-shake">
            <span>{loginError}</span>
            <button
              onClick={closeErrorBanner}
              className="text-red-700 hover:text-red-900"
              aria-label="Dismiss error message"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FaEnvelope className="h-5 w-5" />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter your email"
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={isLoggingIn}
                autoComplete="username"
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
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FaLock className="h-5 w-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter your password"
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                disabled={isLoggingIn}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex="-1"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-red-600 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMe}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                disabled={isLoggingIn}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <a
              href="/#"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPasswordModal(true);
              }}
              className="text-sm text-teal-600 hover:text-teal-700 transition-colors"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoginButtonDisabled}
            className={`w-full px-4 py-3 flex items-center justify-center bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105 disabled:bg-teal-300 disabled:cursor-not-allowed`}
          >
            {isLoggingIn ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* OTP Login */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or sign in with OTP
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter email for OTP login"
            value={otpEmail}
            onChange={handleOtpEmailChange}
            className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-200"
            disabled={requestingOtp || isLoading}
            autoComplete="email"
          />
          <button
            type="button"
            onClick={handleOtpRequest}
            disabled={isOtpButtonDisabled}
            className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {requestingOtp ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-gray-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Sending OTP...
              </>
            ) : (
              <>
                <FaKey className="h-5 w-5 mr-2" />
                Login with OTP
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Powered by <span className="font-medium text-teal-600">Medicus</span>
        </p>
      </div>

      {/* OTP Verification Popup */}
      <VerificationPopUp
        isOpen={showOtpPopup}
        onClose={() => setShowOtpPopup(false)}
        onSubmit={handleOtpSubmit}
        title="OTP Verification"
        message={`Enter the 6-digit code sent to ${otpEmail}`}
        buttonText="Verify & Login"
        digits={6}
        highlightedDigits={0}
      />

      {/* DoctorForgotPasswordModal */}
      <DoctorForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </div>
  );
};

export default DoctorLogin;
