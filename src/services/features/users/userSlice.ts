import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/services/constant/axiosInstance";
import {
  CUSTOMER_PROFILE_ENDPOINT,
  CUSTOMER_AVATAR_ENDPOINT,
} from "@/services/constant/apiConfig";
import {
  CustomerProfile,
  CustomerProfileResponse,
  UpdateCustomerProfileRequest,
  UpdateCustomerProfileResponse,
} from "@/interfaces/IUser";

interface UserState {
  profile: CustomerProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const fetchCustomerProfile = createAsyncThunk<
  CustomerProfile,
  void,
  { rejectValue: string }
>("user/fetchCustomerProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<CustomerProfileResponse>(
      CUSTOMER_PROFILE_ENDPOINT,
    );
    if (res.success && res.profile) return res.profile;
    return rejectWithValue("Không lấy được hồ sơ khách hàng");
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Lỗi tải hồ sơ";
    return rejectWithValue(message);
  }
});

export const updateCustomerProfile = createAsyncThunk<
  UpdateCustomerProfileResponse,
  UpdateCustomerProfileRequest,
  { rejectValue: string }
>("user/updateCustomerProfile", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.put<UpdateCustomerProfileResponse>(
      CUSTOMER_PROFILE_ENDPOINT,
      payload,
    );
    return res;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Cập nhật hồ sơ thất bại";
    return rejectWithValue(message);
  }
});

export const uploadCustomerAvatar = createAsyncThunk<
  { success: boolean; avatarUrl?: string; message?: string },
  File,
  { rejectValue: string }
>("user/uploadCustomerAvatar", async (file, { rejectWithValue }) => {
  try {
    const form = new FormData();
    form.append("avatar", file);
    const res = await api.upload<{
      success: boolean;
      avatarUrl?: string;
      message?: string;
    }>(CUSTOMER_AVATAR_ENDPOINT, form);
    return res;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Tải ảnh đại diện thất bại";
    return rejectWithValue(message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLocalProfile(state, action: PayloadAction<CustomerProfile>) {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchCustomerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Lỗi tải hồ sơ";
      })
      .addCase(updateCustomerProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCustomerProfile.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCustomerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Cập nhật hồ sơ thất bại";
      })
      .addCase(uploadCustomerAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadCustomerAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.profile) {
          const newUrl =
            action.payload.avatarUrl ||
            state.profile.avatarUrl ||
            state.profile.avatar_url;
          state.profile = {
            ...state.profile,
            avatarUrl: newUrl,
            avatar_url: newUrl,
          };
        }
      })
      .addCase(uploadCustomerAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Tải ảnh đại diện thất bại";
      });
  },
});

export const { setLocalProfile } = userSlice.actions;
export default userSlice.reducer;
