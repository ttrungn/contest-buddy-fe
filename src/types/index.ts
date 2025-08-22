export interface Competition {
  id: string;
  title: string;
  description: string;
  category: CompetitionCategory;
  organizer: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  location: string;
  isOnline: boolean;
  prizePool?: string;
  participants: number;
  maxParticipants?: number;
  requiredSkills: Skill[];
  level: CompetitionLevel;
  tags: string[];
  imageUrl?: string;
  website?: string;
  rules?: string;
  featured: boolean;
  status: CompetitionStatus;
  isRegistered?: boolean;
  isInterested?: boolean;
  registrationDate?: Date;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar?: string;
  bio: string;
  school: string;
  location: {
    city: string;
    region: string;
    country: string;
  };
  skills: UserSkill[];
  interests: string[];
  studyField: string;
  achievements: Achievement[];
  portfolio: PortfolioItem[];
  socialLinks: SocialLinks;
  joinDate: Date;
  isVerified: boolean;
  rating: number;
  collaborationHistory: Collaboration[];
}

export interface UserSkill {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  certifications?: Certification[];
  experienceYears: number;
}

export interface Achievement {
  id: string;
  competitionId: string;
  competitionTitle: string;
  position: number;
  award: string;
  date: Date;
  category: string;
  teamSize?: number;
  description?: string;
  certificate?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  date: Date;
  featured: boolean;
}

export interface Collaboration {
  id: string;
  partnerId: string;
  partnerName: string;
  competitionId: string;
  competitionTitle: string;
  date: Date;
  rating: number;
  comment: string;
  skills: string[];
}

export interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderTiming: ReminderTiming[];
  competitionUpdates: boolean;
  collaborationRequests: boolean;
  achievementSharing: boolean;
}

export interface CalendarEvent {
  id: string;
  competitionId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  type: EventType;
  description?: string;
  location?: string;
  reminderSet: boolean;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  behance?: string;
  dribbble?: string;
  personal?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: Date;
  url?: string;
}

export type CompetitionCategory =
  | "programming"
  | "design"
  | "business"
  | "science"
  | "mathematics"
  | "innovation"
  | "startup"
  | "creative";

export type CompetitionLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export type CompetitionStatus =
  | "upcoming"
  | "registration-open"
  | "ongoing"
  | "completed"
  | "cancelled";

export type SkillCategory =
  | "technical"
  | "design"
  | "business"
  | "science"
  | "communication"
  | "leadership";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type EventType =
  | "registration-deadline"
  | "competition-start"
  | "competition-end"
  | "announcement";

export type ReminderTiming =
  | "1-week"
  | "3-days"
  | "1-day"
  | "6-hours"
  | "1-hour";

export interface Skill {
  name: string;
  category: SkillCategory;
}

export interface SearchFilters {
  category?: CompetitionCategory[];
  level?: CompetitionLevel[];
  location?: string;
  isOnline?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  skills?: string[];
  prizePool?: boolean;
  status?: CompetitionStatus[];
}

export interface CommunityPost {
  id: string;
  authorId: string;
  author: {
    id: string;
    fullName: string;
    username: string;
    avatar?: string;
    school: string;
    isVerified: boolean;
  };
  title: string;
  content: string;
  competitionId?: string;
  competitionTitle?: string;
  requiredSkills: string[];
  teamSize: number;
  currentMembers: number;
  location?: string;
  isRemote: boolean;
  deadline?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  comments: Comment[];
  applicants: Applicant[];
  status: PostStatus;
  type: PostType;
}

