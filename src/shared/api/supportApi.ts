import type { Ticket, TicketCategory, CreateTicketPayload } from '@/pages/SupportPage/model/types';

const BASE = '/api/support/tickets';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

export async function fetchTickets(): Promise<Ticket[]> {
  const tickets = await request<any[]>('/');
  // Преобразуем ответ сервера в наш тип (сервер отдаёт title, body, category_id, status_id)
  return tickets.map(t => ({
    id: t.id,
    category: mapCategoryId(t.category_id),   // добавим функцию ниже
    title: t.title,
    body: t.body,
    status: mapStatusId(t.status_id),         // строковый статус
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  }));
}

export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  const res = await request<any>('/', {
    method: 'POST',
    body: JSON.stringify({
      category: payload.category,    // отправляем строкой, как ожидает сервер
      title: payload.subject,        // сервер ждёт title
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

// Вспомогательные функции маппинга ID в строки
function mapCategoryId(id: number): TicketCategory {
  const map: Record<number, TicketCategory> = { 1: 'bug', 2: 'feature', 3: 'complaint' };
  return map[id] || 'bug';
}

function mapStatusId(id: number): Ticket['status'] {
  const map: Record<number, Ticket['status']> = { 1: 'new', 2: 'in_progress', 3: 'resolved' };
  return map[id] || 'new';
}