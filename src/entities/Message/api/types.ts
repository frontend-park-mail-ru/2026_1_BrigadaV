export type SendMessageRequest = {
  ticket_id: number;
  content: string;
};

export type MessageDTO = {
  id: number;
  ticket_id: number;
  sender_id: number;
  content: string;
  created_at: string;
};

export type MessagesListDTO = {
  messages: MessageDTO[];
};