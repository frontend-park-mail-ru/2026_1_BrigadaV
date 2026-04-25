import { request } from '@/shared/api';
import { Ticket } from '../model/types';
import { mapTicket } from './mappers';
import type { CreateTicketRequest, TicketDTO, TicketsListDTO, StatisticsDTO } from './types';

export const createTicket = async (data: CreateTicketRequest): Promise<Ticket> => {
  const dto = await request<TicketDTO>('/support/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!dto) throw new Error('Failed to create ticket');
  return mapTicket(dto);
};

export const fetchUserTickets = async (): Promise<Ticket[]> => {
  const dto = await request<TicketsListDTO>('/support/tickets', { method: 'GET' });
  if (!dto) return [];
  return dto.tickets.map(mapTicket);
};

export const updateTicketStatus = async (ticketId: number, newStatusId: number): Promise<Ticket> => {
  const dto = await request<TicketDTO>(`/support/tickets/${ticketId}`, {
    method: 'PUT',
    body: JSON.stringify({ new_status_id: newStatusId }),
  });
  if (!dto) throw new Error('Failed to update ticket status');
  return mapTicket(dto);
};

export const fetchStatistics = async (): Promise<StatisticsDTO> => {
  const dto = await request<StatisticsDTO>('/support/statistics', { method: 'GET' });
  if (!dto) throw new Error('Failed to fetch statistics');
  return dto;
};