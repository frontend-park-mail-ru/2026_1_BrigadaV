import { Message } from '../../../model/types';

export type MessageBubbleProps = {
  message: Message;
  currentUserId: number;
};

export type MessageBubblePayload = MessageBubbleProps['message'];