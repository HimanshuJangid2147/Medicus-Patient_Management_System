import express from 'express';
import {
    createSchedule,
    getScheduleByDoctor,
    updateSchedule,
    deleteSchedule
} from '../controllers/schedule.controller.js';
import { protectDoctorRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new schedule (Doctor)
router.post('/', protectDoctorRoute, createSchedule);

// Get all schedules for the authenticated doctor
router.get('/doctor', protectDoctorRoute, getScheduleByDoctor);

// Update a schedule (Doctor)
router.put('/:id', protectDoctorRoute, updateSchedule);

// Delete a schedule (Doctor)
router.delete('/:id', protectDoctorRoute, deleteSchedule);

export default router;