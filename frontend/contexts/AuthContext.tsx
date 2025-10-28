import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { AppState } from 'react-native';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import { apiClient } from '@/services/apiClient';
import { AuthContextType, User, LoginData, RegisterData } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'user';
const AUTH_EXPIRY_KEY = 'authTokenExpiry';
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

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
  const sessionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSession = useCallback(async () => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }

    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY, AUTH_EXPIRY_KEY]);
    setToken(null);
    setUser(null);
    setBalanceState(null);
  }, []);

  const scheduleSessionExpiry = useCallback(async (durationMs: number = SESSION_DURATION_MS) => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    const expiryTimestamp = Date.now() + durationMs;
    await AsyncStorage.setItem(AUTH_EXPIRY_KEY, expiryTimestamp.toString());

    sessionTimeoutRef.current = setTimeout(() => {
      clearSession().catch((error) => {
        console.error('Error clearing session on expiry:', error);
      });
    }, durationMs);
  }, [clearSession]);

  const loadStoredAuth = useCallback(async () => {
    try {
      const [storedToken, storedUser, storedExpiry] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(AUTH_USER_KEY),
        AsyncStorage.getItem(AUTH_EXPIRY_KEY),
      ]);

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const expiryTimestamp = storedExpiry ? parseInt(storedExpiry, 10) : null;

          if (expiryTimestamp && expiryTimestamp > Date.now()) {
            const remainingTime = expiryTimestamp - Date.now();
            setToken(storedToken);
            setUser(userData);
            setBalanceState(typeof userData.balance === 'number' ? userData.balance : null);
            await scheduleSessionExpiry(remainingTime);
          } else {
            await clearSession();
          }
        } catch (parseError) {
          console.error('Error parsing stored user data:', parseError);
          // Clear corrupted data
          await clearSession();
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  }, [clearSession, scheduleSessionExpiry]);

  useEffect(() => {
    loadStoredAuth();

    const appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState !== 'active') {
        clearSession().catch((error) => {
          console.error('Error clearing session on app background:', error);
        });
      }
    });

    return () => {
      appStateListener.remove();
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
    };
  }, [clearSession, loadStoredAuth]);

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

      await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));

      setToken(response.token);
      setUser(response.user);
      if (typeof response.user.balance === 'number') {
        setBalance(response.user.balance);
      } else {
        setBalanceState(null);
      }

      scheduleSessionExpiry();
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

  const logout = useCallback(async () => {
    try {
      await clearSession();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [clearSession]);

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
      AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser)).catch((storageError) => {
        console.error('Error persisting user balance:', storageError);
      });
      return updatedUser;
    });

    scheduleSessionExpiry().catch((error) => {
      console.error('Error scheduling session from balance update:', error);
    });

    return value;
  }, [scheduleSessionExpiry]);

  const refreshBalance = useCallback(async () => {
    if (!token) {
      return null;
    }

    try {
      const balanceResponse = await apiClient.getBalance();
      const updatedBalance = setBalance(balanceResponse.balance);
      scheduleSessionExpiry();
      return updatedBalance;
    } catch (error) {
      console.error('Error refreshing balance:', error);
      throw error;
    }
  }, [scheduleSessionExpiry, setBalance, token]);

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
