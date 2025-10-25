import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate } from '../middlewares/validation';
import { registerSchema, loginSchema } from '../schemas/authSchemas';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);

export default router;
