import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/services/constant/axiosInstance";
import {
  ORGANIZER_PROFILE_ENDPOINT,
  ORGANIZER_AVATAR_ENDPOINT,
} from "@/services/constant/apiConfig";
import {
  OrganizerProfile,
  OrganizerProfileResponse,
  UpdateOrganizerProfileRequest,
  UpdateOrganizerProfileResponse,
  UploadOrganizerAvatarResponse,
} from "@/interfaces/IOrganizer";

interface OrganizerState {
  profile: OrganizerProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrganizerState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const fetchOrganizerProfile = createAsyncThunk<
  OrganizerProfile,
  void,
  { rejectValue: string }
>("organizer/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<OrganizerProfileResponse>(
      ORGANIZER_PROFILE_ENDPOINT,
    );
    return res.profile;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to load organizer profile";
    return rejectWithValue(message);
  }
});

export const updateOrganizerProfile = createAsyncThunk<
  UpdateOrganizerProfileResponse,
  UpdateOrganizerProfileRequest,
  { rejectValue: string }
>("organizer/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.put<UpdateOrganizerProfileResponse>(
      ORGANIZER_PROFILE_ENDPOINT,
      payload,
    );
    return res;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to update organizer profile";
    return rejectWithValue(message);
  }
});

export const uploadOrganizerAvatar = createAsyncThunk<
  UploadOrganizerAvatarResponse,
  File,
  { rejectValue: string }
>("organizer/uploadAvatar", async (file, { rejectWithValue }) => {
  try {
    const form = new FormData();
    form.append("avatar", file);
    const res = await api.upload<UploadOrganizerAvatarResponse>(
      ORGANIZER_AVATAR_ENDPOINT,
      form,
    );
    return res;
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err?.message || "Failed to upload avatar";
    return rejectWithValue(message);
  }
});

const organizerSlice = createSlice({
  name: "organizer",
  initialState,
  reducers: {
    setLocalOrganizerProfile(state, action: PayloadAction<OrganizerProfile>) {
      state.profile = action.payload;
    },
    clearOrganizerError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizerProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchOrganizerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load organizer profile";
      })
      .addCase(updateOrganizerProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrganizerProfile.fulfilled, (state, _action) => {
        state.isLoading = false;
        // Keep current profile; consumers may refetch or update local fields separately
      })
      .addCase(updateOrganizerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update organizer profile";
      })
      .addCase(uploadOrganizerAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadOrganizerAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.profile) {
          state.profile.avatar_url = action.payload.avatar_url;
        }
      })
      .addCase(uploadOrganizerAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to upload avatar";
      });
  },
});

export const { setLocalOrganizerProfile, clearOrganizerError } =
  organizerSlice.actions;
export default organizerSlice.reducer;
