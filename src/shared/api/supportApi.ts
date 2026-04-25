import type { Ticket, TicketCategory, CreateTicketPayload } from '@/pages/SupportPage/model/types';

const BASE = '/api/support/tickets'; // без слеша на конце

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const fullUrl = `${BASE}${url}`;
  console.log(`[supportApi] -> ${options?.method || 'GET'} ${fullUrl}`);
  const res = await fetch(fullUrl, {
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
  const tickets = await request<any[]>('/');   // GET /api/support/tickets/
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
  const res = await request<any>('/', {        // POST /api/support/tickets/
    method: 'POST',
    body: JSON.stringify({
      category: payload.category,
      title: payload.subject,                 // сервер ожидает title
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