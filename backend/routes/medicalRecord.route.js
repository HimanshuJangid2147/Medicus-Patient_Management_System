import express from 'express';
import {
    createMedicalRecord,
    getAllMedicalRecords,
    getMedicalRecordById,
    getMedicalRecordsByPatient,
    updateMedicalRecord,
    deleteMedicalRecord
} from '../controllers/medicalRecord.controller.js';
import { protectRoute, protectDoctorRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', protectDoctorRoute, createMedicalRecord);
router.get('/all', protectDoctorRoute, getAllMedicalRecords);
router.get('/:id', protectRoute, getMedicalRecordById);
// router.get('/patient', protectRoute, getMedicalRecordsByPatient);
router.put('/:id', protectDoctorRoute, updateMedicalRecord);
router.delete('/:id', protectDoctorRoute, deleteMedicalRecord);

export default router;