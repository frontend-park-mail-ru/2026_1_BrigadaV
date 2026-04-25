import { Message } from '../model/types';
import { MessageDTO } from './types';

export const mapMessage = (dto: MessageDTO): Message => ({
  id: dto.id,
  ticketId: dto.ticket_id,
  senderId: dto.sender_id,
  content: dto.content,
  createdAt: new Date(dto.created_at),
});