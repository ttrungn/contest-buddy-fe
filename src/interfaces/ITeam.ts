// Team interfaces
export interface Team {
  _id: string;
  id: string;
  name: string;
  description: string;
  avatar_url: string | null;
  leader_id: string;
  competition_id: string | null;
  max_members: number;
  created_at: string;
  updated_at: string;
  status: TeamStatus;
  __v: number;
}

export interface TeamMember {
  _id: string;
  id: string;
  team_id: string;
  role: TeamRole;
  joined_at: string;
  status: MemberStatus;
  __v: number;
  user: {
    _id: string;
    id: string;
    username: string;
    password: string;
    full_name: string;
    email: string;
    bio: string;
    school: string;
    city: string;
    region: string;
    country: string;
    study_field: string;
    join_date: string;
    is_verified: boolean;
    rating: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    refresh_token: string;
    avatar_url?: string;
  };
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  inviter_id: string;
  invitee_id: string;
  message: string;
  created_at: string;
  status: InvitationStatus;
  __v: number;
  inviter_username: string;
  inviter_full_name: string;
  inviter_avatar_url?: string;
  team_name: string;
}

// Request interfaces
export interface CreateTeamRequest {
  name: string;
  description: string;
  max_members: number;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  max_members?: number;
}

// Team Invitation interfaces
export interface SendTeamInvitationRequest {
  teamId: string;
  inviteeId: string;
  message: string;
}

export interface TeamInvitationResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    team_id: string;
    inviter_id: string;
    invitee_id: string;
    message: string;
    created_at: string;
    status: string;
  };
}

// Team Member Management interfaces
export interface ChangeMemberRoleRequest {
  role: TeamRole;
}

export interface RemoveMemberResponse {
  success: boolean;
  message: string;
}

// Response interfaces
export interface CreateTeamResponse {
  success: boolean;
  message: string;
  data: Team;
}

export interface GetTeamsResponse {
  success: boolean;
  data: Team[];
}

export interface GetTeamResponse {
  success: boolean;
  data: Team;
}

export interface UpdateTeamResponse {
  success: boolean;
  message: string;
  data: Team;
}

export interface GetTeamMembersResponse {
  success: boolean;
  data: TeamMember[];
}

export interface GetInvitationsResponse {
  success: boolean;
  data: TeamInvitation[];
}

// Enums
export type TeamStatus = "active" | "inactive" | "completed" | "disbanded";
export type TeamRole = "leader" | "co-leader" | "member";
export type MemberStatus = "active" | "inactive" | "left";
export type InvitationStatus = "pending" | "accepted" | "rejected" | "expired";

// State interface
export interface TeamsState {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: TeamMember[];
  invitations: TeamInvitation[];
  isLoading: boolean;
  error: string | null;
}
