// User Statistics Types
export interface UserTimeRangeStats {
  startDate: string;
  endDate: string;
  newUsers: number;
  newOrganizers: number;
  total: number;
}

export interface UserPeriodItem {
  _id: number;
  month?: number;
  week?: number;
  count: number;
}

export interface UserPeriodStats {
  year: number;
  groupBy: "week" | "month";
  users: UserPeriodItem[];
  organizers: UserPeriodItem[];
}

export interface UserYearItem {
  _id: number;
  year: number;
  count: number;
}

export interface UserYearStats {
  startYear: number;
  endYear: number;
  users: UserYearItem[];
  organizers: UserYearItem[];
}

// Revenue Statistics Types
export interface RevenueTimeRangeStats {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalOrders: number;
}

export interface RevenuePeriodItem {
  _id: number;
  month?: number;
  week?: number;
  totalRevenue: number;
  totalOrders: number;
}

export interface RevenuePeriodStats {
  year: number;
  groupBy: "week" | "month";
  periods: RevenuePeriodItem[];
  summary: {
    totalRevenue: number;
    totalOrders: number;
  };
}

export interface RevenueYearItem {
  _id: number;
  year: number;
  totalRevenue: number;
  totalOrders: number;
}

export interface RevenueYearStats {
  startYear: number;
  endYear: number;
  years: RevenueYearItem[];
  summary: {
    totalRevenue: number;
    totalOrders: number;
  };
}

// Plan Purchase Statistics Types
export interface PlanBreakdown {
  _id: string;
  planId: string;
  planName: string;
  totalPurchased: number;
  totalOrders: number;
}

export interface PlansTimeRangeStats {
  startDate: string;
  endDate: string;
  totalPlansPurchased: number;
  totalOrders: number;
  totalPlanTypes: number;
  planBreakdown: PlanBreakdown[];
}

export interface PlansPeriodItem {
  _id: number;
  month?: number;
  week?: number;
  totalPlansPurchased: number;
  totalOrders: number;
}

export interface PlansPeriodStats {
  year: number;
  groupBy: "week" | "month";
  periods: PlansPeriodItem[];
  summary: {
    totalPlansPurchased: number;
    totalOrders: number;
    totalPlanTypes: number;
  };
  planBreakdown: PlanBreakdown[];
}

export interface PlansYearItem {
  _id: number;
  year: number;
  totalPlansPurchased: number;
  totalOrders: number;
}

export interface PlansYearStats {
  startYear: number;
  endYear: number;
  years: PlansYearItem[];
  summary: {
    totalPlansPurchased: number;
    totalOrders: number;
    totalPlanTypes: number;
  };
  planBreakdown: PlanBreakdown[];
}

// Subscription Dashboard Types
export interface PlanMetric {
  plan_id: string;
  plan_name: string;
  plan_price: number;
  plan_currency: string;
  billing_cycle: "monthly" | "yearly";
  duration_months: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  expiredSubscriptions: number;
  pendingSubscriptions: number;
  totalRevenue: number;
}

export interface SubscriptionDashboard {
  planMetrics?: PlanMetric[];
  plans?: PlanMetric[]; // Backend may return 'plans' instead of 'planMetrics'
  summary: {
    totalRevenue: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
    cancelledSubscriptions: number;
    expiredSubscriptions: number;
    pendingSubscriptions: number;
  };
}

// API Response Types
export interface UserTimeRangeResponse {
  success: boolean;
  message: string;
  data: UserTimeRangeStats;
}

export interface UserPeriodResponse {
  success: boolean;
  message: string;
  data: UserPeriodStats;
}

export interface UserYearResponse {
  success: boolean;
  message: string;
  data: UserYearStats;
}

export interface RevenueTimeRangeResponse {
  success: boolean;
  message: string;
  data: RevenueTimeRangeStats;
}

export interface RevenuePeriodResponse {
  success: boolean;
  message: string;
  data: RevenuePeriodStats;
}

export interface RevenueYearResponse {
  success: boolean;
  message: string;
  data: RevenueYearStats;
}

export interface PlansTimeRangeResponse {
  success: boolean;
  message: string;
  data: PlansTimeRangeStats;
}

export interface PlansPeriodResponse {
  success: boolean;
  message: string;
  data: PlansPeriodStats;
}

export interface PlansYearResponse {
  success: boolean;
  message: string;
  data: PlansYearStats;
}

export interface SubscriptionDashboardResponse {
  success: boolean;
  message: string;
  data: SubscriptionDashboard;
}

// Redux State Types
export interface AnalyticsState {
  // User Stats
  userTimeRange: UserTimeRangeStats | null;
  userPeriod: UserPeriodStats | null;
  userYear: UserYearStats | null;

  // Revenue Stats
  revenueTimeRange: RevenueTimeRangeStats | null;
  revenuePeriod: RevenuePeriodStats | null;
  revenueYear: RevenueYearStats | null;

  // Plan Stats
  plansTimeRange: PlansTimeRangeStats | null;
  plansPeriod: PlansPeriodStats | null;
  plansYear: PlansYearStats | null;

  // Subscription Dashboard
  subscriptionDashboard: SubscriptionDashboard | null;

  // Loading states
  isLoading: boolean;
  error: string | null;
}

// Query Parameter Types
export interface TimeRangeParams {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface PeriodParams {
  year: number;
  groupBy?: "week" | "month";
}

export interface YearParams {
  startYear?: number;
  endYear?: number;
}

export interface SubscriptionDashboardParams {
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  status?: "active" | "cancelled" | "expired" | "pending";
  plan_id?: string;
}

