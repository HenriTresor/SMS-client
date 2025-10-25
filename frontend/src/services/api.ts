import axios from 'axios';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const API_BASE_URL = 'http://localhost:3000'; // Adjust as needed

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getDeviceId = async () => {
  return Device.deviceName || 'unknown-device';
};

export const getPushToken = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission for notifications not granted');
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
};

// Set up notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default api;
