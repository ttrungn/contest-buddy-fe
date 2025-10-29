import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../constant/axiosInstance";
import { PLANS_ENDPOINT } from "../../constant/apiConfig";
import { Plan, PlansResponse, PlansState } from "@/interfaces/IPlan";

const initialState: PlansState = {
  plans: [],
  isLoading: false,
  error: null,
};

// Fetch all plans
export const fetchPlans = createAsyncThunk<
  Plan[],
  void,
  { rejectValue: string }
>("plans/fetchPlans", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<PlansResponse>(PLANS_ENDPOINT);
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || "Failed to get plans");
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || err?.message || "Failed to get plans",
    );
  }
});

// Create a new plan
export const createPlan = createAsyncThunk<
  Plan,
  Omit<Plan, "_id" | "id" | "created_at" | "updated_at" | "__v">,
  { rejectValue: string }
>("plans/createPlan", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post<{
      success: boolean;
      data: Plan;
      message?: string;
    }>(PLANS_ENDPOINT, payload);
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || "Failed to create plan");
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || err?.message || "Failed to create plan",
    );
  }
});

// Update an existing plan
export const updatePlan = createAsyncThunk<
  Plan,
  {
    id: string;
    data: Omit<Plan, "_id" | "id" | "created_at" | "updated_at" | "__v">;
  },
  { rejectValue: string }
>("plans/updatePlan", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put<{
      success: boolean;
      data: Plan;
      message?: string;
    }>(`${PLANS_ENDPOINT}/${id}`, data);
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || "Failed to update plan");
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || err?.message || "Failed to update plan",
    );
  }
});

// Delete a plan
export const deletePlan = createAsyncThunk<
  { id: string },
  { id: string },
  { rejectValue: string }
>("plans/deletePlan", async ({ id }, { rejectWithValue }) => {
  try {
    const res = await api.delete<{ success: boolean; message?: string }>(
      `${PLANS_ENDPOINT}/${id}`,
    );
    if (res.success) {
      return { id };
    }
    throw new Error(res.message || "Failed to delete plan");
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || err?.message || "Failed to delete plan",
    );
  }
});

const plansSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    clearPlansError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch plans
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload;
        state.error = null;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to get plans";
      })
      // Create plan
      .addCase(createPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans.unshift(action.payload);
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create plan";
      })
      // Update plan
      .addCase(updatePlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.plans.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          state.plans[idx] = action.payload;
        }
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update plan";
      })
      // Delete plan
      .addCase(deletePlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = state.plans.filter((p) => p.id !== action.payload.id);
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete plan";
      });
  },
});

export const { clearPlansError } = plansSlice.actions;
export default plansSlice.reducer;
