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
export const CUSTOMER_DETAIL_ENDPOINT = (userId: string) =>
  `${BASE_URL}/api/customer/${userId}`;
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
export const COMPETITIONS_CONSTANTS_ENDPOINT = `${BASE_URL}/api/competitions/constants`;
export const COMPETITIONS_BY_CATEGORY_ENDPOINT = (category: string) =>
  `${BASE_URL}/api/competitions/category/${category}`;
export const COMPETITIONS_BY_STATUS_ENDPOINT = (status: string) =>
  `${BASE_URL}/api/competitions/status/${status}`;
export const COMPETITION_DETAIL_ENDPOINT = (id: string) =>
  `${BASE_URL}/api/competitions/${id}`;
export const COMPETITION_PARTICIPANTS_ENDPOINT = (id: string) =>
  `${BASE_URL}/api/competitions/${id}/participants`;
export const COMPETITION_PARTICIPANTS_PAGINATED_ENDPOINT = (
  id: string,
  page: number = 1,
  limit: number = 10,
) =>
  `${BASE_URL}/api/competitions/${id}/participants?page=${page}&limit=${limit}`;
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
export const TEAM_BY_ID_ENDPOINT = (id: string) =>
  `${BASE_URL}/api/teams/${id}`;
export const TEAM_LEAVE_ENDPOINT = (teamId: string, memberId: string) =>
  `${BASE_URL}/api/teams/${teamId}/members/${memberId}`;
export const USER_INVITATIONS_ENDPOINT = `${BASE_URL}/api/user/invitations`;

// Team Invitations API endpoints
export const TEAM_INVITATIONS_ENDPOINT = `${BASE_URL}/api/team-invitations`;
export const TEAM_INVITATION_ACCEPT_ENDPOINT = (invitationId: string) =>
  `${BASE_URL}/api/team-invitations/${invitationId}/accept`;
export const TEAM_INVITATION_REJECT_ENDPOINT = (invitationId: string) =>
  `${BASE_URL}/api/team-invitations/${invitationId}/reject`;
export const TEAM_INVITATION_CANCEL_ENDPOINT = (invitationId: string) =>
  `${BASE_URL}/api/team-invitations/${invitationId}/cancel`;

// Team Member Management API endpoints
export const TEAM_MEMBER_ROLE_ENDPOINT = (teamId: string, memberId: string) =>
  `${BASE_URL}/api/teams/${teamId}/members/${memberId}/role`;
export const TEAM_MEMBER_DELETE_ENDPOINT = (teamId: string, memberId: string) =>
  `${BASE_URL}/api/teams/${teamId}/members/${memberId}`;

// Plans
export const PLANS_ENDPOINT = `${BASE_URL}/api/plans`;

// User Subscription Plans
export const USER_SUBSCRIPTION_PLANS_ENDPOINT = `${BASE_URL}/api/user-subscriptions/plans`;
export const USER_SUBSCRIPTION_PLAN_ENDPOINT = (planId: string) =>
  `${BASE_URL}/api/user-subscriptions/plans/${planId}`;

// User Subscriptions
export const USER_SUBSCRIPTION_CURRENT_ENDPOINT = `${BASE_URL}/api/user-subscriptions/current`;
export const USER_SUBSCRIPTION_HISTORY_ENDPOINT = `${BASE_URL}/api/user-subscriptions/history`;
export const USER_SUBSCRIPTION_PURCHASE_ENDPOINT = `${BASE_URL}/api/user-subscriptions/purchase`;
export const USER_SUBSCRIPTION_CANCEL_ENDPOINT = (subscriptionId: string) =>
  `${BASE_URL}/api/user-subscriptions/${subscriptionId}/cancel`;
export const USER_SUBSCRIPTION_FEATURE_CHECK_ENDPOINT = (featureKey: string) =>
  `${BASE_URL}/api/user-subscriptions/features/${featureKey}/check`;

// Chat API endpoints
export const CHAT_CONVERSATIONS_ENDPOINT = `${BASE_URL}/api/chat/conversations`;
export const CHAT_CONVERSATIONS_DIRECT_ENDPOINT = `${BASE_URL}/api/chat/conversations/direct`;
export const CHAT_CONVERSATION_ENDPOINT = (conversationId: string) =>
  `${BASE_URL}/api/chat/conversations/${conversationId}`;
export const CHAT_MESSAGES_ENDPOINT = (conversationId: string) =>
  `${BASE_URL}/api/chat/conversations/${conversationId}/messages`;
export const CHAT_MARK_READ_ENDPOINT = (conversationId: string) =>
  `${BASE_URL}/api/chat/conversations/${conversationId}/read`;

