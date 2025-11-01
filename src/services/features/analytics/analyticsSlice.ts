import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../constant/axiosInstance";
import {
  ANALYTICS_USERS_TIME_RANGE_ENDPOINT,
  ANALYTICS_USERS_PERIOD_ENDPOINT,
  ANALYTICS_USERS_YEAR_ENDPOINT,
  ANALYTICS_REVENUE_TIME_RANGE_ENDPOINT,
  ANALYTICS_REVENUE_PERIOD_ENDPOINT,
  ANALYTICS_REVENUE_YEAR_ENDPOINT,
  ANALYTICS_PLANS_TIME_RANGE_ENDPOINT,
  ANALYTICS_PLANS_PERIOD_ENDPOINT,
  ANALYTICS_PLANS_YEAR_ENDPOINT,
  ANALYTICS_SUBSCRIPTION_DASHBOARD_ENDPOINT,
} from "../../constant/apiConfig";
import {
  AnalyticsState,
  TimeRangeParams,
  PeriodParams,
  YearParams,
  SubscriptionDashboardParams,
  UserTimeRangeResponse,
  UserPeriodResponse,
  UserYearResponse,
  RevenueTimeRangeResponse,
  RevenuePeriodResponse,
  RevenueYearResponse,
  PlansTimeRangeResponse,
  PlansPeriodResponse,
  PlansYearResponse,
  SubscriptionDashboardResponse,
} from "@/interfaces/IAnalytics";

const initialState: AnalyticsState = {
  // User Stats
  userTimeRange: null,
  userPeriod: null,
  userYear: null,

  // Revenue Stats
  revenueTimeRange: null,
  revenuePeriod: null,
  revenueYear: null,

  // Plan Stats
  plansTimeRange: null,
  plansPeriod: null,
  plansYear: null,

  // Subscription Dashboard
  subscriptionDashboard: null,

  // Loading states
  isLoading: false,
  error: null,
};

// User Statistics Async Thunks
export const fetchUserTimeRangeStats = createAsyncThunk(
  "analytics/fetchUserTimeRangeStats",
  async (params: TimeRangeParams, { rejectWithValue }) => {
    try {
      const res = await api.get<UserTimeRangeResponse>(
        ANALYTICS_USERS_TIME_RANGE_ENDPOINT(params.startDate, params.endDate),
      );
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error(res.message || "Failed to fetch user time range stats");
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch user time range stats",
      );
    }
  },
);

export const fetchUserPeriodStats = createAsyncThunk(
  "analytics/fetchUserPeriodStats",
  async (params: PeriodParams, { rejectWithValue }) => {
    try {
      const res = await api.get<UserPeriodResponse>(
        ANALYTICS_USERS_PERIOD_ENDPOINT(params.year, params.groupBy),
      );
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error(res.message || "Failed to fetch user period stats");
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch user period stats",
      );
    }
  },
);

export const fetchUserYearStats = createAsyncThunk(
  "analytics/fetchUserYearStats",
  async (params: YearParams, { rejectWithValue }) => {
    try {
      const res = await api.get<UserYearResponse>(
        ANALYTICS_USERS_YEAR_ENDPOINT(params.startYear, params.endYear),
      );
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error(res.message || "Failed to fetch user year stats");
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch user year stats",
      );
    }
  },
);

// Revenue Statistics Async Thunks
export const fetchRevenueTimeRangeStats = createAsyncThunk(
  "analytics/fetchRevenueTimeRangeStats",
  async (params: TimeRangeParams, { rejectWithValue }) => {
    try {
      const res = await api.get<RevenueTimeRangeResponse>(
        ANALYTICS_REVENUE_TIME_RANGE_ENDPOINT(
          params.startDate,
          params.endDate,
        ),
      );
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error(res.message || "Failed to fetch revenue time range stats");
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch revenue time range stats",
      );
    }
  },
);

export const fetchRevenuePeriodStats = createAsyncThunk(
  "analytics/fetchRevenuePeriodStats",
  async (params: PeriodParams, { rejectWithValue }) => {
    try {
      const res = await api.get<RevenuePeriodResponse>(
        ANALYTICS_REVENUE_PERIOD_ENDPOINT(params.year, params.groupBy),
      );
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error(res.message || "Failed to fetch revenue period stats");
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch revenue period stats",
      );
    }
  },
);

export const fetchRevenueYearStats = createAsyncThunk(
  "analytics/fetchRevenueYearStats",
  async (params: YearParams, { rejectWithValue }) => {
    try {
      const res = await api.get<RevenueYearResponse>(
        ANALYTICS_REVENUE_YEAR_ENDPOINT(params.startYear, params.endYear),
      );
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error(res.message || "Failed to fetch revenue year stats");
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch revenue year stats",
      );
    }
  },
);

