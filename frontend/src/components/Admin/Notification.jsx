// components/admin/Notification.jsx
import React, { useEffect } from 'react';
import { CheckIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Notification = ({ notification, setNotification }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  if (!notification) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center ${
        notification.type === 'success' ? 'bg-green-500' : notification.type === 'info' ? 'bg-blue-500' : 'bg-red-500'
      } animate-fade-in-out`}
    >
      {notification.type === 'success' && <CheckIcon className="h-5 w-5 text-white mr-2" />}
      {notification.type === 'info' && <CheckIcon className="h-5 w-5 text-white mr-2" />}
      {notification.type === 'error' && <XCircleIcon className="h-5 w-5 text-white mr-2" />}
      <p className="text-white font-medium">{notification.message}</p>
    </div>
  );
};

export default Notification;