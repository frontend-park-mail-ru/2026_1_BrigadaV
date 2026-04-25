import { request } from '@/shared/api';
import { Message } from '../model/types';
import { mapMessage } from './mappers';
import type { SendMessageRequest, MessagesListDTO } from './types';

export const sendMessage = async (data: SendMessageRequest): Promise<Message> => {
  const dto = await request<Message>('/support/messages', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return dto;
};

export const fetchTicketMessages = async (ticketId: number): Promise<Message[]> => {
  const dto = await request<MessagesListDTO>(`/support/tickets/${ticketId}/messages`, {
    method: 'GET',
  });
  if (!dto) return [];
  return dto.messages.map(mapMessage);
};