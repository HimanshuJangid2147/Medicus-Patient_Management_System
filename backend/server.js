/**
 * To use this updated server.js, you'll need to install a few new packages:
 * npm install helmet morgan
 */
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
// Load environment variables from .env file
dotenv.config();

// ES module equivalent of __dirname for resolving file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Express App Initialization ---
const app = express();

// --- Constants from Environment Variables ---
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
// It's recommended to set your client's URL in a .env file
// You can add multiple origins by separating them with a comma
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// --- Middlewares ---

// Helps secure your app by setting various HTTP headers
app.use(helmet());

// Configure Cross-Origin Resource Sharing (CORS)
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = CLIENT_ORIGIN.split(',').map(o => o.trim());
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Logger middleware for development to log HTTP requests
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Cookie parser middleware to handle and parse cookies
app.use(cookieParser());

// JSON and URL-encoded body parsers with increased limit
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

// --- Production Build Serving & Catch-all Route ---
// This section should be placed after all API routes.
// It ensures that your backend can serve your frontend's static build files in production.
if (NODE_ENV === 'production') {
  // The path to the frontend's static build files
  const frontendDistPath = path.resolve(__dirname, '..', 'frontend', 'dist');
  
  // Serve the static files (like CSS, JS, images)
  app.use(express.static(frontendDistPath));

  // For any request that doesn't match an API route or a static file,
  // send back the React app's main index.html file. This is crucial for single-page applications.
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendDistPath, 'index.html'));
  });
} else {
  // A simple root route for development and API testing
  app.get('/', (req, res) => {
    res.send('Welcome to the Medicus API. Server is running in development mode.');
  });
}

// --- Error Handling Middlewares ---
// This middleware will run if no other route matches (404 Not Found).
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Generic error handler. This will catch any errors passed to next().
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // Provide stack trace only in development for easier debugging
    stack: NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

// --- Server Startup ---
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running in ${NODE_ENV} mode on port ${PORT}`);
});
