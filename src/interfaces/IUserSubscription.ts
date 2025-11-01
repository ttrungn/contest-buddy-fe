import { UserSubscriptionPlan } from "./IUserSubscriptionPlan";

export interface UserSubscription {
  _id: string;
  user_id: string;
  plan_id: string | UserSubscriptionPlan;
  plan: UserSubscriptionPlan;
  status: "pending" | "active" | "cancelled" | "expired";
  start_date: string;
  end_date: string;
  amount_paid: number;
  currency: string;
  cancelled_at?: string;
  cancelled_reason?: string;
  features: {
    max_daily_reminders?: number;
    priority_support?: boolean;
    export_history?: boolean;
    max_followed_contests?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscriptionResponse {
  success: boolean;
  message?: string;
  data: UserSubscription | null;
}

export interface UserSubscriptionHistoryResponse {
  success: boolean;
  message?: string;
  data: UserSubscription[];
}

export interface PurchaseSubscriptionRequest {
  plan_id: string;
}

export interface PurchaseSubscriptionResponse {
  success: boolean;
  message?: string;
  data: {
    subscription_id: string;
    payment_url: string;
    qr_code: string;
    order_code: string;
    amount: number;
    plan_name: string;
    expiry_date: string;
  };
}

export interface CancelSubscriptionRequest {
  reason?: string;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message?: string;
  data: UserSubscription;
}

export interface FeatureAccessCheckResponse {
  success: boolean;
  hasAccess: boolean;
  message?: string;
  value: number | boolean | null;
}

export interface UserSubscriptionState {
  currentSubscription: UserSubscription | null;
  history: UserSubscription[];
  isLoading: boolean;
  error: string | null;
}

