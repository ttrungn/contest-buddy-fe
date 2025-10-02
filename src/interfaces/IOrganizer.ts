export interface OrganizerProfile {
  userId: string;
  username: string;
  email: string;
  full_name: string;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  avatar_url?: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
}

export interface OrganizerProfileResponse {
  success: boolean;
  profile: OrganizerProfile;
}

export interface UpdateOrganizerProfileRequest {
  name: string;
  email: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  full_name?: string;
}

export interface UpdateOrganizerProfileResponse {
  success: boolean;
  message: string;
  organizerId: string;
}

export interface UploadOrganizerAvatarResponse {
  success: boolean;
  message: string;
  avatar_url: string;
}
