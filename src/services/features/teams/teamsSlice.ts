import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../constant/axiosInstance';
import {
  Team,
  TeamMember,
  TeamInvitation,
  CreateTeamRequest,
  UpdateTeamRequest,
  CreateTeamResponse,
  GetTeamsResponse,
  GetTeamResponse,
  UpdateTeamResponse,
  GetTeamMembersResponse,
  GetInvitationsResponse,
  TeamsState,
  SendTeamInvitationRequest,
  TeamInvitationResponse,
  ChangeMemberRoleRequest,
  RemoveMemberResponse
} from '@/interfaces/ITeam';
import {
  TEAMS_ENDPOINT,
  TEAM_BY_ID_ENDPOINT,
  USER_TEAMS_ENDPOINT,
  TEAM_MEMBERS_ENDPOINT,
  USER_INVITATIONS_ENDPOINT,
  TEAM_INVITATIONS_ENDPOINT,
  TEAM_INVITATION_ACCEPT_ENDPOINT,
  TEAM_INVITATION_REJECT_ENDPOINT,
  TEAM_INVITATION_CANCEL_ENDPOINT,
  TEAM_MEMBER_ROLE_ENDPOINT,
  TEAM_MEMBER_DELETE_ENDPOINT
} from '../../constant/apiConfig';

// Async thunks
export const createTeam = createAsyncThunk(
  'teams/createTeam',
  async (teamData: CreateTeamRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<CreateTeamResponse>(TEAMS_ENDPOINT, teamData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create team');
    }
  }
);

export const getUserTeams = createAsyncThunk(
  'teams/getUserTeams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetTeamsResponse>(USER_TEAMS_ENDPOINT);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teams');
    }
  }
);

export const getTeamById = createAsyncThunk(
  'teams/getTeamById',
  async (teamId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetTeamResponse>(TEAM_BY_ID_ENDPOINT(teamId));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch team');
    }
  }
);

export const updateTeam = createAsyncThunk(
  'teams/updateTeam',
  async ({ teamId, teamData }: { teamId: string; teamData: UpdateTeamRequest }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<UpdateTeamResponse>(TEAM_BY_ID_ENDPOINT(teamId), teamData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update team');
    }
  }
);

export const getTeamMembers = createAsyncThunk(
  'teams/getTeamMembers',
  async (teamId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetTeamMembersResponse>(TEAM_MEMBERS_ENDPOINT(teamId));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch team members');
    }
  }
);

export const getUserInvitations = createAsyncThunk(
  'teams/getUserInvitations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetInvitationsResponse>(USER_INVITATIONS_ENDPOINT);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invitations');
    }
  }
);

// Send team invitation
export const sendTeamInvitation = createAsyncThunk(
  'teams/sendTeamInvitation',
  async (invitationData: SendTeamInvitationRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<TeamInvitationResponse>(TEAM_INVITATIONS_ENDPOINT, invitationData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send invitation');
    }
  }
);

// Accept team invitation
export const acceptTeamInvitation = createAsyncThunk(
  'teams/acceptTeamInvitation',
  async (invitationId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(TEAM_INVITATION_ACCEPT_ENDPOINT(invitationId));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept invitation');
    }
  }
);

// Reject team invitation
export const rejectTeamInvitation = createAsyncThunk(
  'teams/rejectTeamInvitation',
  async (invitationId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(TEAM_INVITATION_REJECT_ENDPOINT(invitationId));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject invitation');
    }
  }
);

// Cancel team invitation
export const cancelTeamInvitation = createAsyncThunk(
  'teams/cancelTeamInvitation',
  async (invitationId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(TEAM_INVITATION_CANCEL_ENDPOINT(invitationId));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel invitation');
    }
  }
);

// Change member role
export const changeMemberRole = createAsyncThunk(
  'teams/changeMemberRole',
  async ({ teamId, memberId, roleData }: { teamId: string; memberId: string; roleData: ChangeMemberRoleRequest }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(TEAM_MEMBER_ROLE_ENDPOINT(teamId, memberId), roleData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change member role');
    }
  }
);

// Remove team member
export const removeTeamMember = createAsyncThunk(
  'teams/removeTeamMember',
  async ({ teamId, memberId }: { teamId: string; memberId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(TEAM_MEMBER_DELETE_ENDPOINT(teamId, memberId));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove team member');
    }
  }
);

// Delete team
export const deleteTeam = createAsyncThunk(
  'teams/deleteTeam',
  async (teamId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(TEAM_BY_ID_ENDPOINT(teamId));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete team');
    }
  }
);

const initialState: TeamsState = {
  teams: [],
  currentTeam: null,
  teamMembers: [],
  invitations: [],
  isLoading: false,
  error: null,
};

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    clearTeamsError: (state) => {
      state.error = null;
    },
    setCurrentTeam: (state, action: PayloadAction<Team | null>) => {
      state.currentTeam = action.payload;
    },
    clearCurrentTeam: (state) => {
      state.currentTeam = null;
    },
    clearTeamMembers: (state) => {
      state.teamMembers = [];
    },
    clearInvitations: (state) => {
      state.invitations = [];
    },
  },
  extraReducers: (builder) => {
    // Create Team
    builder
      .addCase(createTeam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams.push(action.payload.data);
        state.error = null;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get User Teams
    builder
      .addCase(getUserTeams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserTeams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams = action.payload.data;
        state.error = null;
      })
      .addCase(getUserTeams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Team By ID
    builder
      .addCase(getTeamById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTeamById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTeam = action.payload.data;
        state.error = null;
      })
      .addCase(getTeamById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Team
    builder
      .addCase(updateTeam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedTeam = action.payload.data;
        const index = state.teams.findIndex(team => team.id === updatedTeam.id);
        if (index !== -1) {
          state.teams[index] = updatedTeam;
        }
        if (state.currentTeam?.id === updatedTeam.id) {
          state.currentTeam = updatedTeam;
        }
        state.error = null;
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Team Members
    builder
      .addCase(getTeamMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTeamMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teamMembers = action.payload.data;
        state.error = null;
      })
      .addCase(getTeamMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get User Invitations
    builder
      .addCase(getUserInvitations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserInvitations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invitations = action.payload.data;
        state.error = null;
      })
      .addCase(getUserInvitations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Send Team Invitation
    builder
      .addCase(sendTeamInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendTeamInvitation.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sendTeamInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Accept Team Invitation
    builder
      .addCase(acceptTeamInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptTeamInvitation.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // Refresh teams and invitations after accepting
      })
      .addCase(acceptTeamInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Reject Team Invitation
    builder
      .addCase(rejectTeamInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectTeamInvitation.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(rejectTeamInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Cancel Team Invitation
    builder
      .addCase(cancelTeamInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelTeamInvitation.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(cancelTeamInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Change Member Role
    builder
      .addCase(changeMemberRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeMemberRole.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // Refresh team members after role change
      })
      .addCase(changeMemberRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Remove Team Member
    builder
      .addCase(removeTeamMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Remove member from teamMembers array
        const memberId = action.meta.arg.memberId;
        state.teamMembers = state.teamMembers.filter(member => member.user.id !== memberId);
      })
      .addCase(removeTeamMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Team
    builder
      .addCase(deleteTeam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTeam.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // Remove team from teams list
        state.teams = state.teams.filter(team => team.id !== state.currentTeam?.id);
        state.currentTeam = null;
        state.teamMembers = [];
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearTeamsError,
  setCurrentTeam,
  clearCurrentTeam,
  clearTeamMembers,
  clearInvitations,
} = teamsSlice.actions;

export default teamsSlice.reducer;
