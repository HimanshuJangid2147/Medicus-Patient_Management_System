import React, { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaGithub, FaKey } from "react-icons/fa";
import { useAuthStore } from "../../store/useAuthStore.js";
import { Loader2 } from "lucide-react";
import VerificationPopUp from "../../components/VeriificationPopUp.jsx";
import ForgotPasswordModal from "../../components/ForgotPasswordModel.jsx"; 
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false); // Add state for the modal

  const { login, isLoggingIn, requestOtp, verifyOtp } = useAuthStore();

  useEffect(() => {
    const savedCredentials = localStorage.getItem("rememberedCredentials");
    if (savedCredentials) {
      const { email, rememberMe } = JSON.parse(savedCredentials);
      setFormData((prev) => ({ ...prev, email }));
      setRememberMe(rememberMe);
    }
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();
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
    login(formData);
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
    if (!e.target.checked) {
      localStorage.removeItem("rememberedCredentials");
    }
  };

  const handleOtpRequest = async () => {
    if (!otpEmail) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      setRequestingOtp(true);
      await requestOtp({ email: otpEmail });
      setShowOtpPopup(true);
    } catch (error) {
      console.error("Error requesting OTP:", error);
    } finally {
      setRequestingOtp(false);
    }
  };

  const handleOtpSubmit = async (code) => {
    try {
      const result = await verifyOtp({ email: otpEmail, otp: code });
      if (result) {
        setShowOtpPopup(false);
        toast.success("Login successful!");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid verification code");
    }
  };

  return (
      <div className="flex flex-col md:flex-row min-h-screen bg-white text-gray-800">
        {/* Left Side - Form */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-4 md:p-8 order-2 md:order-1 max-[480px]:pt-24">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-teal-600">Login</h1>
              <p className="text-gray-600 mb-6">
                Welcome back! Please enter your credentials.
              </p>

              <form className="w-full space-y-4" onSubmit={handleOnSubmit}>
                <div>
                  <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaEnvelope className="text-gray-500" />
                    </div>
                    <input
                        type="email"
                        id="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
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
                        className="w-full pl-10 pr-10 p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={handleRememberMe}
                        className="w-4 h-4 text-teal-500 bg-white border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>

                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setShowForgotPasswordModal(true);
                    }} 
                    className="text-sm text-teal-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                    type="submit"
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                >
                  {isLoggingIn ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        <span>Loading...</span>
                      </div>
                  ) : (
                      "Sign in"
                  )}
                </button>
              </form>

              <div className="relative flex items-center justify-center mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-500 bg-white">Or continue with</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="relative">
                  <div className="w-full border-t border-gray-200 mt-3 mb-4"></div>
                </div>

                <div className="flex flex-col space-y-3">
                  <input
                      type="email"
                      placeholder= "Enter email for OTP login"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                  />
                  <button
                      type="button"
                      onClick={handleOtpRequest}
                      className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                      disabled={requestingOtp}
                  >
                    {requestingOtp ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          <span>Sending OTP...</span>
                        </div>
                    ) : (
                        <>
                          <FaKey className="text-xl mr-2" /> Login with OTP
                        </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-teal-600 hover:underline font-medium">
                    Sign up
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
        <div className="max-[480px]:hidden w-full md:w-1/2 order-1 md:order-2 flex items-center justify-center bg-gradient-to-bl from-teal-100 to-teal-50">
          <div className="p-4 md:p-0 w-full h-64 md:h-full relative">
            <img
                src="./src/assets/images/appointmentside.png"
                alt="Login Illustration"
                className="w-full h-full object-cover rounded-lg shadow-2xl md:rounded-none opacity-90"
            />
          </div>
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

        {/* Forgot Password Modal */}
        <ForgotPasswordModal
            isOpen={showForgotPasswordModal}
            onClose={() => setShowForgotPasswordModal(false)}
        />
      </div>
  );
};

export default LoginPage;