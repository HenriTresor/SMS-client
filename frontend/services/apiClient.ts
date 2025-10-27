import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  RegisterData,
  LoginData,
  AuthResponse,
  BalanceResponse,
  TransactionHistoryResponse,
  DepositData,
  WithdrawData,
  ApiError,
} from '../types';

const API_BASE_URL = 'http://localhost:3000'; // Update this for production

class ApiClient {
  private async getAuthHeaders(): Promise<{ [key: string]: string }> {
    const token = await AsyncStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async login(data: LoginData): Promise<AuthResponse> {
    console.log(JSON.stringify(API_BASE_URL))
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async getBalance(): Promise<BalanceResponse> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/savings/balance`, {
      method: 'GET',
      headers,
    });
    return this.handleResponse<BalanceResponse>(response);
  }

  async deposit(data: DepositData): Promise<BalanceResponse> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/savings/deposit`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse<BalanceResponse>(response);
  }

  async withdraw(data: WithdrawData): Promise<BalanceResponse> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/savings/withdraw`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse<BalanceResponse>(response);
  }

  async getTransactionHistory(): Promise<TransactionHistoryResponse> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/savings/history`, {
      method: 'GET',
      headers,
    });
    return this.handleResponse<TransactionHistoryResponse>(response);
  }
}

export const apiClient = new ApiClient();
