import { API_URL, request as apiRequest } from '@/shared/api';
import type { Ticket, TicketCategory, CreateTicketPayload } from '@/pages/SupportPage/model/types';

const SUPPORT_PATH = '/support/tickets';

// Обёртка над общей функцией request, добавляющая путь /support/tickets
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  return apiRequest<T>(`${SUPPORT_PATH}${url}`, options);
}

export async function fetchTickets(): Promise<Ticket[]> {
  const tickets = await request<any[]>('/');
  if (!tickets) return [];                               // защита от null
  return tickets.map(t => ({
    id: t.id,
    category: mapCategoryId(t.category_id),
    title: t.title,
    body: t.body,
    status: mapStatusId(t.status_id),
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  }));
}

export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  console.log('[supportApi] createTicket payload:', payload);
  const res = await request<any>('/', {
    method: 'POST',
    body: JSON.stringify({
      category: payload.category,
      subject: payload.subject,   // ✅ теперь сервер получит "subject"
      body: payload.body,
    }),
  });

  return {
    id: res.id,
    category: mapCategoryId(res.category_id),
    title: res.title,
    body: res.body,
    status: mapStatusId(res.status_id),
    createdAt: res.created_at,
    updatedAt: res.updated_at,
  };
}

export async function updateTicketStatus(id: number, status: string): Promise<Ticket> {
  const res = await request<any>(`/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  return {
    id: res.id,
    category: mapCategoryId(res.category_id),
    title: res.title,
    body: res.body,
    status: mapStatusId(res.status_id),
    createdAt: res.created_at,
    updatedAt: res.updated_at,
  };
}

function mapCategoryId(id: number): TicketCategory {
  const map: Record<number, TicketCategory> = { 1: 'bug', 2: 'feature', 3: 'complaint' };
  return map[id] || 'bug';
}

function mapStatusId(id: number): Ticket['status'] {
  const map: Record<number, Ticket['status']> = { 1: 'new', 2: 'in_progress', 3: 'resolved' };
  return map[id] || 'new';
}