import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/services/constant/axiosInstance";
import {
  COMPETITIONS_ENDPOINT,
  COMPETITIONS_FEATURED_ENDPOINT,
  COMPETITIONS_BY_CATEGORY_ENDPOINT,
  COMPETITIONS_BY_STATUS_ENDPOINT,
  COMPETITION_DETAIL_ENDPOINT,
  COMPETITION_PARTICIPANTS_ENDPOINT,
  COMPETITION_PARTICIPANTS_PAGINATED_ENDPOINT,
  ORGANIZER_COMPETITIONS_ENDPOINT,
} from "@/services/constant/apiConfig";
import {
  ApiStatusMessage,
  CompetitionDetail,
  CompetitionSummary,
  CreateCompetitionRequest,
  Pagination,
  UpdateCompetitionRequest,
} from "@/interfaces/ICompetition";

interface ListResponse<T> extends ApiStatusMessage<T[]> {
  pagination?: Pagination;
}

interface ParticipantsItem {
  _id: string;
  id: string;
  competition_id: string;
  user_id: string;
  team_id: string | null;
  registration_date: string;
  status: string;
  payment_status: string;
  submission_status: string;
  __v: number;
  user: {
    _id: string;
    id: string;
    username: string;
    full_name: string;
    email: string;
    bio: string;
    city: string;
    country: string;
    rating: number;
    avatar_url?: string;
  };
}

interface CompetitionsState {
  list: CompetitionSummary[];
  featured: CompetitionSummary[];
  detail: CompetitionDetail | null;
  participants: ParticipantsItem[];
  participantsPagination: Pagination | null;
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CompetitionsState = {
  list: [],
  featured: [],
  detail: null,
  participants: [],
  participantsPagination: null,
  pagination: null,
  isLoading: false,
  error: null,
};

// Create
export const createCompetition = createAsyncThunk<
  ApiStatusMessage<{ id: string; title: string; organizer_id: string }>,
  CreateCompetitionRequest,
  { rejectValue: string }
>("competitions/create", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post<
      ApiStatusMessage<{ id: string; title: string; organizer_id: string }>
    >(COMPETITIONS_ENDPOINT, payload);
    return res;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to create competition",
    );
  }
});

// Get lists
export const fetchCompetitions = createAsyncThunk<
  { data: CompetitionSummary[]; pagination?: Pagination },
  {
    page?: number;
    limit?: number;
    category?: string[];
    status?: string[];
    level?: string[];
    search?: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    isOnline?: boolean;
    prizePool?: boolean;
    featured?: boolean;
  },
  { rejectValue: string }
>("competitions/fetch", async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.search) query.set("search", params.search);
    if (params.location) query.set("location", params.location);
    if (params.start_date) query.set("start_date", params.start_date);
    if (params.end_date) query.set("end_date", params.end_date);
    if (params.isOnline !== undefined)
      query.set("isOnline", String(params.isOnline));
    if (params.prizePool !== undefined)
      query.set("prizePool", String(params.prizePool));
    if (params.featured) query.set("featured", "true");

    // Handle array parameters
    if (params.category?.length) {
      params.category.forEach((cat) => query.append("category", cat));
    }
    if (params.status?.length) {
      params.status.forEach((status) => query.append("status", status));
    }
    if (params.level?.length) {
      params.level.forEach((level) => query.append("level", level));
    }

    const url = `${COMPETITIONS_ENDPOINT}${query.toString() ? `?${query.toString()}` : ""}`;
    const res = await api.get<ListResponse<CompetitionSummary>>(url);
    return { data: res.data || [], pagination: res.pagination };
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to get competitions",
    );
  }
});

export const fetchFeaturedCompetitions = createAsyncThunk<
  { data: CompetitionSummary[]; pagination?: Pagination },
  { page?: number; limit?: number },
  { rejectValue: string }
>("competitions/fetchFeatured", async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const url = `${COMPETITIONS_FEATURED_ENDPOINT}${query.toString() ? `?${query.toString()}` : ""}`;
    const res = await api.get<ListResponse<CompetitionSummary>>(url);
    return { data: res.data || [], pagination: res.pagination };
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to get featured competitions",
    );
  }
});

export const fetchCompetitionsByCategory = createAsyncThunk<
  { data: CompetitionSummary[]; pagination?: Pagination },
  { category: string; page?: number; limit?: number },
  { rejectValue: string }
>(
  "competitions/fetchByCategory",
  async ({ category, page, limit }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (page) query.set("page", String(page));
      if (limit) query.set("limit", String(limit));
      const url = `${COMPETITIONS_BY_CATEGORY_ENDPOINT(category)}${query.toString() ? `?${query.toString()}` : ""}`;
      const res = await api.get<ListResponse<CompetitionSummary>>(url);
      return { data: res.data || [], pagination: res.pagination };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to get competitions by category",
      );
    }
  },
);

export const fetchCompetitionsByStatus = createAsyncThunk<
  { data: CompetitionSummary[]; pagination?: Pagination },
  { status: string; page?: number; limit?: number },
  { rejectValue: string }
>(
  "competitions/fetchByStatus",
  async ({ status, page, limit }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (page) query.set("page", String(page));
      if (limit) query.set("limit", String(limit));
      const url = `${COMPETITIONS_BY_STATUS_ENDPOINT(status)}${query.toString() ? `?${query.toString()}` : ""}`;
      const res = await api.get<ListResponse<CompetitionSummary>>(url);
      return { data: res.data || [], pagination: res.pagination };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to get competitions by status",
      );
    }
  },
);

