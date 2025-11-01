export interface UserSubscriptionPlan {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  billing_cycle: "monthly" | "yearly";
  duration_months: number;
  status: "active" | "inactive" | "archived";
  popular: boolean;
  display_order: number;
  features?: {
    max_daily_reminders?: number;
    priority_support?: boolean;
    export_history?: boolean;
    max_followed_contests?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscriptionPlansResponse {
  success: boolean;
  message?: string;
  data: UserSubscriptionPlan[];
}

export interface UserSubscriptionPlanResponse {
  success: boolean;
  message?: string;
  data: UserSubscriptionPlan;
}

export interface UserSubscriptionPlansState {
  plans: UserSubscriptionPlan[];
  isLoading: boolean;
  error: string | null;
}

