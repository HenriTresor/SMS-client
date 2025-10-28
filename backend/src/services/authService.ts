import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { RegisterDto, LoginDto } from '../dtos';
import { NotificationService } from './notificationService';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export class AuthService {
  static hashPassword(password: string): string {
    return crypto.createHash('sha512').update(password).digest('hex');
  }

  static verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  }

  static async register(dto: RegisterDto) {
    const hashedPassword = this.hashPassword(dto.password);
    const user = await prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });
    await prisma.device.create({
      data: {
        deviceId: dto.deviceId,
        pushToken: dto.pushToken!,
        userId: user.id,
      },
    });
    return user;
  }

  static async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
      include: { devices: true },
    });
    if (!user) throw new Error('User not found');

    if (!this.verifyPassword(dto.password, user.password)) {
      throw new Error('Invalid password');
    }

    const device = user.devices.find(d => d.deviceId === dto.deviceId);
    if (!device) throw new Error('Device not registered');

    if (!device.isVerified) throw new Error('Device not verified');

    // Update push token if provided
    if (dto.pushToken && dto.pushToken !== device.pushToken) {
      await prisma.device.update({
        where: { id: device.id },
        data: { pushToken: dto.pushToken },
      });
    }

    const token = this.generateToken(user.id);

    try {
      await NotificationService.sendToUser(user.id, 'Login Successful', 'You have successfully logged in.');
    } catch (error) {
      console.error('Error sending login notification:', error);
    }

    return { token, user };
  }
}
