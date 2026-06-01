import { Router } from 'express';
import prismaPkg from '@prisma/client';
import {
  createSimulatedPayment,
  listMyPayments,
} from '../controllers/paymentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/requireRole.js';

const { Role } = prismaPkg;
const router = Router();

router.use(authMiddleware);
router.get('/me', listMyPayments);
router.post('/simulate', requireRole(Role.MEMBER), createSimulatedPayment);

export default router;
