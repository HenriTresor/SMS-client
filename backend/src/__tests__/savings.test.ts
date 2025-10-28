import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../app';
import { SavingsService } from '../services/savingsService';

const TEST_SECRET = 'client-test-secret';
const getToken = () => jwt.sign({ userId: 'user-1' }, TEST_SECRET);

describe('Savings routes', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = TEST_SECRET;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /savings/balance', () => {
    it('returns balance for authenticated user', async () => {
      jest.spyOn(SavingsService, 'getBalance').mockResolvedValue(120.5);

      const res = await request(app)
        .get('/savings/balance')
        .set('Authorization', `Bearer ${getToken()}`)
        .expect(200);

      expect(res.body).toEqual({ balance: 120.5 });
    });

    it('returns 400 when service throws', async () => {
      jest.spyOn(SavingsService, 'getBalance').mockRejectedValue(new Error('failure'));

      const res = await request(app)
        .get('/savings/balance')
        .set('Authorization', `Bearer ${getToken()}`)
        .expect(400);

      expect(res.body).toEqual({ error: 'failure' });
    });
  });

  describe('POST /savings/deposit', () => {
    it('deposits amount and returns new balance', async () => {
      jest.spyOn(SavingsService, 'deposit').mockResolvedValue(200);

      const res = await request(app)
        .post('/savings/deposit')
        .set('Authorization', `Bearer ${getToken()}`)
        .send({ amount: 50 })
        .expect(200);

      expect(res.body).toEqual({ balance: 200 });
    });

    it('returns 400 when validation fails', async () => {
      const res = await request(app)
        .post('/savings/deposit')
        .set('Authorization', `Bearer ${getToken()}`)
        .send({ amount: -10 })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 when service throws', async () => {
      jest.spyOn(SavingsService, 'deposit').mockRejectedValue(new Error('bad request'));

      const res = await request(app)
        .post('/savings/deposit')
        .set('Authorization', `Bearer ${getToken()}`)
        .send({ amount: 20 })
        .expect(400);

      expect(res.body).toEqual({ error: 'bad request' });
    });
  });

  describe('POST /savings/withdraw', () => {
    it('withdraws amount and returns new balance', async () => {
      jest.spyOn(SavingsService, 'withdraw').mockResolvedValue(80);

      const res = await request(app)
        .post('/savings/withdraw')
        .set('Authorization', `Bearer ${getToken()}`)
        .send({ amount: 20 })
        .expect(200);

      expect(res.body).toEqual({ balance: 80 });
    });

    it('returns 400 when validation fails', async () => {
      const res = await request(app)
        .post('/savings/withdraw')
        .set('Authorization', `Bearer ${getToken()}`)
        .send({})
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 when service throws', async () => {
      jest.spyOn(SavingsService, 'withdraw').mockRejectedValue(new Error('insufficient funds'));

      const res = await request(app)
        .post('/savings/withdraw')
        .set('Authorization', `Bearer ${getToken()}`)
        .send({ amount: 20 })
        .expect(400);

      expect(res.body).toEqual({ error: 'insufficient funds' });
    });
  });

  describe('GET /savings/history', () => {
    it('returns transaction history', async () => {
      const history = [{ id: 'txn-1', amount: 50, type: 'deposit' }];
      jest.spyOn(SavingsService, 'getTransactionHistory').mockResolvedValue(history as any);

      const res = await request(app)
        .get('/savings/history')
        .set('Authorization', `Bearer ${getToken()}`)
        .expect(200);

      expect(res.body).toEqual({ history });
    });

    it('returns 400 when service throws', async () => {
      jest.spyOn(SavingsService, 'getTransactionHistory').mockRejectedValue(new Error('db error'));

      const res = await request(app)
        .get('/savings/history')
        .set('Authorization', `Bearer ${getToken()}`)
        .expect(400);

      expect(res.body).toEqual({ error: 'db error' });
    });
  });
});
