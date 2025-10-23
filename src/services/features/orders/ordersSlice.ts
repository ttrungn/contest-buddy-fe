import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Order,
  OrderDetail,
  CompetitionInfo,
  OrdersResponse,
  OrderDetailResponse,
  OrdersState,
} from "@/interfaces/IOrder";
import {
  ORDERS_ENDPOINT,
  ORDER_DETAIL_ENDPOINT,
} from "@/services/constant/apiConfig";
import axiosInstance from "@/services/constant/axiosInstance";

// Async thunks
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<OrdersResponse>(ORDERS_ENDPOINT);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

export const fetchOrderDetail = createAsyncThunk(
  "orders/fetchOrderDetail",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<OrderDetailResponse>(
        ORDER_DETAIL_ENDPOINT(orderId),
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order details",
      );
    }
  },
);

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  orderDetails: [],
  competitionInfo: null,
  isLoading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrdersError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.orderDetails = [];
      state.competitionInfo = null;
    },
    setCurrentOrder: (state, action: PayloadAction<Order>) => {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data.orders;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch order detail
      .addCase(fetchOrderDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.data.order;
        state.orderDetails = action.payload.data.orderDetails;
        state.competitionInfo = action.payload.data.additionalInfo.competition;
        state.error = null;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrdersError, clearCurrentOrder, setCurrentOrder } =
  ordersSlice.actions;
export default ordersSlice.reducer;
