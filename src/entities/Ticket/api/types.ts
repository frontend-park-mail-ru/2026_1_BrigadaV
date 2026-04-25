export type CreateTicketRequest = {
  category_id: number;
  title: string;
  body: string;
};

export type TicketDTO = {
  id: number;
  user_id: number;
  category_id: number;
  status_id: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export type TicketsListDTO = {
  tickets: TicketDTO[];
};

export type StatisticsDTO = {
  total: number;
  by_status: Record<number, number>;
  by_category: Record<number, number>;
};