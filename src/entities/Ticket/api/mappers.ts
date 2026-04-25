import { Ticket } from '../model/types';
import { TicketDTO } from './types';

export const mapTicket = (dto: TicketDTO): Ticket => ({
  id: dto.id,
  userId: dto.user_id,
  categoryId: dto.category_id,
  statusId: dto.status_id,
  title: dto.title,
  body: dto.body,
  createdAt: new Date(dto.created_at),
  updatedAt: new Date(dto.updated_at),
});