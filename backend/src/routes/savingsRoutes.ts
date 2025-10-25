import { Router } from 'express';
import { SavingsController } from '../controllers/savingsController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { depositSchema, withdrawSchema } from '../schemas/savingsSchemas';

const router = Router();

router.get('/balance', authenticate, SavingsController.getBalance);
router.post('/deposit', authenticate, validate(depositSchema), SavingsController.deposit);
router.post('/withdraw', authenticate, validate(withdrawSchema), SavingsController.withdraw);
router.get('/history', authenticate, SavingsController.getHistory);

export default router;
