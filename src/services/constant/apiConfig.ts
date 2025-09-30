export const BASE_URL =
  "https://contest-buddy-be-594444870778.asia-southeast1.run.app";

// Auth endpoints
export const LOGIN_ENDPOINT = `${BASE_URL}/api/auth/login`;
export const REGISTER_ENDPOINT = `${BASE_URL}/api/auth/register`;
export const REGISTER_ORGANIZER_ENDPOINT = `${BASE_URL}/api/auth/register/organizer`;
export const VERIFY_TOKEN_ENDPOINT = `${BASE_URL}/api/auth/verify-token`;
export const VERIFY_EMAIL_ENDPOINT = `${BASE_URL}/api/auth/verify-email`;
export const VERIFY_EMAIL_TOKEN_ENDPOINT = (token: string) =>
  `${BASE_URL}/api/auth/verify-email/${token}`;
export const RESEND_VERIFICATION_ENDPOINT = `${BASE_URL}/api/auth/resend-verification`;
export const FORGOT_PASSWORD_ENDPOINT = `${BASE_URL}/api/auth/forgot-password`;
export const RESET_PASSWORD_ENDPOINT = `${BASE_URL}/api/auth/reset-password`;
export const REFRESH_TOKEN_ENDPOINT = `${BASE_URL}/api/auth/refresh-token`;
export const CHANGE_PASSWORD_ENDPOINT = `${BASE_URL}/api/auth/change-password`;

// Customer profile endpoints
export const CUSTOMER_PROFILE_ENDPOINT = `${BASE_URL}/api/customer/profile`;
export const CUSTOMER_AVATAR_ENDPOINT = `${BASE_URL}/api/customer/avatar`;
