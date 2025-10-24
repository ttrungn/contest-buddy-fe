export interface NotificationSettings {
  _id: string;
  user_id: string;
  __v: number;
  achievement_sharing: boolean;
  collaboration_requests: boolean;
  competition_updates: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  reminder_timings: string[];
}

export interface NotificationSettingsResponse {
  success: boolean;
  data: NotificationSettings;
}

export interface UpdateNotificationSettingsRequest {
  email_notifications: boolean;
  push_notifications: boolean;
  reminder_timings: string[];
  competition_updates: boolean;
  achievement_sharing?: boolean;
  collaboration_requests?: boolean;
}

export interface UpdateNotificationSettingsResponse {
  success: boolean;
  data: NotificationSettings;
}

export interface NotificationState {
  settings: NotificationSettings | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
}
