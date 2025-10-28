import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export class NotificationService {
  private static isInitialized = false;

  static async initialize() {
    if (this.isInitialized) {
      return true;
    }

    try {
      // Check if we're in Expo Go (which has limited push notification support)
      // Expo Go: __DEV__ = true, Development Build: __DEV__ = false
      const isExpoGo = __DEV__;

      // Configure notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowList: true,
        }),
      });

      // Request permissions (only basic permissions in Expo Go)
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return false;
      }

      // Configure notification channel for Android (if not in Expo Go)
      if (Platform.OS === 'android' && !isExpoGo) {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  static async showDepositNotification(amount: number) {
    try {
      await this.ensureInitialized();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💰 Deposit Successful',
          body: `Your deposit of $${amount.toFixed(2)} has been processed successfully.`,
          sound: 'default',
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Error showing deposit notification:', error);
    }
  }

  static async showWithdrawalNotification(amount: number) {
    try {
      await this.ensureInitialized();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💸 Withdrawal Processed',
          body: `Your withdrawal of $${amount.toFixed(2)} has been processed successfully.`,
          sound: 'default',
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing withdrawal notification:', error);
    }
  }

  static async showLowBalanceNotification(currentBalance: number) {
    try {
      await this.ensureInitialized();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⚠️ Low Balance Alert',
          body: `Your account balance is $${currentBalance.toFixed(2)}. Consider adding funds to avoid overdrafts.`,
          sound: 'default',
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing low balance notification:', error);
    }
  }

  static async showVerificationNotification() {
    try {
      await this.ensureInitialized();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '✅ Device Verified',
          body: 'Your device has been verified by an administrator. You can now access all features.',
          sound: 'default',
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing verification notification:', error);
    }
  }

  static async showLoginNotification() {
    try {
      await this.ensureInitialized();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔐 Login Successful',
          body: 'You have successfully logged in to your savings account.',
          sound: 'default',
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing login notification:', error);
    }
  }

  private static async ensureInitialized(): Promise<boolean> {
    if (!this.isInitialized) {
      return await this.initialize();
    }
    return true;
  }
}
