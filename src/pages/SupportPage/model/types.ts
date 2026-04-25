export type TicketCategory = 'bug' | 'feature' | 'complaint';
export type TicketStatus = 'new' | 'in_progress' | 'resolved';

export interface Ticket {
  id: number;
  category: TicketCategory;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateTicketPayload = {
  category: TicketCategory;
  description: string;
};