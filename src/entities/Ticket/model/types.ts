export type Ticket = {
  id: number;
  userId: number;
  categoryId: number;
  statusId: number;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
};

export const TICKET_CATEGORIES = {
  1: 'Баг',
  2: 'Предложение',
  3: 'Продуктовая жалоба',
} as const;

export const TICKET_STATUSES = {
  1: 'Открыто',
  2: 'В работе',
  3: 'Закрыто',
} as const;