import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/services/constant/axiosInstance";
import {
  CUSTOMER_PROFILE_ENDPOINT,
  CUSTOMER_AVATAR_ENDPOINT,
  USER_SKILLS_ENDPOINT,
  ALL_SKILLS_ENDPOINT,
  USER_PROJECTS_ENDPOINT,
  USER_ACHIEVEMENTS_ENDPOINT,
  ACHIEVEMENT_DETAIL_ENDPOINT,
} from "@/services/constant/apiConfig";
import {
  CustomerProfile,
  CustomerProfileResponse,
  UpdateCustomerProfileRequest,
  UpdateCustomerProfileResponse,
} from "@/interfaces/IUser";

export interface UserSkill {
  _id: string;
  user_id: string;
  skill_name: string;
  category: string;
  level: string;
  experience_years: number;
}

export interface AllSkill {
  _id: string;
  name: string;
  category: string;
}

export interface SkillResponse {
  success: boolean;
  skills: UserSkill[];
}

export interface AllSkillsResponse {
  success: boolean;
  skills: AllSkill[];
}

export interface AddSkillRequest {
  skill_name: string;
  category: string;
  level: string;
  experience_years: number;
}

export interface AddSkillResponse {
  success: boolean;
  message: string;
  skill: UserSkill;
}

export interface UpdateSkillRequest {
  skillId: string;
  data: {
    level: string;
    experience_years: number;
  };
}

export interface UpdateSkillResponse {
  success: boolean;
  message: string;
  skill: UserSkill;
}

interface UserState {
  profile: CustomerProfile | null;
  userSkills: UserSkill[];
  allSkills: AllSkill[];
  projects: UserProject[];
  achievements: UserAchievement[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  userSkills: [],
  allSkills: [],
  projects: [],
  achievements: [],
  isLoading: false,
  error: null,
};

// ===== Portfolio Projects =====
export interface UserProject {
  _id: string;
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image_url: string | null;
  project_url?: string;
  github_url?: string;
  created_at: string;
}

export interface UserProjectsResponse {
  success: boolean;
  projects: UserProject[];
}

export interface AddProjectResponse {
  success: boolean;
  message: string;
  project: UserProject;
}

export interface UpdateProjectResponse {
  success: boolean;
  message: string;
  project: UserProject;
}

// ===== Achievements =====
export interface UserAchievement {
  _id: string;
  id: string;
  user_id: string;
  competition_name: string;
  position: number;
  award: string;
  achieved_at: string; // ISO string
  category: string;
  description?: string;
}

export interface AchievementsResponse {
  success: boolean;
  achievements: UserAchievement[];
}

export interface AchievementResponse {
  success: boolean;
  message?: string;
  achievement: UserAchievement;
}

export interface CreateAchievementRequest {
  competition_name: string;
  position: number;
  award: string;
  achieved_at: string; // YYYY-MM-DD
  category: string;
  description?: string;
}

export interface UpdateAchievementRequest {
  id: string; // id (not _id)
  data: Partial<
    Pick<
      CreateAchievementRequest,
      | "competition_name"
      | "position"
      | "award"
      | "achieved_at"
      | "category"
      | "description"
    >
  >;
}

export const fetchUserProjects = createAsyncThunk<
  UserProject[],
  void,
  { rejectValue: string }
>("user/fetchUserProjects", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<UserProjectsResponse>(USER_PROJECTS_ENDPOINT);
    return res.projects || [];
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Lỗi tải danh sách dự án",
    );
  }
});

export const addUserProject = createAsyncThunk<
  UserProject,
  FormData,
  { rejectValue: string }
>("user/addUserProject", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.upload<AddProjectResponse>(
      USER_PROJECTS_ENDPOINT,
      formData,
    );
    return res.project;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Thêm dự án thất bại",
    );
  }
});

export const updateUserProject = createAsyncThunk<
  UserProject,
  { projectId: string; data: FormData },
  { rejectValue: string }
>("user/updateUserProject", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.uploadPut<UpdateProjectResponse>(
      `${USER_PROJECTS_ENDPOINT}/${payload.projectId}`,
      payload.data,
    );
    return res.project;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Cập nhật dự án thất bại",
    );
  }
});

// ===== Achievements thunks =====
export const fetchUserAchievements = createAsyncThunk<
  UserAchievement[],
  void,
  { rejectValue: string }
>("user/fetchUserAchievements", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<AchievementsResponse>(USER_ACHIEVEMENTS_ENDPOINT);
    return res.achievements || [];
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Lỗi tải danh sách thành tích",
    );
  }
});

export const addUserAchievement = createAsyncThunk<
  UserAchievement,
  CreateAchievementRequest,
  { rejectValue: string }
>("user/addUserAchievement", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post<AchievementResponse>(
      USER_ACHIEVEMENTS_ENDPOINT,
      payload,
    );
    return res.achievement;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Thêm thành tích thất bại",
    );
  }
});

export const updateUserAchievement = createAsyncThunk<
  UserAchievement,
  UpdateAchievementRequest,
  { rejectValue: string }
>("user/updateUserAchievement", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put<AchievementResponse>(
      `${USER_ACHIEVEMENTS_ENDPOINT}/${id}`,
      data,
    );
    return res.achievement;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Cập nhật thành tích thất bại",
    );
  }
});

