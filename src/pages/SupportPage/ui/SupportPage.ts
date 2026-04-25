import './style.module.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';
import * as api from '@/shared/api/supportApi';
import { Ticket, TicketCategory, TicketStatus } from '../model/types';
import template from './SupportPage.hbs?compiled';
import styles from './style.module.scss';

interface State {
  tickets: Ticket[];
  filterCategory: TicketCategory | '';
  filterStatus: TicketStatus | '';
  isLoading: boolean;
  error: string | null;
  showCreateForm: boolean;
  selectedTicket: Ticket | null;
}

export class SupportPage extends BaseComponent {
  private state: State = {
    tickets: [],
    filterCategory: '',
    filterStatus: '',
    isLoading: false,
    error: null,
    showCreateForm: false,
    selectedTicket: null,
  };

  constructor() {
    super();
    this.loadTickets();
  }

  private async loadTickets() {
    this.state.isLoading = true;
    this.rerender();
    try {
      this.state.tickets = await api.fetchTickets();          // запрос
    } catch {
      this.state.error = 'Не удалось загрузить обращения';
    } finally {
      this.state.isLoading = false;
      this.rerender();
    }
  }

  private filtered(): Ticket[] {
    const { tickets, filterCategory, filterStatus } = this.state;
    return tickets.filter(t =>
      (!filterCategory || t.category === filterCategory) &&
      (!filterStatus || t.status === filterStatus)
    );
  }

  private handleFilterCategory = (e: Event) => {
    this.state.filterCategory = (e.target as HTMLSelectElement).value as TicketCategory | '';
    this.rerender();
  };
  private handleFilterStatus = (e: Event) => {
    this.state.filterStatus = (e.target as HTMLSelectElement).value as TicketStatus | '';
    this.rerender();
  };
  private toggleCreateForm = () => {
    this.state.showCreateForm = !this.state.showCreateForm;
    this.rerender();
  };
  private submitCreate = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const category = formData.get('category') as TicketCategory;
    const description = formData.get('description') as string;
    if (!category || !description) return;
    try {
      const newTicket = await api.createTicket({ category, description }); // реальный запрос
      this.state.tickets.unshift(newTicket);
      this.state.showCreateForm = false;
      this.rerender();
      window.parent.postMessage?.({ type: 'support-ticket-created', id: newTicket.id }, window.location.origin);
    } catch {
      this.state.error = 'Ошибка создания';
      this.rerender();
    }
  };
  private handleResolve = async (id: number) => {
    try {
      await api.updateTicketStatus(id, 'resolved');           // запрос
      const ticket = this.state.tickets.find(t => t.id === id);
      if (ticket) ticket.status = 'resolved';
      this.rerender();
    } catch {
      this.state.error = 'Ошибка обновления';
      this.rerender();
    }
  };
  private selectTicket = (id: number) => {
    const ticket = this.state.tickets.find(t => t.id === id) || null;
    this.state.selectedTicket = ticket;
    this.rerender();
  };
  private closeDetail = () => {
    this.state.selectedTicket = null;
    this.rerender();
  };

  protected override _render(): HTMLElement {
    const filteredTickets = this.filtered();
    const canResolve = this.state.selectedTicket && this.state.selectedTicket.status !== 'resolved';

    return stringToElement(template({
      styles,
      s: styles,
      ...this.state,
      filteredTickets,
      canResolve,                                           // <-- вместо хелпера ne
      categoryName: (cat: TicketCategory) => {              // <-- хелпер для названий категорий
        const map: Record<TicketCategory, string> = {
          bug: 'Баг',
          feature: 'Предложение',
          complaint: 'Жалоба',
        };
        return map[cat] || cat;
      },
      statusName: (st: TicketStatus) => {                   // <-- хелпер для названий статусов
        const map: Record<TicketStatus, string> = {
          new: 'Новое',
          in_progress: 'В работе',
          resolved: 'Решено',
        };
        return map[st] || st;
      },
    }));
  }

  protected override initListeners() {
    super.initListeners();
    const root = this.element!;
    root.querySelector('[data-ref="filter-category"]')?.addEventListener('change', this.handleFilterCategory);
    root.querySelector('[data-ref="filter-status"]')?.addEventListener('change', this.handleFilterStatus);
    root.querySelector('[data-ref="new-ticket-btn"]')?.addEventListener('click', this.toggleCreateForm);
    root.querySelector('[data-ref="cancel-form"]')?.addEventListener('click', this.toggleCreateForm);
    root.querySelector('[data-ref="create-form"]')?.addEventListener('submit', this.submitCreate);
    root.querySelector('[data-ref="close-detail"]')?.addEventListener('click', this.closeDetail);

    root.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const card = target.closest('[data-id]');
      if (card && !target.closest('button')) {
        const id = Number((card as HTMLElement).dataset.id);
        this.selectTicket(id);
      }
      if (target.matches('[data-ref="resolve-btn"]')) {
        const id = Number(target.dataset.ticketId);
        this.handleResolve(id);
      }
    });
  }

  private rerender() {
    if (!this.element) return;
    const parent = this.element.parentElement;
    if (!parent) return;
    const newEl = this._render();
    parent.replaceChild(newEl, this.element);
    this.element = newEl;
    this.initListeners();
  }
}