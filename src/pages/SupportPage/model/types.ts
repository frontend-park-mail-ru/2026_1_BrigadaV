export type TicketCategory = 'bug' | 'feature' | 'complaint';

export interface Ticket {
  id: number;
  category: TicketCategory;   // строка (bug, feature, complaint)
  title: string;               // тема
  body: string;                // описание
  status: 'new' | 'in_progress' | 'resolved';  // строковый статус
  createdAt: string;
  updatedAt: string;
}

export type CreateTicketPayload = {
  category: TicketCategory;
  subject: string;             // тема обращения
  body: string;                // текст обращения
};