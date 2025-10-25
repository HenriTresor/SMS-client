import { PrismaClient } from '@prisma/client';
import { NotificationService } from './notificationService';

const prisma = new PrismaClient();

export class SavingsService {
  static async getBalance(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });
    if (!user) throw new Error('User not found');
    return user.balance;
  }

  static async deposit(userId: string, amount: number) {
    if (amount <= 0) throw new Error('Amount must be positive');
    const user = await prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } },
    });
    await prisma.transaction.create({
      data: {
        type: 'deposit',
        amount,
        userId,
      },
    });

    // Send notification
    await NotificationService.sendToUser(userId, 'Deposit Confirmed', `$${amount} has been deposited to your account.`);

    return user.balance;
  }

  static async withdraw(userId: string, amount: number) {
    if (amount <= 0) throw new Error('Amount must be positive');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    if (user.balance < amount) throw new Error('Insufficient balance');
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } },
    });
    await prisma.transaction.create({
      data: {
        type: 'withdraw',
        amount,
        userId,
      },
    });

    // Send withdrawal notification
    await NotificationService.sendToUser(userId, 'Withdrawal Alert', `$${amount} has been withdrawn from your account.`);

    // Check for low balance
    if (updatedUser.balance < 100) { // Low balance threshold
      await NotificationService.sendToUser(userId, 'Low Balance Warning', `Your account balance is low: $${updatedUser.balance}. Please top up soon.`);
    }

    return updatedUser.balance;
  }

  static async getTransactionHistory(userId: string) {
    return await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
