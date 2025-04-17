import express from 'express';
import {
    createPayment,
    getPaymentById,
    updatePaymentStatus,
    deletePayment
} from '../controllers/payment.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new payment (Patient)
router.post('/', protectRoute, createPayment);

// Get payment by ID (Patient)
router.get('/:id', protectRoute, getPaymentById);

// Update payment status (Patient)
router.put('/:id', protectRoute, updatePaymentStatus);

// Delete a payment (Patient)
router.delete('/:id', protectRoute, deletePayment);

export default router;