import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import appointmentRoutes from './routes/appointment.route.js';
import doctorRoutes from './routes/doctor.route.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));