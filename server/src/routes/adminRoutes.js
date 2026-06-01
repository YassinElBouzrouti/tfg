import { Router } from 'express';
import prismaPkg from '@prisma/client';
import {
  createCashPayment,
  createMember,
  getMemberById,
  listClassesWithBookings,
  listMembers,
  listPlans,
  updatePaymentStatus,
} from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/requireRole.js';

const { Role } = prismaPkg;
const router = Router();

router.use(authMiddleware, requireRole(Role.ADMIN));

router.get('/members', listMembers);
router.get('/members/:memberId', getMemberById);
router.post('/members', createMember);
router.get('/plans', listPlans);
router.get('/classes', listClassesWithBookings);
router.post('/payments/cash', createCashPayment);
router.patch('/payments/:paymentId/status', updatePaymentStatus);

export default router;
