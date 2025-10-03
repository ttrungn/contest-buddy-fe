import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/constant/axiosInstance";
import { CUSTOMER_PROFILES_ENDPOINT } from "@/services/constant/apiConfig";
import { CommunityUser, CommunityFilters } from "@/interfaces/ICommunity";
import { transformApiUserArrayToCommunityUsers } from "@/lib/formatters";

interface CommunityState {
  users: CommunityUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
  isLoading: boolean;
  error: string | null;
  currentFilters: CommunityFilters;
}

const initialState: CommunityState = {
  users: [],
  pagination: null,
  isLoading: false,
  error: null,
  currentFilters: {
    page: 1,
    limit: 12,
  },
};

// API response interface for community profiles
interface CommunityProfilesResponse {
  success: boolean;
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Async thunk to fetch all community user profiles with filters
export const fetchCommunityProfiles = createAsyncThunk<
  { users: CommunityUser[]; pagination: any },
  CommunityFilters,
  { rejectValue: string }
>("community/fetchCommunityProfiles", async (filters, { rejectWithValue }) => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    // Add pagination parameters
    queryParams.append('page', String(filters.page || 1));
    queryParams.append('limit', String(filters.limit || 12));
    
    // Add filter parameters if they exist
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.region) queryParams.append('region', filters.region);
    if (filters.country) queryParams.append('country', filters.country);
    if (filters.school) queryParams.append('school', filters.school);
    if (filters.study_field) queryParams.append('study_field', filters.study_field);
    if (filters.min_rating !== undefined) queryParams.append('min_rating', String(filters.min_rating));
    if (filters.max_rating !== undefined) queryParams.append('max_rating', String(filters.max_rating));
    if (filters.is_verified !== undefined) queryParams.append('is_verified', String(filters.is_verified));
    if (filters.join_date_from) queryParams.append('join_date_from', filters.join_date_from);
    if (filters.join_date_to) queryParams.append('join_date_to', filters.join_date_to);
    if (filters.skill_name) queryParams.append('skill_name', filters.skill_name);
    if (filters.skill_category) queryParams.append('skill_category', filters.skill_category);
    if (filters.skill_level) queryParams.append('skill_level', filters.skill_level);
    
    const response = await api.get<CommunityProfilesResponse>(
      `${CUSTOMER_PROFILES_ENDPOINT}?${queryParams.toString()}`
    );
    
    console.log("API Response:", response);
    
    // Check if response has data array (actual API structure)
    if (response && response.success && response.data && Array.isArray(response.data)) {
      // Transform the API response from snake_case to camelCase format
      const transformedUsers = transformApiUserArrayToCommunityUsers(response.data);
      return {
        users: transformedUsers,
        pagination: response.pagination
      };
    }
    
    // If response has success field but no data
    if (response && response.success === false) {
      return rejectWithValue("API trả về thất bại");
    }
    
    return rejectWithValue("Không tìm thấy danh sách hồ sơ trong response");
  } catch (error: any) {
    console.error("API Error:", error);
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      "Có lỗi xảy ra khi tải danh sách hồ sơ";
    return rejectWithValue(errorMessage);
  }
});

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    clearCommunityUsers: (state) => {
      state.users = [];
      state.pagination = null;
      state.error = null;
    },
    clearCommunityError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      if (state.pagination) {
        state.pagination.page = action.payload;
      }
      state.currentFilters.page = action.payload;
    },
    updateFilters: (state, action) => {
      state.currentFilters = { ...state.currentFilters, ...action.payload };
      // Reset to page 1 when filters change (except for page change)
      if (!action.payload.page) {
        state.currentFilters.page = 1;
      }
    },
    clearFilters: (state) => {
      state.currentFilters = {
        page: 1,
        limit: 20,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityProfiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCommunityProfiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchCommunityProfiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCommunityUsers, clearCommunityError, setCurrentPage, updateFilters, clearFilters } = communitySlice.actions;
export default communitySlice.reducer;
