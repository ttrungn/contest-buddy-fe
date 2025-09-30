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

export interface OrganizerRegistrationRequest {
  user: {
    username: string;
    password: string;
    full_name: string;
    email: string;
  };
  organizer: {
    name: string;
    email: string;
    description: string;
    address: string;
    phone: string;
    website: string;
  };
  avatar?: File;
}

export interface VerifyTokenRequest {
  token: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Auth Response Types
export interface RegisterResponse {
  success: boolean;
  message: string;
  emailSent: boolean;
  userId: string;
}

export interface OrganizerRegistrationResponse {
  success: boolean;
  message: string;
  emailSent: boolean;
  userId: string;
  organizerId: string;
}

export interface VerifyTokenResponse {
  success: boolean;
  message: string;
  valid: boolean;
  user?: User;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
  emailSent: boolean;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  emailSent: boolean;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
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
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  needsVerification?: boolean;
  userId?: string;
}

// Auth State Types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  needsVerification?: boolean;
  verificationEmail?: string;
}
