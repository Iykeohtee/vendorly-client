export type UserRole = 'vendor' | 'customer';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  storeName?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

