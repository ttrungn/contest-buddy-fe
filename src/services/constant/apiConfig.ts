export const BASE_URL =
  "https://contest-buddy-be-594444870778.asia-southeast1.run.app";

// Auth endpoints
export const LOGIN_ENDPOINT = `${BASE_URL}/api/auth/login`;
export const REGISTER_ENDPOINT = `${BASE_URL}/api/auth/register`;
export const REGISTER_ORGANIZER_ENDPOINT = `${BASE_URL}/api/auth/register/organizer`;
export const VERIFY_TOKEN_ENDPOINT = `${BASE_URL}/api/auth/verify-token`;
export const VERIFY_EMAIL_ENDPOINT = `${BASE_URL}/api/auth/verify-email`;
export const VERIFY_EMAIL_TOKEN_ENDPOINT = (token: string) =>
  `${BASE_URL}/api/auth/verify-email/${token}`;
export const RESEND_VERIFICATION_ENDPOINT = `${BASE_URL}/api/auth/resend-verification`;
export const FORGOT_PASSWORD_ENDPOINT = `${BASE_URL}/api/auth/forgot-password`;
export const RESET_PASSWORD_ENDPOINT = `${BASE_URL}/api/auth/reset-password`;
export const REFRESH_TOKEN_ENDPOINT = `${BASE_URL}/api/auth/refresh-token`;
export const CHANGE_PASSWORD_ENDPOINT = `${BASE_URL}/api/auth/change-password`;

// Customer profile endpoints
export const CUSTOMER_PROFILES_ENDPOINT = `${BASE_URL}/api/customers`;
export const CUSTOMER_PROFILE_ENDPOINT = `${BASE_URL}/api/customer/profile`;
export const CUSTOMER_DETAIL_ENDPOINT = (userId: string) => `${BASE_URL}/api/customer/${userId}`;
export const CUSTOMER_AVATAR_ENDPOINT = `${BASE_URL}/api/customer/avatar`;

// User skills endpoints
export const USER_SKILLS_ENDPOINT = `${BASE_URL}/api/user/skills`;
export const ALL_SKILLS_ENDPOINT = `${BASE_URL}/api/skills`;

// User portfolio projects endpoints
export const USER_PROJECTS_ENDPOINT = `${BASE_URL}/api/user/projects`;

// User achievements endpoints
export const USER_ACHIEVEMENTS_ENDPOINT = `${BASE_URL}/api/user/achievements`;
export const ACHIEVEMENT_DETAIL_ENDPOINT = (id: string) =>
  `${BASE_URL}/api/achievements/${id}`;

// Organizer endpoints
export const ORGANIZER_PROFILE_ENDPOINT = `${BASE_URL}/api/organizer/profile`;
export const ORGANIZER_AVATAR_ENDPOINT = `${BASE_URL}/api/organizer/avatar`;
export const ORGANIZER_COMPETITIONS_ENDPOINT = `${BASE_URL}/api/organizer/competitions`;

// Competition endpoints
export const COMPETITIONS_ENDPOINT = `${BASE_URL}/api/competitions`;
export const COMPETITIONS_FEATURED_ENDPOINT = `${BASE_URL}/api/competitions/featured`;
export const COMPETITIONS_BY_CATEGORY_ENDPOINT = (category: string) =>
  `${BASE_URL}/api/competitions/category/${category}`;
export const COMPETITIONS_BY_STATUS_ENDPOINT = (status: string) =>
  `${BASE_URL}/api/competitions/status/${status}`;
export const COMPETITION_DETAIL_ENDPOINT = (id: string) =>
  `${BASE_URL}/api/competitions/${id}`;
export const COMPETITION_PARTICIPANTS_ENDPOINT = (id: string) =>
  `${BASE_URL}/api/competitions/${id}/participants`;
export const COMPETITION_REGISTER_ENDPOINT = (id: string) =>
  `${BASE_URL}/api/competitions/${id}/register`;
export const COMPETITION_PARTICIPANTS_CHECK_ENDPOINT = (id: string) =>
  `${BASE_URL}/api/competitions/${id}/participants/check`;
export const COMPETITION_UPDATE_ENDPOINT = (id: string) =>
  `${BASE_URL}/api/competitions/${id}`;
export const COMPETITION_DELETE_ENDPOINT = (id: string) =>
  `${BASE_URL}/api/competitions/${id}`;

// User endpoints
export const USER_TEAMS_ENDPOINT = `${BASE_URL}/api/user/teams`;
export const USER_PARTICIPATED_COMPETITIONS_ENDPOINT = `${BASE_URL}/api/user/participated-competitions`;

// Team endpoints
export const TEAM_MEMBERS_ENDPOINT = (id: string) =>
  `${BASE_URL}/api/teams/${id}/members`;

// Teams API endpoints
export const TEAMS_ENDPOINT = `${BASE_URL}/api/teams`;
export const TEAM_BY_ID_ENDPOINT = (id: string) => `${BASE_URL}/api/teams/${id}`;
export const USER_INVITATIONS_ENDPOINT = `${BASE_URL}/api/user/invitations`;

// Team Invitations API endpoints
export const TEAM_INVITATIONS_ENDPOINT = `${BASE_URL}/api/team-invitations`;
export const TEAM_INVITATION_ACCEPT_ENDPOINT = (invitationId: string) => `${BASE_URL}/api/team-invitations/${invitationId}/accept`;
export const TEAM_INVITATION_REJECT_ENDPOINT = (invitationId: string) => `${BASE_URL}/api/team-invitations/${invitationId}/reject`;
export const TEAM_INVITATION_CANCEL_ENDPOINT = (invitationId: string) => `${BASE_URL}/api/team-invitations/${invitationId}/cancel`;

// Team Member Management API endpoints
export const TEAM_MEMBER_ROLE_ENDPOINT = (teamId: string, memberId: string) => `${BASE_URL}/api/teams/${teamId}/members/${memberId}/role`;
export const TEAM_MEMBER_DELETE_ENDPOINT = (teamId: string, memberId: string) => `${BASE_URL}/api/teams/${teamId}/members/${memberId}`;

// Plans
export const PLANS_ENDPOINT = `${BASE_URL}/api/plans`;
