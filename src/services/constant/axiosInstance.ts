import axios from "axios";
import {
  BASE_URL,
  REFRESH_TOKEN_ENDPOINT,
  VERIFY_TOKEN_ENDPOINT,
} from "./apiConfig";

// Types for better TypeScript support
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface VerifyTokenResponse {
  valid: boolean;
  user?: any;
}

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper functions to manage tokens
const getTokensFromStorage = (): AuthTokens | null => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }
    return null;
  } catch (error) {
    console.error("Error getting tokens from storage:", error);
    return null;
  }
};

const setTokensToStorage = (tokens: AuthTokens): void => {
  try {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  } catch (error) {
    console.error("Error setting tokens to storage:", error);
  }
};

const clearTokensFromStorage = (): void => {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  } catch (error) {
    console.error("Error clearing tokens from storage:", error);
  }
};

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to add subscribers waiting for token refresh
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Function to notify all subscribers when refresh is complete
const onRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config: any) => {
    const tokens = getTokensFromStorage();

    if (tokens?.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      const tokens = getTokensFromStorage();

      // Only attempt refresh if we have tokens (user is logged in)
      if (!tokens?.refreshToken) {
        // No refresh token available - user is not logged in or tokens expired
        clearTokensFromStorage();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, wait for it to complete
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint
        const response = await axios.post<RefreshTokenResponse>(
          `${REFRESH_TOKEN_ENDPOINT}`,
          { refreshToken: tokens.refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const newTokens = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        };

        // Update stored tokens
        setTokensToStorage(newTokens);

        // Update authorization header for current request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        }

        // Notify all waiting requests
        onRefreshed(newTokens.accessToken);

        isRefreshing = false;

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;

        // Refresh failed, clear tokens and redirect to login
        clearTokensFromStorage();

        // Dispatch logout action if using Redux
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Enhanced HTTP methods with better error handling
export const api = {
  // GET request
  get: async <T = any>(url: string, config?: any): Promise<T> => {
    try {
      const response = await axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      console.error(`GET ${url} failed:`, error);
      throw error;
    }
  },

  // POST request
  post: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    try {
      const response = await axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`POST ${url} failed:`, error);
      throw error;
    }
  },

  // PUT request
  put: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    try {
      const response = await axiosInstance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`PUT ${url} failed:`, error);
      throw error;
    }
  },

  // PATCH request
  patch: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    try {
      const response = await axiosInstance.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`PATCH ${url} failed:`, error);
      throw error;
    }
  },

  // DELETE request
  delete: async <T = any>(url: string, config?: any): Promise<T> => {
    try {
      const response = await axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error);
      throw error;
    }
  },

  // File upload with FormData
  upload: async <T = any>(
    url: string,
    formData: FormData,
    config?: any,
  ): Promise<T> => {
    try {
      const response = await axiosInstance.post<T>(url, formData, {
        ...config,
        headers: {
          "Content-Type": "multipart/form-data",
          ...config?.headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`UPLOAD ${url} failed:`, error);
      throw error;
    }
  },

  // File upload with FormData using PUT
  uploadPut: async <T = any>(
    url: string,
    formData: FormData,
    config?: any,
  ): Promise<T> => {
    try {
      const response = await axiosInstance.put<T>(url, formData, {
        ...config,
        headers: {
          "Content-Type": "multipart/form-data",
          ...config?.headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`UPLOAD_PUT ${url} failed:`, error);
      throw error;
    }
  },

  // Verify token
  verifyToken: async (token: string): Promise<VerifyTokenResponse> => {
    try {
      const response = await axios.post<VerifyTokenResponse>(
        `${VERIFY_TOKEN_ENDPOINT}`,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Token verification failed:", error);
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${REFRESH_TOKEN_ENDPOINT}`,
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  },
};

// Token management utilities
export const tokenUtils = {
  setTokens: setTokensToStorage,
  getTokens: getTokensFromStorage,
  clearTokens: clearTokensFromStorage,
  isTokenValid: async (token: string): Promise<boolean> => {
    try {
      const result = await api.verifyToken(token);
      return result.valid;
    } catch {
      return false;
    }
  },
};

export default axiosInstance;
