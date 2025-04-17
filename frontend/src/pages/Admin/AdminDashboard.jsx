import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import AppointmentsPage from './AppointmentPage.jsx';
import CategoriesPage from './CategoriesPage.jsx';
import PatientsPage from './PatientsPage.jsx';
import DoctorsPage from './DoctorPage.jsx';
import SettingsPage from './SettingsPage.jsx';
import { useAdminStore } from '../../store/useAdminStore';
import Notification from '../../components/admin/Notification.jsx';

const AdminDashboard = () => {
  const { admin } = useAdminStore();
  const navigate = useNavigate();

  return (
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Notification />
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <header className="bg-white py-4 px-6 flex justify-between items-center border-b border-gray-200 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center lg:hidden">
                <div className="w-8 h-8 bg-teal-500 rounded-md flex items-center justify-center mr-2">
                  <img src="../../assets/logos/Logoo.svg" alt="Logo" className="h-6" />
                </div>
                <h1 className="text-xl font-bold text-gray-800">Medicus</h1>
              </div>
              <h1 className="text-xl font-bold text-gray-800 hidden lg:block">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 relative">
                  <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="hidden md:flex items-center">
                  <span className="mr-2 text-gray-600">{admin?.name || 'Admin'}</span>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="font-bold text-gray-800">{admin?.name?.charAt(0) || 'A'}</span>
                  </div>
                </div>
              </div>
            </header>
            <div className="p-6">
              <Routes>
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="patients" element={<PatientsPage />} />
                <Route path="doctors" element={<DoctorsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="/" element={<Navigate to="appointments" replace />} />
                {/* Add a catch-all route */}
                <Route path="*" element={<Navigate to="appointments" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
  );
};

export default AdminDashboard;