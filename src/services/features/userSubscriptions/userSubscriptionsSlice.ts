import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../constant/axiosInstance";
import {
  USER_SUBSCRIPTION_CURRENT_ENDPOINT,
  USER_SUBSCRIPTION_HISTORY_ENDPOINT,
  USER_SUBSCRIPTION_PURCHASE_ENDPOINT,
  USER_SUBSCRIPTION_CANCEL_ENDPOINT,
} from "../../constant/apiConfig";
import {
  UserSubscription,
  UserSubscriptionResponse,
  UserSubscriptionHistoryResponse,
  PurchaseSubscriptionRequest,
  PurchaseSubscriptionResponse,
  CancelSubscriptionRequest,
  CancelSubscriptionResponse,
  UserSubscriptionState,
} from "@/interfaces/IUserSubscription";

const initialState: UserSubscriptionState = {
  currentSubscription: null,
  history: [],
  isLoading: false,
  error: null,
};

// Get current active subscription
export const fetchCurrentSubscription = createAsyncThunk<
  UserSubscription | null,
  void,
  { rejectValue: string }
>("userSubscriptions/fetchCurrent", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<UserSubscriptionResponse>(
      USER_SUBSCRIPTION_CURRENT_ENDPOINT,
    );
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || "Failed to get current subscription");
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to get current subscription",
    );
  }
});

// Get subscription history
export const fetchSubscriptionHistory = createAsyncThunk<
  UserSubscription[],
  void,
  { rejectValue: string }
>("userSubscriptions/fetchHistory", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<UserSubscriptionHistoryResponse>(
      USER_SUBSCRIPTION_HISTORY_ENDPOINT,
    );
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || "Failed to get subscription history");
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to get subscription history",
    );
  }
});

// Purchase subscription
export const purchaseSubscription = createAsyncThunk<
  PurchaseSubscriptionResponse["data"],
  PurchaseSubscriptionRequest,
  { rejectValue: string }
>(
  "userSubscriptions/purchase",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post<PurchaseSubscriptionResponse>(
        USER_SUBSCRIPTION_PURCHASE_ENDPOINT,
        payload,
      );
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error(res.message || "Failed to purchase subscription");
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to purchase subscription",
      );
    }
  },
);

// Cancel subscription
export const cancelSubscription = createAsyncThunk<
  UserSubscription,
  { subscriptionId: string; reason?: string },
  { rejectValue: string }
>(
  "userSubscriptions/cancel",
  async ({ subscriptionId, reason }, { rejectWithValue }) => {
    try {
      const res = await api.post<CancelSubscriptionResponse>(
        USER_SUBSCRIPTION_CANCEL_ENDPOINT(subscriptionId),
        { reason } as CancelSubscriptionRequest,
      );
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error(res.message || "Failed to cancel subscription");
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to cancel subscription",
      );
    }
  },
);

const userSubscriptionsSlice = createSlice({
  name: "userSubscriptions",
  initialState,
  reducers: {
    clearUserSubscriptionsError(state) {
      state.error = null;
    },
    clearCurrentSubscription(state) {
      state.currentSubscription = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch current subscription
      .addCase(fetchCurrentSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSubscription = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to get current subscription";
      })
      // Fetch history
      .addCase(fetchSubscriptionHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.history = action.payload;
        state.error = null;
      })
      .addCase(fetchSubscriptionHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to get subscription history";
      })
      // Purchase subscription
      .addCase(purchaseSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(purchaseSubscription.fulfilled, (state) => {
        state.isLoading = false;
        // Refresh current subscription after purchase
        // This will be handled by refetching
      })
      .addCase(purchaseSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to purchase subscription";
      })
      // Cancel subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update current subscription to cancelled
        if (state.currentSubscription?._id === action.payload._id) {
          state.currentSubscription = action.payload;
        }
        state.error = null;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to cancel subscription";
      });
  },
});

export const { clearUserSubscriptionsError, clearCurrentSubscription } =
  userSubscriptionsSlice.actions;
export default userSubscriptionsSlice.reducer;

