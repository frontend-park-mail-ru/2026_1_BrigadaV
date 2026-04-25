import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';
import type { MessageBubbleProps } from '../model/types';
import template from './MessageBubble.hbs?compiled';
import styles from './style.module.scss';

export class MessageBubble extends BaseComponent {
  constructor(private props: MessageBubbleProps) { super(); }

  protected override _render(): HTMLElement {
    const { message, currentUserId } = this.props;
    const isOwn = message.senderId === currentUserId;
    const time = message.createdAt.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return stringToElement(template({
      message,
      isOwn,
      time,
      styles,
      s: styles,
    }));
  }
}