export const fetchOrganizerCompetitions = createAsyncThunk<
  { data: CompetitionSummary[]; pagination?: Pagination },
  { page?: number; limit?: number },
  { rejectValue: string }
>("competitions/fetchOrganizer", async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const url = `${ORGANIZER_COMPETITIONS_ENDPOINT}${query.toString() ? `?${query.toString()}` : ""}`;
    const res = await api.get<ListResponse<CompetitionSummary>>(url);
    return { data: res.data || [], pagination: res.pagination };
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to get organizer competitions",
    );
  }
});

// Detail and participants
export const fetchCompetitionDetail = createAsyncThunk<
  CompetitionDetail,
  string,
  { rejectValue: string }
>("competitions/fetchDetail", async (id, { rejectWithValue }) => {
  try {
    const res = await api.get<ApiStatusMessage<any>>(
      COMPETITION_DETAIL_ENDPOINT(id),
    );
    if (res.status !== "success" || !res.data)
      throw new Error(res.message || "Failed to get competition");
    const d: any = res.data;
    // Normalize snake_case -> camelCase for UI
    const normalized: CompetitionDetail = {
      id: d.id,
      title: d.title,
      organizer_id: d.organizer_id,
      category: d.category,
      status: d.status,
      featured: d.featured,
      description: d.description,
      startDate: d.start_date,
      endDate: d.end_date,
      registrationDeadline: d.registration_deadline,
      location: d.location,
      prizePool: d.prize_pool_text,
      participants: d.participants_count,
      maxParticipants: d.max_participants,
      level: d.level,
      imageUrl: d.image_url,
      website: d.website,
      rules: d.rules,
      tags: d.competitionTags || [],
      requiredSkills: d.competitionRequiredSkills || [],
      isRegisteredAsTeam: d.isRegisteredAsTeam,
      maxParticipantsPerTeam: d.maxParticipantsPerTeam,
      organizer: {
        email: d.organizer?.email,
        website: d.organizer?.website,
      },
    };
    return normalized;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to get competition",
    );
  }
});

export const fetchCompetitionParticipants = createAsyncThunk<
  { data: ParticipantsItem[]; pagination?: Pagination },
  { id: string; page?: number; limit?: number },
  { rejectValue: string }
>(
  "competitions/fetchParticipants",
  async ({ id, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const url = COMPETITION_PARTICIPANTS_PAGINATED_ENDPOINT(id, page, limit);
      const res = await api.get<ListResponse<ParticipantsItem>>(url);
      return { data: res.data || [], pagination: res.pagination };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to get competition participants",
      );
    }
  },
);

// Update
export const updateCompetition = createAsyncThunk<
  ApiStatusMessage<{ id: string; title: string }>,
  { id: string; data: UpdateCompetitionRequest },
  { rejectValue: string }
>("competitions/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put<ApiStatusMessage<{ id: string; title: string }>>(
      COMPETITION_DETAIL_ENDPOINT(id),
      data,
    );
    return res;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to update competition",
    );
  }
});

// Delete
export const deleteCompetition = createAsyncThunk<
  ApiStatusMessage<unknown>,
  string,
  { rejectValue: string }
>("competitions/delete", async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete<ApiStatusMessage<unknown>>(
      COMPETITION_DETAIL_ENDPOINT(id),
    );
    return res;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to delete competition",
    );
  }
});

const competitionsSlice = createSlice({
  name: "competitions",
  initialState,
  reducers: {
    clearCompetitionsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompetitions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompetitions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchCompetitions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to get competitions";
      })
      .addCase(fetchFeaturedCompetitions.fulfilled, (state, action) => {
        state.featured = action.payload.data;
      })
      .addCase(fetchCompetitionsByCategory.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchCompetitionsByStatus.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchOrganizerCompetitions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizerCompetitions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchOrganizerCompetitions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to get organizer competitions";
      })
      .addCase(fetchCompetitionDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.detail = null;
      })
      .addCase(
        fetchCompetitionDetail.fulfilled,
        (state, action: PayloadAction<CompetitionDetail>) => {
          state.isLoading = false;
          state.detail = action.payload;
        },
      )
      .addCase(fetchCompetitionDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to get competition";
      })
      .addCase(fetchCompetitionParticipants.fulfilled, (state, action) => {
        state.participants = action.payload.data;
        state.participantsPagination = action.payload.pagination || null;
      })
      .addCase(createCompetition.rejected, (state, action) => {
        state.error = action.payload || "Failed to create competition";
      })
      .addCase(updateCompetition.fulfilled, (state, action) => {
        // Update the competition in the list if it exists
        const updatedCompetition = action.payload.data;
        if (updatedCompetition) {
          const index = state.list.findIndex(
            (comp) => comp.id === updatedCompetition.id,
          );
          if (index !== -1) {
            state.list[index] = {
              ...state.list[index],
              title: updatedCompetition.title,
            };
          }
          // Also update detail if it's the same competition
          if (state.detail?.id === updatedCompetition.id) {
            state.detail = { ...state.detail, title: updatedCompetition.title };
          }
        }
      })
      .addCase(updateCompetition.rejected, (state, action) => {
        state.error = action.payload || "Failed to update competition";
      })
      .addCase(deleteCompetition.fulfilled, (state, action) => {
        // Remove the competition from the list
        const deletedId = action.meta.arg;
        state.list = state.list.filter((comp) => comp.id !== deletedId);
        // Clear detail if it's the deleted competition
        if (state.detail?.id === deletedId) {
          state.detail = null;
        }
      })
      .addCase(deleteCompetition.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete competition";
      });
  },
});

export const { clearCompetitionsError } = competitionsSlice.actions;
export default competitionsSlice.reducer;
