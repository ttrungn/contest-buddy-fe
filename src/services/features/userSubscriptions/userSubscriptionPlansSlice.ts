import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../constant/axiosInstance";
import {
  USER_SUBSCRIPTION_PLANS_ENDPOINT,
  USER_SUBSCRIPTION_PLAN_ENDPOINT,
} from "../../constant/apiConfig";
import {
  UserSubscriptionPlan,
  UserSubscriptionPlansResponse,
  UserSubscriptionPlanResponse,
  UserSubscriptionPlansState,
} from "@/interfaces/IUserSubscriptionPlan";

const initialState: UserSubscriptionPlansState = {
  plans: [],
  isLoading: false,
  error: null,
};

// Fetch all user subscription plans
export const fetchUserSubscriptionPlans = createAsyncThunk<
  UserSubscriptionPlan[],
  void,
  { rejectValue: string }
>("userSubscriptionPlans/fetchPlans", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<UserSubscriptionPlansResponse>(
      USER_SUBSCRIPTION_PLANS_ENDPOINT,
    );
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || "Failed to get plans");
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to get subscription plans",
    );
  }
});

// Create a new user subscription plan
export const createUserSubscriptionPlan = createAsyncThunk<
  UserSubscriptionPlan,
  Omit<
    UserSubscriptionPlan,
    "_id" | "createdAt" | "updatedAt" | "features"
  > & {
    features?: UserSubscriptionPlan["features"];
  },
  { rejectValue: string }
>(
  "userSubscriptionPlans/createPlan",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post<UserSubscriptionPlanResponse>(
        USER_SUBSCRIPTION_PLANS_ENDPOINT,
        payload,
      );
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error(res.message || "Failed to create plan");
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create subscription plan",
      );
    }
  },
);

// Update an existing user subscription plan
export const updateUserSubscriptionPlan = createAsyncThunk<
  UserSubscriptionPlan,
  {
    planId: string;
    data: Partial<
      Omit<UserSubscriptionPlan, "_id" | "createdAt" | "updatedAt"> & {
        features?: UserSubscriptionPlan["features"];
      }
    >;
  },
  { rejectValue: string }
>(
  "userSubscriptionPlans/updatePlan",
  async ({ planId, data }, { rejectWithValue }) => {
    try {
      const res = await api.put<UserSubscriptionPlanResponse>(
        USER_SUBSCRIPTION_PLAN_ENDPOINT(planId),
        data,
      );
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error(res.message || "Failed to update plan");
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update subscription plan",
      );
    }
  },
);

// Delete a user subscription plan
export const deleteUserSubscriptionPlan = createAsyncThunk<
  { planId: string },
  { planId: string },
  { rejectValue: string }
>(
  "userSubscriptionPlans/deletePlan",
  async ({ planId }, { rejectWithValue }) => {
    try {
      const res = await api.delete<{ success: boolean; message?: string }>(
        USER_SUBSCRIPTION_PLAN_ENDPOINT(planId),
      );
      if (res.success) {
        return { planId };
      }
      throw new Error(res.message || "Failed to delete plan");
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete subscription plan",
      );
    }
  },
);

const userSubscriptionPlansSlice = createSlice({
  name: "userSubscriptionPlans",
  initialState,
  reducers: {
    clearUserSubscriptionPlansError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch plans
      .addCase(fetchUserSubscriptionPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserSubscriptionPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload;
        state.error = null;
      })
      .addCase(fetchUserSubscriptionPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to get subscription plans";
      })
      // Create plan
      .addCase(createUserSubscriptionPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUserSubscriptionPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans.unshift(action.payload);
        state.error = null;
      })
      .addCase(createUserSubscriptionPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create subscription plan";
      })
      // Update plan
      .addCase(updateUserSubscriptionPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserSubscriptionPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.plans.findIndex(
          (p) => p._id === action.payload._id,
        );
        if (idx !== -1) {
          state.plans[idx] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUserSubscriptionPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update subscription plan";
      })
      // Delete plan
      .addCase(deleteUserSubscriptionPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserSubscriptionPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = state.plans.filter(
          (p) => p._id !== action.payload.planId,
        );
        state.error = null;
      })
      .addCase(deleteUserSubscriptionPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete subscription plan";
      });
  },
});

export const { clearUserSubscriptionPlansError } =
  userSubscriptionPlansSlice.actions;
export default userSubscriptionPlansSlice.reducer;

