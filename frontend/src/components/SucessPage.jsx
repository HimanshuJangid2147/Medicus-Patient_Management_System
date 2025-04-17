import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-teal-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h1>
          <p className="text-gray-600 mb-8">
            Your patient information has been successfully submitted. You can now book an appointment or return to the home page.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/home" 
              className="flex items-center justify-center px-4 py-3 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Go Home
            </Link>
            
            <Link 
              to="/appointments" 
              className="flex items-center justify-center px-4 py-3 rounded bg-teal-600 text-white hover:bg-teal-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;