export const deleteUserAchievement = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("user/deleteUserAchievement", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`${USER_ACHIEVEMENTS_ENDPOINT}/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Xóa thành tích thất bại",
    );
  }
});

export const fetchAchievementDetail = createAsyncThunk<
  UserAchievement,
  string,
  { rejectValue: string }
>("user/fetchAchievementDetail", async (id, { rejectWithValue }) => {
  try {
    const res = await api.get<AchievementResponse>(
      ACHIEVEMENT_DETAIL_ENDPOINT(id),
    );
    return res.achievement;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Lỗi tải chi tiết thành tích",
    );
  }
});

export const deleteUserProject = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("user/deleteUserProject", async (projectId, { rejectWithValue }) => {
  try {
    await api.delete(`${USER_PROJECTS_ENDPOINT}/${projectId}`);
    return projectId;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Xóa dự án thất bại");
  }
});

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

// Skill management async thunks
export const fetchUserSkills = createAsyncThunk<
  UserSkill[],
  void,
  { rejectValue: string }
>("user/fetchUserSkills", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<SkillResponse>(USER_SKILLS_ENDPOINT);
    if (res.success && res.skills) return res.skills;
    return rejectWithValue("Không lấy được danh sách kỹ năng");
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Lỗi tải danh sách kỹ năng";
    return rejectWithValue(message);
  }
});

export const fetchAllSkills = createAsyncThunk<
  AllSkill[],
  void,
  { rejectValue: string }
>("user/fetchAllSkills", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<AllSkillsResponse>(ALL_SKILLS_ENDPOINT);
    if (res.success && res.skills) return res.skills;
    return rejectWithValue("Không lấy được danh sách tất cả kỹ năng");
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Lỗi tải danh sách kỹ năng";
    return rejectWithValue(message);
  }
});

export const addUserSkill = createAsyncThunk<
  UserSkill,
  AddSkillRequest,
  { rejectValue: string }
>("user/addUserSkill", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post<AddSkillResponse>(USER_SKILLS_ENDPOINT, payload);
    if (res.success && res.skill) return res.skill;
    return rejectWithValue("Thêm kỹ năng thất bại");
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Thêm kỹ năng thất bại";
    return rejectWithValue(message);
  }
});

export const updateUserSkill = createAsyncThunk<
  UserSkill,
  UpdateSkillRequest,
  { rejectValue: string }
>("user/updateUserSkill", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.put(
      `${USER_SKILLS_ENDPOINT}/${payload.skillId}`,
      payload.data,
    );
    // API trả về { message, skill } không có success field
    if (response && response.skill) {
      return response.skill;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update skill",
    );
  }
});

export const deleteUserSkill = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("user/deleteUserSkill", async (skillId, { rejectWithValue }) => {
  try {
    const res = await api.delete<{ success: boolean; message: string }>(
      `${USER_SKILLS_ENDPOINT}/${skillId}`,
    );
    if (res.success) return skillId;
    return rejectWithValue("Xóa kỹ năng thất bại");
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Xóa kỹ năng thất bại";
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
    clearUserSkills(state) {
      state.userSkills = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // User profile
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
      })
      // User skills reducers
      .addCase(fetchUserSkills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserSkills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userSkills = action.payload;
      })
      .addCase(fetchUserSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Lỗi tải danh sách kỹ năng";
      })
      .addCase(fetchAllSkills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllSkills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allSkills = action.payload;
      })
      .addCase(fetchAllSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Lỗi tải danh sách kỹ năng";
      })
      .addCase(addUserSkill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addUserSkill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userSkills.push(action.payload);
      })
      .addCase(addUserSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Thêm kỹ năng thất bại";
      })
      // Projects
      .addCase(fetchUserProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchUserProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Lỗi tải danh sách dự án";
      })
      .addCase(addUserProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addUserProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.unshift(action.payload);
      })
      .addCase(addUserProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Thêm dự án thất bại";
      })
      // Achievements
      .addCase(fetchUserAchievements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserAchievements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.achievements = action.payload;
      })
      .addCase(fetchUserAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Lỗi tải danh sách thành tích";
      })
      .addCase(addUserAchievement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addUserAchievement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.achievements.unshift(action.payload);
      })
      .addCase(addUserAchievement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Thêm thành tích thất bại";
      })
      .addCase(updateUserAchievement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserAchievement.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.achievements.findIndex(
          (a) => a.id === action.payload.id,
        );
        if (idx !== -1) state.achievements[idx] = action.payload;
      })
      .addCase(updateUserAchievement.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Cập nhật thành tích thất bại";
      })
      .addCase(deleteUserAchievement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserAchievement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.achievements = state.achievements.filter(
          (a) => a.id !== action.payload,
        );
      })
      .addCase(deleteUserAchievement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Xóa thành tích thất bại";
      })
      .addCase(updateUserProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.projects.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.projects[idx] = action.payload;
      })
      .addCase(updateUserProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Cập nhật dự án thất bại";
      })
      .addCase(deleteUserProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteUserProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Xóa dự án thất bại";
      })
      .addCase(updateUserSkill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserSkill.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.userSkills.findIndex(
          (skill) => skill._id === action.payload._id,
        );
        if (index !== -1) {
          state.userSkills[index] = action.payload;
        }
      })
      .addCase(updateUserSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Cập nhật kỹ năng thất bại";
      })
      .addCase(deleteUserSkill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserSkill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userSkills = state.userSkills.filter(
          (skill) => skill._id !== action.payload,
        );
      })
      .addCase(deleteUserSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Xóa kỹ năng thất bại";
      });
  },
});

export const { setLocalProfile, clearUserSkills } = userSlice.actions;
export default userSlice.reducer;
