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
      });
  },
});

export const { clearPlansError } = plansSlice.actions;
export default plansSlice.reducer;
