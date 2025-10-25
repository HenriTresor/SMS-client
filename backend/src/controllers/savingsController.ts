import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { SavingsService } from '../services/savingsService';

export class SavingsController {
  static async getBalance(req: AuthRequest, res: Response) {
    try {
      const balance = await SavingsService.getBalance(req.userId!);
      res.json({ balance });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deposit(req: AuthRequest, res: Response) {
    try {
      const { amount } = req.body;
      const balance = await SavingsService.deposit(req.userId!, amount);
      res.json({ balance });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async withdraw(req: AuthRequest, res: Response) {
    try {
      const { amount } = req.body;
      const balance = await SavingsService.withdraw(req.userId!, amount);
      res.json({ balance });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getHistory(req: AuthRequest, res: Response) {
    try {
      const history = await SavingsService.getTransactionHistory(req.userId!);
      res.json({ history });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
