import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../constant/axiosInstance";
import { COMPETITION_PAYMENT_ENDPOINT } from "../../constant/apiConfig";
import {
  CompetitionPaymentRequest,
  CompetitionPaymentResponse,
  CompetitionPaymentStatus,
} from "@/types";

interface PaymentState {
  paymentUrl: string | null;
  paymentData: CompetitionPaymentResponse["data"]["order"]["result"] | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  paymentUrl: null,
  paymentData: null,
  isLoading: false,
  error: null,
};

// Async thunk for creating competition payment
export const createCompetitionPayment = createAsyncThunk(
  "payment/createCompetitionPayment",
  async (request: CompetitionPaymentRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<CompetitionPaymentResponse>(
        COMPETITION_PAYMENT_ENDPOINT,
        request,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Tạo link thanh toán thất bại",
      );
    }
  },
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentData: (state) => {
      state.paymentUrl = null;
      state.paymentData = null;
      state.error = null;
    },
    clearPaymentError: (state) => {
      state.error = null;
    },
    setPaymentUrl: (state, action: PayloadAction<string>) => {
      state.paymentUrl = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create competition payment
      .addCase(createCompetitionPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCompetitionPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentData = action.payload.data.order.result;
        state.paymentUrl = action.payload.data.order.result.checkoutUrl;
        state.error = null;
      })
      .addCase(createCompetitionPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.paymentUrl = null;
        state.paymentData = null;
      });
  },
});

export const { clearPaymentData, clearPaymentError, setPaymentUrl } =
  paymentSlice.actions;
export default paymentSlice.reducer;
