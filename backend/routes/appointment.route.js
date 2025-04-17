import express from 'express';
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  rescheduleAppointment
} from '../controllers/appointment.controller.js';
import { protectMultiRoleRoute, protectDoctorRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', protectMultiRoleRoute, createAppointment);
router.get('/getAll-appointments',getAllAppointments);
router.get('/patient', protectMultiRoleRoute, getAppointmentsByPatient);
router.get('/doctor', protectDoctorRoute, getAppointmentsByDoctor);
router.put('/cancel/:id', protectMultiRoleRoute, cancelAppointment);
router.put('/reschedule/:id', protectMultiRoleRoute, rescheduleAppointment);
router.get('/:id', protectMultiRoleRoute, getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', protectMultiRoleRoute, deleteAppointment);

export default router;