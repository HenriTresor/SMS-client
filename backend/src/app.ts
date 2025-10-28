import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/authRoutes';
import savingsRoutes from './routes/savingsRoutes';
import swaggerSpec from './docs/swagger';

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please wait a moment before trying again.',
  },
});

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(limiter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs.json', (_req, res) => {
  res.json(swaggerSpec);
});

app.use('/auth', authRoutes);
app.use('/savings', savingsRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'Client Backend API' });
});

export default app;
