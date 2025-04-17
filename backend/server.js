import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import appointmentRoutes from './routes/appointment.route.js';
import doctorRoutes from './routes/doctor.route.js';
import adminRoutes from './routes/admin.route.js';
import authRoutes from './routes/auth.routes.js';
import patientRoutes from './routes/patient.route.js';
import medicalRecordRoutes from './routes/medicalRecord.route.js';
import notificationRoutes from './routes/notification.route.js';
import scheduleRoutes from './routes/schedule.route.js';
import paymentRoutes from './routes/payment.route.js';
import cookieParser from 'cookie-parser';
import categoriesRoute from "./routes/categories.route.js";
import contactusRoute from "./routes/contactus.route.js";
import path from 'path';

dotenv.config();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:5173"],
        credentials: true,
    })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/categories', categoriesRoute);
app.use('/api/contact', contactusRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}


// Start server and connect to database
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB();
});