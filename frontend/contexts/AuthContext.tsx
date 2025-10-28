import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { apiClient } from '@/services/apiClient';
import { AuthContextType, User, LoginData, RegisterData } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalanceState] = useState<number | null>(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('user')
      ]);

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          setBalanceState(typeof userData.balance === 'number' ? userData.balance : null);
        } catch (parseError) {
          console.error('Error parsing stored user data:', parseError);
          // Clear corrupted data
          await AsyncStorage.multiRemove(['authToken', 'user']);
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceId = async (): Promise<string> => {
    try {
      let deviceId = await AsyncStorage.getItem('deviceId');
      if (!deviceId) {
        deviceId = Device.deviceName || Device.modelName || 'unknown-device';
        await AsyncStorage.setItem('deviceId', deviceId);
      }
      return deviceId;
    } catch (error) {
      console.error('Error getting device ID:', error);
      return 'unknown-device';
    }
  };

  const getPushToken = async (): Promise<string | undefined> => {
    try {
      // Only try to get push token if notifications are already initialized
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        return undefined; // Don't request permissions automatically
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      return undefined;
    }
  };

  const login = async (loginData: Omit<LoginData, 'deviceId' | 'pushToken'>) => {
    try {
      setIsLoading(true);
      const deviceId = await getDeviceId();
      const pushToken = await getPushToken();

      const data: LoginData = {
        ...loginData,
        deviceId,
        pushToken,
      };

      const response = await apiClient.login(data);

      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));

      setToken(response.token);
      setUser(response.user);
      if (typeof response.user.balance === 'number') {
        setBalance(response.user.balance);
      } else {
        setBalanceState(null);
      }
    } catch (error) {
      console.error('Login error:', error);
      // Don't set loading to false here, let the finally block handle it
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registerData: Omit<RegisterData, 'deviceId' | 'pushToken'>) => {
    try {
      setIsLoading(true);
      const deviceId = await getDeviceId();
      const pushToken = await getPushToken();

      const data: RegisterData = {
        ...registerData,
        deviceId,
        pushToken,
      };

      await apiClient.register(data);

      // Registration successful - don't auto-login
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setBalanceState(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const setBalance = useCallback((value: number | null) => {
    if (value === null) {
      setBalanceState(null);
      return null;
    }

    setBalanceState(value);
    setUser((prev) => {
      if (!prev) {
        return prev;
      }

      const updatedUser = { ...prev, balance: value };
      AsyncStorage.setItem('user', JSON.stringify(updatedUser)).catch((storageError) => {
        console.error('Error persisting user balance:', storageError);
      });
      return updatedUser;
    });

    return value;
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!token) {
      return null;
    }

    try {
      const balanceResponse = await apiClient.getBalance();
      return setBalance(balanceResponse.balance);
    } catch (error) {
      console.error('Error refreshing balance:', error);
      throw error;
    }
  }, [setBalance, token]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    balance,
    setBalance,
    login,
    register,
    logout,
    refreshBalance,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
