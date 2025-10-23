export interface Order {
  _id: string;
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  currency: string;
  status: OrderStatus;
  notes: string;
  order_date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderDetail {
  _id: string;
  id: string;
  order_id: string;
  product_id: string;
  product_source_schema: string;
  product_description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  discount_per_item: number;
  final_price: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CompetitionInfo {
  _id: string;
  id: string;
  title: string;
  description: string;
  category: string;
  plan_id: string;
  organizer_id: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  location: string;
  prize_pool_text: string;
  participants_count: number;
  max_participants: number;
  isRegisteredAsTeam: boolean;
  maxParticipantsPerTeam: number;
  level: string;
  image_url: string;
  website: string;
  rules: string;
  featured: boolean;
  status: string;
  __v: number;
  isDeleted: boolean;
  paying_status: string;
}

export interface OrderDetailResponse {
  success: boolean;
  message: string;
  data: {
    order: Order;
    orderDetails: OrderDetail[];
    additionalInfo: {
      competition: CompetitionInfo;
    };
  };
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
  };
}

export type OrderStatus = "pending" | "completed" | "cancelled" | "failed";

export interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  orderDetails: OrderDetail[];
  competitionInfo: CompetitionInfo | null;
  isLoading: boolean;
  error: string | null;
}
