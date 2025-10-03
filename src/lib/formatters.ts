import { CommunityUser, CommunityUserSkill, CommunitySocialLinks } from "@/interfaces/ICommunity";

// Transform API response from snake_case to camelCase format for community users
export function transformApiUserArrayToCommunityUsers(apiUsers: any[]): CommunityUser[] {
  return apiUsers.map((user) => ({
    userId: user.user_id || user.userId,
    username: user.username,
    fullName: user.full_name || user.fullName,
    email: user.email,
    avatarUrl: user.avatar_url || user.avatarUrl || '',
    bio: user.bio || '',
    school: user.school || '',
    city: user.city || '',
    region: user.region || '',
    country: user.country || '',
    studyField: user.study_field || user.studyField || '',
    joinDate: user.join_date || user.joinDate,
    rating: user.rating || 0,
    isVerified: user.is_verified || user.isVerified || false,
    skills: transformApiUserSkills(user.skills || []),
    socialLinks: transformApiSocialLinks(user.social_links || user.socialLinks || {}),
  }));
}

// Transform API skills from snake_case to camelCase
function transformApiUserSkills(apiSkills: any[]): CommunityUserSkill[] {
  return apiSkills.map((skill) => ({
    skillName: skill.skill_name || skill.skillName,
    category: skill.category,
    level: skill.level,
    experienceYears: skill.experience_years || skill.experienceYears || 0,
  }));
}

// Transform API social links from snake_case to camelCase
function transformApiSocialLinks(apiSocialLinks: any): CommunitySocialLinks {
  return {
    github: apiSocialLinks.github || '',
    linkedin: apiSocialLinks.linkedin || '',
    personal: apiSocialLinks.personal || '',
  };
}