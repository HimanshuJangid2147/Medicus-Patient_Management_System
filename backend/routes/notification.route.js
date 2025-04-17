import express from 'express';
import {
    createNotification,
    getNotifications,
    markNotificationAsRead,
    deleteNotification
} from '../controllers/notification.controller.js';
import { protectMultiRoleRoute, protectAdminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protectAdminRoute, createNotification);
router.get('/', protectMultiRoleRoute, getNotifications);
router.put('/:id/read', protectMultiRoleRoute, markNotificationAsRead);
router.delete('/:id', protectMultiRoleRoute, deleteNotification);

export default router;