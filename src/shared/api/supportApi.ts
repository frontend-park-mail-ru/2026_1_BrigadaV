import type { Ticket, TicketCategory, TicketStatus, CreateTicketPayload } from '@/pages/SupportPage/model/types';

const BASE = '/api/support';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include', // куки
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorBody.message || `Ошибка ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchTickets(): Promise<Ticket[]> {
  return request<Ticket[]>('/tickets');
}

export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  return request<Ticket>('/tickets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateTicketStatus(id: number, status: TicketStatus): Promise<Ticket> {
  return request<Ticket>(`/tickets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}