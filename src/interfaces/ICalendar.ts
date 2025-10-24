export interface CalendarEvent {
  _id: string;
  id: string;
  user_id: string;
  competition_id: string;
  title: string;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  type: "competition" | "deadline" | "reminder";
  description: string;
  location: string;
  reminder_set: boolean;
  __v: number;
}

export interface ParticipatedCompetition {
  competition: {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    start_date: string;
    end_date: string;
    registration_deadline: string;
    location: string;
    prize_pool_text: string;
    participants_count: number;
    max_participants: number;
    image_url: string;
    status: string;
    featured: boolean;
  };
  participation: {
    participantId: string;
    registrationDate: string;
    status: string;
    paymentStatus: string;
    submissionStatus: string;
    teamId: string | null;
  };
}

export interface CalendarEventsResponse {
  success: boolean;
  data: CalendarEvent[];
}

export interface ParticipatedCompetitionsResponse {
  success: boolean;
  data: ParticipatedCompetition[];
  totalCompetitions: number;
  upcomingDeadlines: {
    count: number;
    message: string;
    note: string;
    competitions: any[];
  };
  monthlyStats: {
    totalCompetitions: number;
    upcomingDeadlines: number;
    registered: number;
    interested: number;
    online: number;
  };
}

export interface CalendarFilters {
  from?: string; // ISO date string
  to?: string; // ISO date string
  type?: "competition" | "deadline" | "reminder";
}

export interface CalendarState {
  events: CalendarEvent[];
  participatedCompetitions: ParticipatedCompetition[];
  upcomingDeadlines: any[];
  monthlyStats: {
    totalCompetitions: number;
    upcomingDeadlines: number;
    registered: number;
    interested: number;
    online: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  filters: CalendarFilters;
}
