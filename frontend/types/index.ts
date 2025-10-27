// TypeScript types for the mobile app
export interface RegisterData {
  email: string;
  password: string;
  deviceId: string;
  pushToken?: string;
}

export interface LoginData {
  email: string;
  password: string;
  deviceId: string;
  pushToken?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    balance: number;
    createdAt: string;
  };
}

export interface BalanceResponse {
  balance: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  createdAt: string;
}

export interface TransactionHistoryResponse {
  history: Transaction[];
}

export interface DepositData {
  amount: number;
}

export interface WithdrawData {
  amount: number;
}

export interface ApiError {
  error: string;
}

export interface User {
  id: string;
  email: string;
  balance: number;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: Omit<LoginData, 'deviceId' | 'pushToken'>) => Promise<void>;
  register: (data: Omit<RegisterData, 'deviceId' | 'pushToken'>) => Promise<void>;
  logout: () => void;
  refreshBalance: () => Promise<void>;
}
