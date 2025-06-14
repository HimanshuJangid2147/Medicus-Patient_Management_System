import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './lib/db.js';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.route.js';
import doctorRoutes from './routes/doctor.route.js';
import patientRoutes from './routes/patient.route.js';
import categoryRoutes from './routes/categories.route.js';
import appointmentRoutes from './routes/appointment.route.js';
import scheduleRoutes from './routes/schedule.route.js';
import medicalRecordRoutes from './routes/medicalRecord.route.js';
import notificationRoutes from './routes/notification.route.js';
import paymentRoutes from './routes/payment.route.js';
import contactUsRoutes from './routes/contactus.route.js';

// --- Pre-run setup ---
dotenv.config();

// ES module equivalent of __dirname for resolving file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Express App Initialization ---
const app = express();

// --- Connect to Database ---
// This is the most important change: Connect to DB on module initialization
connectDB();

// --- Constants from Environment Variables ---
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// --- Middlewares ---
app.use(helmet());

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || CLIENT_ORIGIN.split(',').map(o => o.trim()).includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/doctor', doctorRoutes);
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/appointment', appointmentRoutes);
app.use('/api/v1/schedule', scheduleRoutes);
app.use('/api/v1/medical-record', medicalRecordRoutes);
app.use('/api/v1/notification', notificationRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/contact-us', contactUsRoutes);


// --- Error Handling Middlewares ---
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

// Export the app for Vercel. `app.listen` is not needed for serverless.
export default app;
