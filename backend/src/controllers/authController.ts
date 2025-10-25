import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { RegisterDto, LoginDto } from '../dtos';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const dto: RegisterDto = req.body;
      const user = await AuthService.register(dto);
      res.status(201).json({ message: 'User registered successfully', user: { id: user.id, email: user.email } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const dto: LoginDto = req.body;
      const { token, user } = await AuthService.login(dto);
      res.json({ token, user: { id: user.id, email: user.email, balance: user.balance } });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}
