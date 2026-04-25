import { eventBus } from '@/shared/lib';
import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { formatDate, stringToElement } from '@/shared/utils';
import { TICKET_CATEGORIES, TICKET_STATUSES } from '../../../model/types';
import type { TicketCardProps } from '../model/types';
import template from './TicketCard.hbs?compiled';
import styles from './style.module.scss';

export class TicketCard extends BaseComponent {
  constructor(private props: TicketCardProps) { super(); }

  protected override initListeners(): void {
    super.initListeners();
    this.element?.addEventListener('click', this.handleCardClick);
  }

  private handleCardClick = () => {
    eventBus.emit('TicketCard:select', this.props.ticket);
  };

  protected override _render(): HTMLElement {
    const { ticket } = this.props;
    const categoryName = (TICKET_CATEGORIES as any)[ticket.categoryId] ?? 'Неизвестно';
    const statusName = (TICKET_STATUSES as any)[ticket.statusId] ?? 'Неизвестно';
    const { isoDate, date } = formatDate(ticket.createdAt);

    return stringToElement(template({
      ticket,
      category: categoryName,
      status: statusName,
      statusKey: statusName.toLowerCase().replace(/\s+/g, '_'),
      isoDate,
      date,
      styles,
      concat: (...args: string[]) => args.join(' '),
      s: styles,
    }));
  }
}