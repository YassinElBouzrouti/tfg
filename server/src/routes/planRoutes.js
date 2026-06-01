import { Router } from 'express';
import { listPublicPlans } from '../controllers/authController.js';

const router = Router();

router.get('/', listPublicPlans);

export default router;