// Payment API endpoints
export const COMPETITION_PAYMENT_ENDPOINT = `${BASE_URL}/api/orders/competition`;

// Orders API endpoints
export const ORDERS_ENDPOINT = `${BASE_URL}/api/orders`;
export const ORDER_DETAIL_ENDPOINT = (orderId: string) =>
  `${BASE_URL}/api/orders/${orderId}`;

// Calendar API endpoints
export const CALENDAR_EVENTS_ENDPOINT = (
  from?: string,
  to?: string,
  type?: string,
) => {
  const params = new URLSearchParams();
  if (from) params.append("from", from);
  if (to) params.append("to", to);
  if (type) params.append("type", type);
  const queryString = params.toString();
  return `${BASE_URL}/api/calendar/events${queryString ? `?${queryString}` : ""}`;
};

// Notification Settings API endpoints
export const NOTIFICATION_SETTINGS_ENDPOINT = `${BASE_URL}/api/notifications/settings`;

// Socket.IO endpoints
export const CHAT_WEBSOCKET_ENDPOINT = (token: string) =>
  `https://contest-buddy-be-594444870778.asia-southeast1.run.app`;

// Admin Analytics API endpoints
// User Statistics
export const ANALYTICS_USERS_TIME_RANGE_ENDPOINT = (
  startDate: string,
  endDate: string,
) =>
  `${BASE_URL}/api/analytics/users/time-range?startDate=${startDate}&endDate=${endDate}`;

export const ANALYTICS_USERS_PERIOD_ENDPOINT = (
  year: number,
  groupBy: "week" | "month" = "month",
) => `${BASE_URL}/api/analytics/users/period?year=${year}&groupBy=${groupBy}`;

export const ANALYTICS_USERS_YEAR_ENDPOINT = (
  startYear?: number,
  endYear?: number,
) => {
  const params = new URLSearchParams();
  if (startYear) params.append("startYear", startYear.toString());
  if (endYear) params.append("endYear", endYear.toString());
  const queryString = params.toString();
  return `${BASE_URL}/api/analytics/users/year${queryString ? `?${queryString}` : ""}`;
};

// Revenue Statistics
export const ANALYTICS_REVENUE_TIME_RANGE_ENDPOINT = (
  startDate: string,
  endDate: string,
) =>
  `${BASE_URL}/api/analytics/revenue/time-range?startDate=${startDate}&endDate=${endDate}`;

export const ANALYTICS_REVENUE_PERIOD_ENDPOINT = (
  year: number,
  groupBy: "week" | "month" = "month",
) => `${BASE_URL}/api/analytics/revenue/period?year=${year}&groupBy=${groupBy}`;

export const ANALYTICS_REVENUE_YEAR_ENDPOINT = (
  startYear?: number,
  endYear?: number,
) => {
  const params = new URLSearchParams();
  if (startYear) params.append("startYear", startYear.toString());
  if (endYear) params.append("endYear", endYear.toString());
  const queryString = params.toString();
  return `${BASE_URL}/api/analytics/revenue/year${queryString ? `?${queryString}` : ""}`;
};

// Plan Purchase Statistics
export const ANALYTICS_PLANS_TIME_RANGE_ENDPOINT = (
  startDate: string,
  endDate: string,
) =>
  `${BASE_URL}/api/analytics/plans/time-range?startDate=${startDate}&endDate=${endDate}`;

export const ANALYTICS_PLANS_PERIOD_ENDPOINT = (
  year: number,
  groupBy: "week" | "month" = "month",
) => `${BASE_URL}/api/analytics/plans/period?year=${year}&groupBy=${groupBy}`;

export const ANALYTICS_PLANS_YEAR_ENDPOINT = (
  startYear?: number,
  endYear?: number,
) => {
  const params = new URLSearchParams();
  if (startYear) params.append("startYear", startYear.toString());
  if (endYear) params.append("endYear", endYear.toString());
  const queryString = params.toString();
  return `${BASE_URL}/api/analytics/plans/year${queryString ? `?${queryString}` : ""}`;
};

// Subscription Dashboard
export const ANALYTICS_SUBSCRIPTION_DASHBOARD_ENDPOINT = (params?: {
  start_date?: string;
  end_date?: string;
  status?: "active" | "cancelled" | "expired" | "pending";
  plan_id?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.start_date) queryParams.append("start_date", params.start_date);
  if (params?.end_date) queryParams.append("end_date", params.end_date);
  if (params?.status) queryParams.append("status", params.status);
  if (params?.plan_id) queryParams.append("plan_id", params.plan_id);
  const queryString = queryParams.toString();
  return `${BASE_URL}/api/user-subscriptions/dashboard${queryString ? `?${queryString}` : ""}`;
};
