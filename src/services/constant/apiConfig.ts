export const BASE_URL = "https://contest-buddy-be-594444870778.asia-southeast1.run.app";

// Auth endpoints
export const LOGIN_ENDPOINT = `${BASE_URL}/api/auth/login`;
export const REGISTER_ENDPOINT = `${BASE_URL}/api/auth/register`;
export const VERIFY_EMAIL_ENDPOINT = `${BASE_URL}/api/auth/verify-email`;
export const VERIFY_EMAIL_TOKEN_ENDPOINT = (token: string) =>
  `${BASE_URL}/api/auth/verify-email/${token}`;
