import { Router } from 'express';
import prismaPkg from '@prisma/client';
import {
  createBooking,
  listAvailableClassesForMember,
  listMyBookings,
} from '../controllers/bookingController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/requireRole.js';

const { Role } = prismaPkg;
const router = Router();

router.use(authMiddleware, requireRole(Role.MEMBER));
router.get('/classes', listAvailableClassesForMember);
router.get('/me', listMyBookings);
router.post('/', createBooking);

export default router;
