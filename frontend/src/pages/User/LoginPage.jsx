import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaGithub, FaKey } from "react-icons/fa";
// import VerificationPopUp from "../components/VeriificationPopUp.jsx";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  // const [showLoginPopup, setShowLoginPopup] = useState(false);

  // const handleSubmit = (code) => {
  //   console.log("Login code submitted:", code);
  //   if(code == "123456"){
  //     alert("Login successful!");
  //     setShowLoginPopup(false);
  //   } else {
  //     alert("Invalid code");
  //   } 
  // };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-4 md:p-8 order-2 md:order-1 max-[480px]:pt-24">
        <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-green-500">Login</h1>
            <p className="text-gray-400 mb-6">
              Welcome back! Please enter your credentials.
            </p>
            
            <form className="w-full space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-400 text-sm font-medium mb-2">
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
                    className="w-full pl-10 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-gray-400 text-sm font-medium mb-2">
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
                    className="w-full pl-10 pr-10 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200"
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
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-400">
                    Remember me
                  </label>
                </div>
                
                <a href="/reset-password" className="text-sm text-green-500 hover:underline">
                  Forgot password?
                </a>
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Sign In
              </button>
            </form>
            
            <div className="relative flex items-center justify-center mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-gray-800">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                <FaGoogle className="text-xl" />
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                <FaFacebook className="text-xl" />
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                <FaGithub className="text-xl" />
              </button>
              <button
                type="button"
                className="w-full col-span-3 inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                <FaKey className="text-xl" /> <span>&nbsp;OTP</span>
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <a href="/signup" className="text-green-500 hover:underline font-medium">
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
      <div className="max-[480px]:hidden w-full md:w-1/2 order-1 md:order-2 flex items-center justify-center bg-gradient-to-bl from-gray-800 to-gray-900">
        <div className="p-4 md:p-0 w-full h-64 md:h-full relative">
          <img
            src="./src/assets/images/appointmentside.png"
            alt="Login Illustration"
            className="w-full h-full object-cover rounded-lg shadow-2xl md:rounded-none opacity-90"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;