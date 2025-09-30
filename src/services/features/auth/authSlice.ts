import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState,
  RegisterRequest,
  LoginRequest,
  RegisterResponse,
  LoginResponse,
  OrganizerRegistrationRequest,
  OrganizerRegistrationResponse,
  VerifyTokenRequest,
  VerifyTokenResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  User,
} from "@/interfaces/IAuth";
import { api, tokenUtils } from "@/services/constant/axiosInstance";
import {
  LOGIN_ENDPOINT,
  REGISTER_ENDPOINT,
  REGISTER_ORGANIZER_ENDPOINT,
  VERIFY_TOKEN_ENDPOINT,
  VERIFY_EMAIL_ENDPOINT,
  RESEND_VERIFICATION_ENDPOINT,
  FORGOT_PASSWORD_ENDPOINT,
  RESET_PASSWORD_ENDPOINT,
  REFRESH_TOKEN_ENDPOINT,
  CHANGE_PASSWORD_ENDPOINT,
} from "@/services/constant/apiConfig";

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  needsVerification: false,
  verificationEmail: null,
};

// Async thunks
export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterRequest,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post<RegisterResponse>(
      REGISTER_ENDPOINT,
      userData,
    );
    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Registration failed";
    return rejectWithValue(errorMessage);
  }
});

export const registerOrganizer = createAsyncThunk<
  OrganizerRegistrationResponse,
  OrganizerRegistrationRequest,
  { rejectValue: string }
>("auth/registerOrganizer", async (orgData, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("user", JSON.stringify(orgData.user));
    formData.append("organizer", JSON.stringify(orgData.organizer));

    if (orgData.avatar) {
      formData.append("avatar", orgData.avatar);
    }

    const response = await api.upload<OrganizerRegistrationResponse>(
      REGISTER_ORGANIZER_ENDPOINT,
      formData,
    );
    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Organizer registration failed";
    return rejectWithValue(errorMessage);
  }
});

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  {
    rejectValue: {
      message: string;
      needsVerification?: boolean;
      email?: string;
    };
  }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post<LoginResponse>(LOGIN_ENDPOINT, credentials);

    // Store tokens in localStorage after successful login
    if (response.accessToken && response.refreshToken) {
      tokenUtils.setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    }

    return response;
  } catch (error: any) {
    const errorData = error.response?.data;
    const errorMessage = errorData?.message || error.message || "Login failed";

    // If email needs verification, return special error with needsVerification flag
    if (errorData?.needsVerification) {
      return rejectWithValue({
        message: errorMessage,
        needsVerification: true,
        email: credentials.email,
      });
    }

    return rejectWithValue({ message: errorMessage });
  }
});

export const verifyToken = createAsyncThunk<
  VerifyTokenResponse,
  VerifyTokenRequest,
  { rejectValue: string }
>("auth/verifyToken", async (tokenData, { rejectWithValue }) => {
  try {
    const response = await api.post<VerifyTokenResponse>(
      VERIFY_TOKEN_ENDPOINT,
      tokenData,
    );
    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Token verification failed";
    return rejectWithValue(errorMessage);
  }
});

export const verifyEmail = createAsyncThunk<
  VerifyEmailResponse,
  VerifyEmailRequest,
  { rejectValue: string }
>("auth/verifyEmail", async (emailData, { rejectWithValue }) => {
  try {
    const response = await api.post<VerifyEmailResponse>(
      VERIFY_EMAIL_ENDPOINT,
      emailData,
    );
    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Email verification failed";
    return rejectWithValue(errorMessage);
  }
});

export const resendVerification = createAsyncThunk<
  ResendVerificationResponse,
  ResendVerificationRequest,
  { rejectValue: string }
>("auth/resendVerification", async (emailData, { rejectWithValue }) => {
  try {
    const response = await api.post<ResendVerificationResponse>(
      RESEND_VERIFICATION_ENDPOINT,
      emailData,
    );
    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Resend verification failed";
    return rejectWithValue(errorMessage);
  }
});

export const forgotPassword = createAsyncThunk<
  ForgotPasswordResponse,
  ForgotPasswordRequest,
  { rejectValue: string }
>("auth/forgotPassword", async (emailData, { rejectWithValue }) => {
  try {
    const response = await api.post<ForgotPasswordResponse>(
      FORGOT_PASSWORD_ENDPOINT,
      emailData,
    );
    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Forgot password failed";
    return rejectWithValue(errorMessage);
  }
});

export const resetPassword = createAsyncThunk<
  ResetPasswordResponse,
  ResetPasswordRequest,
  { rejectValue: string }
>("auth/resetPassword", async (resetData, { rejectWithValue }) => {
  try {
    const response = await api.post<ResetPasswordResponse>(
      RESET_PASSWORD_ENDPOINT,
      resetData,
    );
    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Reset password failed";
    return rejectWithValue(errorMessage);
  }
});

export const refreshToken = createAsyncThunk<
  RefreshTokenResponse,
  RefreshTokenRequest,
  { rejectValue: string }
>("auth/refreshToken", async (tokenData, { rejectWithValue }) => {
  try {
    const response = await api.post<RefreshTokenResponse>(
      REFRESH_TOKEN_ENDPOINT,
      tokenData,
    );

    // Update stored tokens
    if (response.accessToken && response.refreshToken) {
      tokenUtils.setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    }

    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Token refresh failed";
    return rejectWithValue(errorMessage);
  }
});

export const changePassword = createAsyncThunk<
  ChangePasswordResponse,
  ChangePasswordRequest,
  { rejectValue: string }
>("auth/changePassword", async (passwordData, { rejectWithValue }) => {
  try {
    const response = await api.post<ChangePasswordResponse>(
      CHANGE_PASSWORD_ENDPOINT,
      passwordData,
    );
    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Change password failed";
    return rejectWithValue(errorMessage);
  }
});

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.needsVerification = false;
      state.verificationEmail = null;

      // Clear tokens from localStorage
      tokenUtils.clearTokens();
    },
    clearError: (state) => {
      state.error = null;
      state.needsVerification = false;
      state.verificationEmail = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Registration failed";
      })

      // Register Organizer
      .addCase(registerOrganizer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerOrganizer.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerOrganizer.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Organizer registration failed";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.user && action.payload.accessToken) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken || null;
          state.isAuthenticated = true;
        }
        state.error = null;
        state.needsVerification = false;
        state.verificationEmail = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;

        // Handle verification needed case
        if (
          typeof action.payload === "object" &&
          action.payload?.needsVerification
        ) {
          state.error = action.payload.message;
          state.needsVerification = true;
          state.verificationEmail = action.payload.email || null;
        } else {
          const errorMessage =
            typeof action.payload === "string"
              ? action.payload
              : action.payload?.message || "Login failed";
          state.error = errorMessage;
          state.needsVerification = false;
          state.verificationEmail = null;
        }
      })

      // Verify Token
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.valid && action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Token verification failed";
        // Clear invalid tokens
        tokenUtils.clearTokens();
        state.isAuthenticated = false;
        state.user = null;
      })

      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Email verification failed";
      })

      // Resend Verification
      .addCase(resendVerification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Resend verification failed";
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Forgot password failed";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Reset password failed";
      })

      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Token refresh failed";
        // Clear invalid tokens on refresh failure
        tokenUtils.clearTokens();
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Change password failed";
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
