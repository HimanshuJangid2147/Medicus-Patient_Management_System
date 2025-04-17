import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaVenusMars, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthStore } from "../../store/useAuthStore.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push("Name is required");
    }

    if (!formData.email.trim()) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!formData.phone.trim()) {
      errors.push("Phone Number is required");
    }

    if (!formData.dob.trim()) {
      errors.push("Date of Birth is required");
    }

    if (!formData.gender) {
      errors.push("Gender is required");
    } else if (!["male", "female", "other", "prefer-not-to-say"].includes(formData.gender)) {
      errors.push("Please select a valid gender option");
    }

    if (!formData.password.trim()) {
      errors.push("Password is required");
    } else if (formData.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!formData.confirmPassword.trim()) {
      errors.push("Confirm Password is required");
    } else if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    if (!formData.terms) {
      errors.push("You must agree to the Terms of Service and Privacy Policy");
    }

    if (errors.length > 0) {
      // Display the first error to maintain the same behavior as the original code
      // In a real implementation, you might want to display all errors
      toast.error(errors[0]);
      return false;
    }

    return true;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      try {
        await signup(formData);
        // Redirect to patient detail form after successful signup
        toast.success("Please complete your medical profile");
        navigate("/patient-form");
      } catch (error) {
        console.error("Error during signup:", error);
      }
    }
  };

  return (
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        {/* Left Side - Form */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-4 md:p-8 order-2 md:order-1 bg-gray-50">
          <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-teal-600">Sign Up</h1>
              <p className="text-gray-600 mb-6">
                Create your account to get started.
              </p>
              <form className="w-full space-y-4" onSubmit={handleOnSubmit}>
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaUser className="text-gray-500" />
                    </div>
                    <input
                        type="text"
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 p-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                        aria-required="true"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaEnvelope className="text-gray-500" />
                      </div>
                      <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                          className="w-full pl-10 p-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                          aria-required="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaPhone className="text-gray-500" />
                      </div>
                      <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 234 567 8900"
                          className="w-full pl-10 p-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                          aria-required="true"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dob" className="block text-gray-700 text-sm font-medium mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaCalendar className="text-gray-500" />
                      </div>
                      <input
                          type="date"
                          id="dob"
                          value={formData.dob}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                          className="w-full pl-10 p-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                          aria-required="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-gray-700 text-sm font-medium mb-2">
                      Gender
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaVenusMars className="text-gray-500" />
                      </div>
                      <select
                          id="gender"
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full pl-10 p-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-200 appearance-none"
                          aria-required="true"
                          aria-label="Select gender"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaLock className="text-gray-500" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-10 p-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                        aria-required="true"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaLock className="text-gray-500" />
                    </div>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-10 p-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                        aria-required="true"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                      id="terms"
                      type="checkbox"
                      className="w-4 h-4 text-teal-500 bg-white border-gray-300 rounded focus:ring-teal-500"
                      checked={formData.terms}
                      onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                      aria-required="true"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="/terms" className="text-teal-500 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-teal-500 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                    type="submit"
                    disabled={isSigningUp}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-3 rounded-lg transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSigningUp ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <a href="/login" className="text-teal-600 hover:underline font-medium">
                    Login
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-gray-500 text-sm">
            &copy; 2025 Medicus. All rights reserved.
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-1/2 order-1 md:order-2 flex items-center justify-center bg-white">
          <div className="p-4 md:p-0 w-full h-64 md:h-full relative">
            <img
                src="./src/assets/images/appointmentside.png"
                alt="Signup Illustration"
                className="w-full h-full object-cover rounded-lg shadow-xl md:rounded-none"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-teal-500/20"></div>
          </div>
        </div>
      </div>
  );
};

export default SignupPage;