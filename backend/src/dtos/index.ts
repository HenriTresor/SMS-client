export interface RegisterDto {
  email: string;
  password: string;
  deviceId: string;
}

export interface LoginDto {
  email: string;
  password: string;
  deviceId: string;
}

export interface UserDto {
  id: string;
  email: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceDto {
  id: string;
  deviceId: string;
  isVerified: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionDto {
  id: string;
  type: string;
  amount: number;
  userId: string;
  createdAt: Date;
}
