import express from 'express';
import { 
    // Auth routes
    registerDoctor, 
    loginDoctor, 
    logoutDoctor,
    checkDoctor,
    
    // Password management 
    forgotPassword, 
    resetPassword,
    verifyResetToken,
    sendOtp,
    verifyOtp,
    
    // Doctor data routes
    getDoctors, 
    getDoctorById, 
    updateDoctor, 
    deleteDoctorById, 
    getDoctorAvailability 
} from '../controllers/doctor.controller.js';
import { protectDoctorRoute } from '../middleware/auth.middleware.js';
import upload from '../lib/upload.js';

const router = express.Router();

// Authentication routes
router.post('/register', registerDoctor);
router.post('/login', loginDoctor);
router.post('/logout', logoutDoctor);
router.get('/check', protectDoctorRoute, checkDoctor);

// OTP verification routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Password reset routes
router.post('/doctor-forgot-password', forgotPassword);
router.post('/doctor-reset-password', resetPassword);
router.get('/doctor-verify-reset-token/:resetToken', verifyResetToken);

// Doctor data routes
router.get('/getDoctor', getDoctors);
router.put('/update', protectDoctorRoute, upload.single('image'), updateDoctor);
router.delete('/delete/:id', deleteDoctorById);
router.get('/availability/:id', getDoctorAvailability);
router.get('/:id', getDoctorById);

export default router;