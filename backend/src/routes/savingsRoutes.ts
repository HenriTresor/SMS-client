import { Router } from 'express';
import { SavingsController } from '../controllers/savingsController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import Joi from 'joi';

const router = Router();

const amountSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

router.get('/balance', authenticate, SavingsController.getBalance);
router.post('/deposit', authenticate, validate(amountSchema), SavingsController.deposit);
router.post('/withdraw', authenticate, validate(amountSchema), SavingsController.withdraw);
router.get('/history', authenticate, SavingsController.getHistory);

export default router;
