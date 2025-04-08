import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/User/Home';
import LoginPage from './pages/User/LoginPage';
import SignupPage from './pages/User/SignupPage';
import Navbar from './components/Navbar';
import Doctor from './pages/User/Doctor';
import Contact from './pages/User/Contact';
import Appointments from './pages/User/Appointment';
import PatientDetailForm from './pages/User/PatientDetailForm';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SuccessfulAppointment from './components/AppointmentSucessfull';

// Mock function to check if the user is an admin
const isAdmin = () => {
  // Replace this with your actual authentication/authorization logic
  const user = JSON.parse(localStorage.getItem('user')); // Example: Get user from localStorage
  return user && user.role === 'admin';
};

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  return isAdmin() ? children : <Navigate to="/admin" />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/patient-form" element={<PatientDetailForm />} />
          <Route path="/doctors" element={<Doctor />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/adminn" element={<AdminDashboard />} />
          <Route path="/appointment-success" element={<SuccessfulAppointment />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;