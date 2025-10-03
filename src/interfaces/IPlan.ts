export interface Plan {
  _id: string;
  id: string;
  name: string;
  description: string;
  price_amount: number;
  currency: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface PlansResponse {
  success: boolean;
  data: Plan[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface PlansState {
  plans: Plan[];
  isLoading: boolean;
  error: string | null;
}
