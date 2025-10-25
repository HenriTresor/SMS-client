export interface RegisterDto {
  email: string;
  password: string;
  deviceId: string;
  pushToken?: string;
}

export interface LoginDto {
  email: string;
  password: string;
  deviceId: string;
  pushToken?: string;
}

// Response DTOs (omit sensitive data)
export interface AuthResponseDto {
  token: string;
  user: UserResponseDto;
}

export interface UserResponseDto {
  id: string;
  email: string;
  balance: number;
  createdAt: Date;
}

export interface TransactionResponseDto {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  createdAt: Date;
}

// Full DTOs (for internal use)
export interface UserDto {
  id: string;
  email: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
  devices?: DeviceDto[];
  transactions?: TransactionDto[];
}

export interface DeviceDto {
  id: string;
  deviceId: string;
  pushToken?: string;
  isVerified: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: UserDto;
}

export interface TransactionDto {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  userId: string;
  createdAt: Date;
  user?: UserDto;
}

// Request DTOs
export interface DepositDto {
  amount: number;
}

export interface WithdrawDto {
  amount: number;
}
