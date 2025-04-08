import express from 'express';
import Doctor from '../models/doctor.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;