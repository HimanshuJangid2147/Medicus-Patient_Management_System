import {BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom';
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
import Testing from './pages/User/temp'
import {useAuthStore} from "./store/useAuthStore.js";
import {useAdminStore} from "./store/useAdminStore.js";
import {useDoctorStore} from "./store/useDoctorStore.js";
import {useEffect} from "react";
import {LoaderCircleIcon} from "lucide-react";
import ProfilePage from "./pages/User/ProfilePage.jsx";
import AdminLogin from "./pages/Admin/AdminLogin.jsx";
import DoctorLogin from "./pages/Doctor/DoctorLogin.jsx";
import DoctorNavbar from "./components/DoctorNavbar.jsx";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard.jsx";
import DoctorSignup from "./pages/Doctor/DoctorSignUp.jsx";
import DoctorProfile from "./pages/Doctor/DoctorProfilePage.jsx";
import DoctorAppointmentsPage from "./pages/Doctor/DoctorAppointment.jsx";
import AppointmentHistory from "./pages/User/AppointmentHistory.jsx";
import ManagePatients from "./pages/Doctor/ManagePatients.jsx";
import AddPatient from "./components/AddPatient.jsx";
import ViewReport from "./components/Admin/ViewReport.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import AboutUs from './pages/AboutUs.jsx';
import SuccessPage from './components/SucessPage.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import ForgotPaswordPage from './components/ForgotPasswordModel.jsx';
import DoctorResetPassword from './components/DoctorResetPassword.jsx';
import DoctorForgotPassword from './components/DoctorForgotPasswordModel.jsx';
const PatientLayout = () => (
    <>
      <Navbar />
      <Outlet />
    </>
);
const DoctorLayout = () => (
    <>
      <DoctorNavbar />
      <Outlet />
    </>
);

const AdminLayout = () => (
    <>
      <Outlet />
    </>
);

const App = () => {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const { checkAdminAuth, admin, isCheckingAdminAuth } = useAdminStore();
  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  const { checkDoctorAuth, doctor, isCheckingDoctorAuth } = useDoctorStore();
  useEffect(() => {
    checkDoctorAuth();
  }, [checkDoctorAuth]);

  if (isCheckingAdminAuth && !admin) {
    return (
        <div className="flex items-center justify-center h-screen">
          <LoaderCircleIcon className="animate-spin size-10" />
        </div>
    );
  }

  if (isCheckingAuth && !authUser) {
    return (
        <div className="flex items-center justify-center h-screen">
          <LoaderCircleIcon className="animate-spin size-10" />
        </div>
    );
  }

  if (isCheckingDoctorAuth && !doctor) {
    return (
        <div className="flex items-center justify-center h-screen">
          <LoaderCircleIcon className="animate-spin size-10" />
        </div>
    );
  }

  return (
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Landing Page - Public */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Patient Routes */}
            <Route element={<PatientLayout />}>
                <Route path="/home" element={authUser ? <Home /> : <Navigate to="/login" />} />
                <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
                <Route path="/patient-form" element={<PatientDetailForm />} />
                <Route path="/appointment-history" element={ authUser ? <AppointmentHistory /> : <Navigate to="/dashboard" />} />
                <Route path="/appointment-success" element={<SuccessfulAppointment />} />
                <Route path="/doctors" element={<Doctor />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/appointments" element={authUser ? <Appointments /> : <Navigate to="/login" />} />
            </Route>

            {/* Doctor Routes */}
            <Route element={<DoctorLayout />}>
                <Route path="/doctor-login" element={ doctor ? <Navigate to="/doctor-dashboard" /> : <DoctorLogin />} />
                <Route path="/doctor-register" element={ doctor ? <Navigate to="/doctor-dashboard" /> : <DoctorSignup />} />
                <Route path="/doctor-dashboard" element={doctor ? <DoctorDashboard /> : <Navigate to="/doctor-login" />} />
                <Route path="/doctor-profile" element={doctor ? <DoctorProfile /> : <Navigate to="/doctor-profile" />} />
                <Route path="/doctor-appointments" element={doctor ? <DoctorAppointmentsPage /> : <Navigate to="/doctor-login" />} />
                <Route path="/patients/add" element={ doctor ? <AddPatient /> : <Navigate to="/doctor-login" />} />
                <Route path="/doctor/reports" element={ doctor ? <ViewReport /> : <Navigate to="/doctor-login" />} />
                <Route path="/doctor-patients" element={doctor ? <ManagePatients /> : <Navigate to="/doctor-login" />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminLayout />}>
                <Route path="/admin-login" element={admin ? <Navigate to="/admin" /> : <AdminLogin />} />
                <Route path="/admin/*" element={admin ? <AdminDashboard /> : <Navigate to="/admin-login" />} />
            </Route>

            {/*Login and Signup Routes  */}
            <Route path="/login" element={authUser ? <Navigate to="/home" /> : <LoginPage />} />
            <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/home" />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/reset-password" element={<ForgotPaswordPage />} />
            <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
            <Route path="/registration-success" element={<SuccessPage />} />
            <Route path="/doctor-reset-password" element={<DoctorForgotPassword />} />
            <Route path="/doctor-reset-password/:resetToken" element={<DoctorResetPassword />} />

            <Route path="/t" element={<Testing />} />
          </Routes>
        </div>
      </BrowserRouter>
  );
};

export default App;