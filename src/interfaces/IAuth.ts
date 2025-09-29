// Auth Request Types
export interface RegisterRequest {
  username: string;
  password: string;
  full_name: string;
  email: string;
  school: string;
  city: string;
  region: string;
  country: string;
  study_field: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Auth Response Types
export interface RegisterResponse {
  success: boolean;
  message: string;
  emailSent: boolean;
  userId: string;
}

export type UserRole = "admin" | "organizer" | "customer";

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  roles: UserRole[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Auth State Types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
