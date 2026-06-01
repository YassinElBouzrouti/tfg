import adminRoutes from './adminRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import { Router } from 'express';
import authRoutes from './authRoutes.js';
import healthRoutes from './healthRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import planRoutes from './planRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/plans', planRoutes);
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);
router.use('/bookings', bookingRoutes);

export default router;
