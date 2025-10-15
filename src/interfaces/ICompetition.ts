export type CompetitionCategory =
  | "hackathon"
  | "datathon"
  | "designathon"
  | "business_case"
  | "coding_contest"
  | "other";

export type CompetitionLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "all_levels";

export type CompetitionStatus =
  | "registration_open"
  | "registration_closed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type SkillCategory =
  | "technical"
  | "design"
  | "soft"
  | "language"
  | "other";

export interface CompetitionRequiredSkill {
  name: string;
  category: SkillCategory;
}

export interface CreateCompetitionRequest {
  title: string;
  description: string;
  category: CompetitionCategory;
  plan_id: string;
  start_date: string; // ISO date
  end_date: string; // ISO date
  registration_deadline: string; // ISO date
  location: string;
  prize_pool_text?: string;
  max_participants?: number;
  isRegisteredAsTeam?: boolean;
  maxParticipantsPerTeam?: number;
  level: CompetitionLevel;
  image_url?: string;
  website?: string;
  rules?: string;
  featured?: boolean;
  status: CompetitionStatus;
  competitionTags?: string[];
  competitionRequiredSkills?: CompetitionRequiredSkill[];
}

export interface UpdateCompetitionRequest
  extends Partial<CreateCompetitionRequest> {}

export interface ApiStatusMessage<T = unknown> {
  status: "success" | "error";
  message?: string;
  data?: T;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CompetitionSummary {
  id: string;
  title: string;
  organizer_id?: string;
  category?: CompetitionCategory;
  status?: CompetitionStatus;
  featured?: boolean;
}

export interface CompetitionDetail extends CompetitionSummary {
  description?: string;
  // camelCase fields normalized for UI layer
  startDate?: string; // ISO
  endDate?: string; // ISO
  registrationDeadline?: string; // ISO
  location?: string;
  prizePool?: string;
  participants?: number;
  maxParticipants?: number;
  level?: CompetitionLevel;
  imageUrl?: string;
  website?: string;
  rules?: string;
  tags?: string[];
  requiredSkills?: CompetitionRequiredSkill[];
  isRegisteredAsTeam?: boolean;
  maxParticipantsPerTeam?: number;
  organizer?: {
    email?: string;
    website?: string;
  };
}
