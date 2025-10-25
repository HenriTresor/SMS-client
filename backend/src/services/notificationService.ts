import { Expo, ExpoPushMessage, ExpoPushToken } from 'expo-server-sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const expo = new Expo();

export class NotificationService {
  static async sendNotification(pushToken: string, title: string, body: string, data?: any) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      return;
    }

    const message: ExpoPushMessage = {
      to: pushToken,
      sound: 'default',
      title,
      body,
      data,
    };

    try {
      const ticket = await expo.sendPushNotificationsAsync([message]);
      console.log('Notification sent:', ticket);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  static async sendToUser(userId: string, title: string, body: string, data?: any) {
    const devices = await prisma.device.findMany({
      where: { userId, pushToken: { not: null } },
    });

    for (const device of devices) {
      if (device.pushToken) {
        await this.sendNotification(device.pushToken, title, body, data);
      }
    }
  }

  static async sendToDevice(deviceId: string, title: string, body: string, data?: any) {
    const device = await prisma.device.findUnique({
      where: { deviceId },
    });

    if (device?.pushToken) {
      await this.sendNotification(device.pushToken, title, body, data);
    }
  }
}
