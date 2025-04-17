import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { verifyResetToken, resetPassword } = useAuthStore();

  // Verify token on component mount
  useEffect(() => {
    const checkToken = async () => {
      if (!resetToken) {
        setError('Reset token is missing');
        setIsLoading(false);
        return;
      }

      try {
        const response = await verifyResetToken(resetToken);
        if (response && response.valid) {
          setIsTokenValid(true);
          setUserEmail(response.email);
        } else {
          setError('This password reset link is invalid or has expired.');
        }
      } catch (err) {
        console.error('Error verifying token:', err);
        setError('Failed to verify reset token');
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [resetToken, verifyResetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await resetPassword(resetToken, password);
      if (success) {
        toast.success('Your password has been reset successfully');
        // Redirect to login page after successful reset
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Password reset successful. You can now log in with your new password.' 
            } 
          });
        }, 2000);
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      toast.error('Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-teal-500 border-r-transparent border-b-teal-500 border-l-transparent"></div>
          <p className="mt-2 text-gray-700">Verifying your reset link...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/forgot-password')}
              className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-6 rounded-lg font-medium transition-colors"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Reset Your Password</h2>
        {userEmail && (
          <p className="text-gray-600 mb-6 text-center">
            Create a new password for {userEmail}
          </p>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="password">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:border-teal-500 focus:ring-teal-500 focus:ring-opacity-50 focus:outline-none transition-all"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:border-teal-500 focus:ring-teal-500 focus:ring-opacity-50 focus:outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-teal-500 hover:bg-teal-600 transition-all text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 ${
              isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting Password...
              </span>
            ) : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;