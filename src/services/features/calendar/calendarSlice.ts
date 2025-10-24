import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../constant/axiosInstance";
import {
  CalendarEvent,
  ParticipatedCompetition,
  CalendarEventsResponse,
  ParticipatedCompetitionsResponse,
  CalendarFilters,
  CalendarState,
} from "../../../interfaces/ICalendar";
import { CALENDAR_EVENTS_ENDPOINT } from "../../constant/apiConfig";
import { USER_PARTICIPATED_COMPETITIONS_ENDPOINT } from "../../constant/apiConfig";

// Async thunks
export const fetchCalendarEvents = createAsyncThunk(
  "calendar/fetchCalendarEvents",
  async (filters: CalendarFilters = {}, { rejectWithValue }) => {
    try {
      const { from, to, type } = filters;
      const response = await axiosInstance.get<CalendarEventsResponse>(
        CALENDAR_EVENTS_ENDPOINT(from, to, type),
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch calendar events",
      );
    }
  },
);

export const fetchParticipatedCompetitions = createAsyncThunk(
  "calendar/fetchParticipatedCompetitions",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await axiosInstance.get<ParticipatedCompetitionsResponse>(
          USER_PARTICIPATED_COMPETITIONS_ENDPOINT,
        );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch participated competitions",
      );
    }
  },
);

// Initial state
const initialState: CalendarState = {
  events: [],
  participatedCompetitions: [],
  upcomingDeadlines: [],
  monthlyStats: null,
  isLoading: false,
  error: null,
  filters: {},
};

// Calendar slice
const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setCalendarFilters: (state, action: PayloadAction<CalendarFilters>) => {
      state.filters = action.payload;
    },
    clearCalendarEvents: (state) => {
      state.events = [];
      state.participatedCompetitions = [];
      state.upcomingDeadlines = [];
      state.monthlyStats = null;
    },
    clearCalendarError: (state) => {
      state.error = null;
    },
    setCalendarLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch calendar events
    builder
      .addCase(fetchCalendarEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.data;
        state.error = null;
      })
      .addCase(fetchCalendarEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch participated competitions
    builder
      .addCase(fetchParticipatedCompetitions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchParticipatedCompetitions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.participatedCompetitions = action.payload.data;
        state.upcomingDeadlines = action.payload.upcomingDeadlines.competitions;
        state.monthlyStats = action.payload.monthlyStats;
        state.error = null;
      })
      .addCase(fetchParticipatedCompetitions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setCalendarFilters,
  clearCalendarEvents,
  clearCalendarError,
  setCalendarLoading,
} = calendarSlice.actions;

// Export reducer
export default calendarSlice.reducer;

// Selectors
export const selectCalendarEvents = (state: any) =>
  state.calendar?.events || [];
export const selectParticipatedCompetitions = (state: any) =>
  state.calendar?.participatedCompetitions || [];
export const selectUpcomingDeadlines = (state: any) =>
  state.calendar?.upcomingDeadlines || [];
export const selectMonthlyStats = (state: any) =>
  state.calendar?.monthlyStats || null;
export const selectCalendarLoading = (state: any) =>
  state.calendar?.isLoading || false;
export const selectCalendarError = (state: any) =>
  state.calendar?.error || null;
export const selectCalendarFilters = (state: any) =>
  state.calendar?.filters || {};
