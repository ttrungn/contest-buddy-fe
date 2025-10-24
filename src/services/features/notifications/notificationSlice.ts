import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../constant/axiosInstance";
import {
  NotificationSettings,
  NotificationSettingsResponse,
  UpdateNotificationSettingsRequest,
  UpdateNotificationSettingsResponse,
  NotificationState,
} from "../../../interfaces/INotification";
import { NOTIFICATION_SETTINGS_ENDPOINT } from "../../constant/apiConfig";

// Async thunks
export const fetchNotificationSettings = createAsyncThunk(
  "notifications/fetchNotificationSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<NotificationSettingsResponse>(
        NOTIFICATION_SETTINGS_ENDPOINT,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch notification settings",
      );
    }
  },
);

export const updateNotificationSettings = createAsyncThunk(
  "notifications/updateNotificationSettings",
  async (settings: UpdateNotificationSettingsRequest, { rejectWithValue }) => {
    try {
      const response =
        await axiosInstance.put<UpdateNotificationSettingsResponse>(
          NOTIFICATION_SETTINGS_ENDPOINT,
          settings,
        );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update notification settings",
      );
    }
  },
);

// Initial state
const initialState: NotificationState = {
  settings: null,
  isLoading: false,
  error: null,
  isUpdating: false,
};

// Notification slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },
    setNotificationLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch notification settings
    builder
      .addCase(fetchNotificationSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = action.payload.data;
        state.error = null;
      })
      .addCase(fetchNotificationSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update notification settings
    builder
      .addCase(updateNotificationSettings.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.settings = action.payload.data;
        state.error = null;
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearNotificationError, setNotificationLoading } =
  notificationSlice.actions;

// Export reducer
export default notificationSlice.reducer;

// Selectors
export const selectNotificationSettings = (state: any) =>
  state.notifications?.settings || null;
export const selectNotificationLoading = (state: any) =>
  state.notifications?.isLoading || false;
export const selectNotificationError = (state: any) =>
  state.notifications?.error || null;
export const selectNotificationUpdating = (state: any) =>
  state.notifications?.isUpdating || false;
