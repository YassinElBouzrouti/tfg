import { Router } from 'express';
import prismaPkg from '@prisma/client';
import {
  confirmAdminAccess,
  confirmMemberAccess,
  getCurrentUser,
  listPublicPlans,
  login,
  register,
} from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/requireRole.js';

const { Role } = prismaPkg;
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/plans', listPublicPlans);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/admin-check', authMiddleware, requireRole(Role.ADMIN), confirmAdminAccess);
router.get('/member-check', authMiddleware, requireRole(Role.MEMBER), confirmMemberAccess);

export default router;