// Plan Purchase Statistics Async Thunks
export const fetchPlansTimeRangeStats = createAsyncThunk(
  "analytics/fetchPlansTimeRangeStats",
  async (params: TimeRangeParams, { rejectWithValue }) => {
    try {
      const res = await api.get<PlansTimeRangeResponse>(
        ANALYTICS_PLANS_TIME_RANGE_ENDPOINT(
          params.startDate,
          params.endDate,
        ),
      );
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error(
        res.message || "Failed to fetch plans time range stats",
      );
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch plans time range stats",
      );
    }
  },
);

export const fetchPlansPeriodStats = createAsyncThunk(
  "analytics/fetchPlansPeriodStats",
  async (params: PeriodParams, { rejectWithValue }) => {
    try {
      const res = await api.get<PlansPeriodResponse>(
        ANALYTICS_PLANS_PERIOD_ENDPOINT(params.year, params.groupBy),
      );
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error(res.message || "Failed to fetch plans period stats");
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch plans period stats",
      );
    }
  },
);

export const fetchPlansYearStats = createAsyncThunk(
  "analytics/fetchPlansYearStats",
  async (params: YearParams, { rejectWithValue }) => {
    try {
      const res = await api.get<PlansYearResponse>(
        ANALYTICS_PLANS_YEAR_ENDPOINT(params.startYear, params.endYear),
      );
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error(res.message || "Failed to fetch plans year stats");
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch plans year stats",
      );
    }
  },
);

// Subscription Dashboard Async Thunk
export const fetchSubscriptionDashboard = createAsyncThunk(
  "analytics/fetchSubscriptionDashboard",
  async (params?: SubscriptionDashboardParams, { rejectWithValue }) => {
    try {
      const res = await api.get<SubscriptionDashboardResponse>(
        ANALYTICS_SUBSCRIPTION_DASHBOARD_ENDPOINT(params),
      );
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error(
        res.message || "Failed to fetch subscription dashboard",
      );
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch subscription dashboard",
      );
    }
  },
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
    resetAnalyticsState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // User Time Range Stats
      .addCase(fetchUserTimeRangeStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserTimeRangeStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userTimeRange = action.payload;
        state.error = null;
      })
      .addCase(fetchUserTimeRangeStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch user time range stats";
      })

      // User Period Stats
      .addCase(fetchUserPeriodStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPeriodStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userPeriod = action.payload;
        state.error = null;
      })
      .addCase(fetchUserPeriodStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch user period stats";
      })

      // User Year Stats
      .addCase(fetchUserYearStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserYearStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userYear = action.payload;
        state.error = null;
      })
      .addCase(fetchUserYearStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch user year stats";
      })

      // Revenue Time Range Stats
      .addCase(fetchRevenueTimeRangeStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRevenueTimeRangeStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.revenueTimeRange = action.payload;
        state.error = null;
      })
      .addCase(fetchRevenueTimeRangeStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch revenue time range stats";
      })

      // Revenue Period Stats
      .addCase(fetchRevenuePeriodStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRevenuePeriodStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.revenuePeriod = action.payload;
        state.error = null;
      })
      .addCase(fetchRevenuePeriodStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch revenue period stats";
      })

      // Revenue Year Stats
      .addCase(fetchRevenueYearStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRevenueYearStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.revenueYear = action.payload;
        state.error = null;
      })
      .addCase(fetchRevenueYearStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch revenue year stats";
      })

      // Plans Time Range Stats
      .addCase(fetchPlansTimeRangeStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlansTimeRangeStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plansTimeRange = action.payload;
        state.error = null;
      })
      .addCase(fetchPlansTimeRangeStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch plans time range stats";
      })

      // Plans Period Stats
      .addCase(fetchPlansPeriodStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlansPeriodStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plansPeriod = action.payload;
        state.error = null;
      })
      .addCase(fetchPlansPeriodStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch plans period stats";
      })

      // Plans Year Stats
      .addCase(fetchPlansYearStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlansYearStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plansYear = action.payload;
        state.error = null;
      })
      .addCase(fetchPlansYearStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch plans year stats";
      })

      // Subscription Dashboard
      .addCase(fetchSubscriptionDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptionDashboard = action.payload;
        state.error = null;
      })
      .addCase(fetchSubscriptionDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch subscription dashboard";
      });
  },
});

export const { clearAnalyticsError, resetAnalyticsState } = analyticsSlice.actions;
export default analyticsSlice.reducer;