export interface Comment {
  id: string;
  authorId: string;
  author: {
    id: string;
    fullName: string;
    username: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
}

export interface Applicant {
  id: string;
  userId: string;
  user: {
    id: string;
    fullName: string;
    username: string;
    avatar?: string;
    school: string;
    skills: string[];
  };
  message: string;
  appliedAt: Date;
  status: ApplicationStatus;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  participantDetails: ChatParticipant[];
  lastMessage?: ChatMessage;
  lastActivity: Date;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  unreadCount: number;
  type: ConversationType;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  createdAt: Date;
  readBy: string[];
  replyTo?: string;
  attachments?: MessageAttachment[];
}

export interface ChatParticipant {
  id: string;
  fullName: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface MessageAttachment {
  id: string;
  type: AttachmentType;
  url: string;
  fileName: string;
  fileSize: number;
}

export type PostStatus = "open" | "closed" | "draft";
export type PostType = "find-members" | "find-team" | "general";
export type ApplicationStatus = "pending" | "accepted" | "rejected";
export type ConversationType = "direct" | "group" | "post-related";
export type MessageType = "text" | "image" | "file" | "system";
export type AttachmentType = "image" | "document" | "video" | "audio";

export interface Team {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  leaderId: string;
  leader: TeamMember;
  members: TeamMember[];
  competitionId?: string;
  competitionTitle?: string;
  skills: string[];
  goals: string[];
  isPrivate: boolean;
  maxMembers: number;
  createdAt: Date;
  updatedAt: Date;
  status: TeamStatus;
  inviteCode: string;
  location?: string;
  isRemote: boolean;
}

export interface TeamMember {
  id: string;
  userId: string;
  user: {
    id: string;
    fullName: string;
    username: string;
    avatar?: string;
    school: string;
    skills: string[];
  };
  role: TeamRole;
  joinedAt: Date;
  contribution: string;
  status: MemberStatus;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  team: {
    id: string;
    name: string;
    avatar?: string;
    leader: string;
  };
  inviterId: string;
  inviter: {
    id: string;
    fullName: string;
    username: string;
    avatar?: string;
  };
  inviteeId: string;
  message: string;
  createdAt: Date;
  status: InvitationStatus;
}

export type TeamStatus = "active" | "completed" | "disbanded" | "recruiting";
export type TeamRole = "leader" | "co-leader" | "member";
export type MemberStatus = "active" | "inactive" | "left";
export type InvitationStatus = "pending" | "accepted" | "rejected" | "expired";

export interface CompetitionManagement {
  id: string;
  competitionId: string;
  competition: Competition;
  organizerId: string;
  organizer: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status: ManagementStatus;
  createdAt: Date;
  updatedAt: Date;
  settings: CompetitionSettings;
  finances: CompetitionFinances;
  statistics: CompetitionStatistics;
  participants: CompetitionParticipant[];
}

export interface CompetitionSettings {
  allowLateRegistration: boolean;
  autoApproveRegistrations: boolean;
  maxParticipants?: number;
  registrationFee?: number;
  emailNotifications: boolean;
  publicLeaderboard: boolean;
  allowTeamRegistration: boolean;
  maxTeamSize?: number;
}

export interface CompetitionFinances {
  budget: number;
  revenue: FinanceEntry[];
  expenses: FinanceEntry[];
  prizePool: number;
  sponsorships: Sponsorship[];
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

export interface FinanceEntry {
  id: string;
  type: FinanceType;
  category: string;
  description: string;
  amount: number;
  date: Date;
  source?: string;
  receipt?: string;
  status: FinanceStatus;
}

export interface Sponsorship {
  id: string;
  sponsor: string;
  amount: number;
  type: SponsorshipType;
  benefits: string[];
  status: SponsorshipStatus;
  contractDate: Date;
}

export interface CompetitionStatistics {
  totalRegistrations: number;
  approvedRegistrations: number;
  pendingRegistrations: number;
  rejectedRegistrations: number;
  completedSubmissions: number;
  registrationsByDate: RegistrationData[];
  participantsBySchool: SchoolData[];
  participantsByRegion: RegionData[];
  averageRating: number;
  completionRate: number;
}

export interface RegistrationData {
  date: string;
  count: number;
}

export interface SchoolData {
  school: string;
  count: number;
}

export interface RegionData {
  region: string;
  count: number;
}

export interface CompetitionParticipant {
  id: string;
  userId: string;
  user: {
    id: string;
    fullName: string;
    username: string;
    avatar?: string;
    school: string;
    email: string;
  };
  registrationDate: Date;
  status: ParticipantStatus;
  paymentStatus: PaymentStatus;
  submissionStatus: SubmissionStatus;
  score?: number;
  rank?: number;
  notes?: string;
}

export type ManagementStatus =
  | "draft"
  | "published"
  | "ongoing"
  | "completed"
  | "cancelled";
export type FinanceType = "revenue" | "expense";
export type FinanceStatus = "pending" | "confirmed" | "cancelled";
export type SponsorshipType = "cash" | "in-kind" | "media";
export type SponsorshipStatus =
  | "negotiating"
  | "confirmed"
  | "completed"
  | "cancelled";
export type ParticipantStatus =
  | "registered"
  | "approved"
  | "rejected"
  | "withdrawn";
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "waived";
export type SubmissionStatus =
  | "not-submitted"
  | "submitted"
  | "reviewed"
  | "scored";
