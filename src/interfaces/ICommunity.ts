// Community user interfaces for displaying in Community page
export interface CommunityUserSkill {
  skillName: string;
  category: string;
  level: string;
  experienceYears: number;
}

export interface CommunitySocialLinks {
  github: string;
  linkedin: string;
  personal: string;
}

export interface CommunityUser {
  userId: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  school: string;
  city: string;
  region: string;
  country: string;
  studyField: string;
  joinDate: string;
  rating: number;
  isVerified: boolean;
  skills: CommunityUserSkill[];
  socialLinks: CommunitySocialLinks;
}

// Filter interfaces for community search and filtering
export interface CommunityFilters {
  // Text search
  search?: string;
  
  // Location filters
  city?: string;
  region?: string;
  country?: string;
  
  // Education filters
  school?: string;
  study_field?: string;
  
  // Rating filters
  min_rating?: number;
  max_rating?: number;
  
  // Verification filter
  is_verified?: boolean;
  
  // Date filters
  join_date_from?: string; // ISO format
  join_date_to?: string; // ISO format
  
  // Skills filters
  skill_name?: string;
  skill_category?: string;
  skill_level?: string;
  
  // Pagination
  page?: number;
  limit?: number;
}