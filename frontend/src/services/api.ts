import axios from 'axios';
import * as Device from 'expo-device';

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

export default api;
