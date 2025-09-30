// Customer Profile interfaces (from backend API)
export interface CustomerSocialLinks {
  github: string;
  linkedin: string;
  personal: string;
}

export interface CustomerProfile {
  userId: string;
  username: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio: string;
  school: string;
  city: string;
  region: string;
  country: string;
  study_field: string;
  join_date: string;
  rating: number;
  social_links: CustomerSocialLinks;
  avatarUrl?: string;
}

export interface CustomerProfileResponse {
  success: boolean;
  profile: CustomerProfile;
}

export interface UpdateCustomerProfileRequest {
  full_name?: string;
  email?: string;
  bio?: string;
  school?: string;
  city?: string;
  region?: string;
  country?: string;
  study_field?: string;
  social_links?: Partial<CustomerSocialLinks>;
}

export interface UpdateCustomerProfileResponse {
  success: boolean;
  message: string;
}
