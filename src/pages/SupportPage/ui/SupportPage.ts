import './style.module.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';
import * as api from '@/shared/api/supportApi';
import { Ticket, TicketCategory, TicketStatus } from '../model/types';
import { Field } from '@/shared/ui/Field';
import template from './SupportPage.hbs?compiled';
import styles from './style.module.scss';

interface State {
  tickets: Ticket[];
  filterCategory: TicketCategory | '';
  filterStatus: TicketStatus | '';
  isLoading: boolean;
  error: string | null;
  selectedTicket: Ticket | null;
}

export class SupportPage extends BaseComponent {
  private state: State = {
    tickets: [],
    filterCategory: '',
    filterStatus: '',
    isLoading: false,
    error: null,
    selectedTicket: null,
  };

  private descriptionField: Field | null = null;
  private categorySelect: HTMLSelectElement | null = null;

  constructor() {
    super();
    this.loadTickets();
  }

  private async loadTickets() {
    this.state.isLoading = true;
    this.rerender();
    try {
      this.state.tickets = await api.fetchTickets();
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

  private handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const category = formData.get('category') as TicketCategory;
    const description = formData.get('description') as string;

    if (!category || !description.trim()) return;

    try {
      const newTicket = await api.createTicket({ category, description });
      this.state.tickets.unshift(newTicket);
      this.state.error = null;
      this.descriptionField?.setValue('');
      this.rerender();
      window.parent.postMessage?.({ type: 'support-ticket-created', id: newTicket.id }, window.location.origin);
    } catch {
      this.state.error = 'Ошибка создания';
      this.rerender();
    }
  };

  private handleResolve = async (id: number) => {
    try {
      await api.updateTicketStatus(id, 'resolved');
      const ticket = this.state.tickets.find(t => t.id === id);
      if (ticket) ticket.status = 'resolved';
      this.rerender();
    } catch {
      this.state.error = 'Ошибка обновления';
      this.rerender();
    }
  };

  private selectTicket = (id: number) => {
    this.state.selectedTicket = this.state.tickets.find(t => t.id === id) || null;
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
      canResolve,
      categoryName: (cat: TicketCategory) =>
        ({ bug: 'Баг', feature: 'Предложение', complaint: 'Жалоба' }[cat] || cat),
      statusName: (st: TicketStatus) =>
        ({ new: 'Новое', in_progress: 'В работе', resolved: 'Решено' }[st] || st),
    }));
  }

  protected override initListeners() {
    super.initListeners();
    const root = this.element!;

    root.querySelector('[data-ref="filter-category"]')?.addEventListener('change', this.handleFilterCategory);
    root.querySelector('[data-ref="filter-status"]')?.addEventListener('change', this.handleFilterStatus);
    root.querySelector('[data-ref="close-detail"]')?.addEventListener('click', this.closeDetail);
    root.querySelector('[data-ref="create-form"]')?.addEventListener('submit', this.handleSubmit);

    root.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const card = target.closest('[data-id]');
      if (card && !target.closest('button')) {
        this.selectTicket(Number((card as HTMLElement).dataset.id));
      }
      if (target.matches('[data-ref="resolve-btn"]')) {
        this.handleResolve(Number(target.dataset.ticketId));
      }
    });

    // Создаём Field с name='description' для FormData
    const fieldContainer = root.querySelector('[data-ref="description-field"]');
    if (fieldContainer) {
      this.descriptionField = new Field({
        type: 'text',
        label: 'Описание',
        attributes: {
          name: 'description',          // <-- теперь значение попадёт в FormData
          placeholder: 'Опишите проблему',
          required: 'true',
        },
      });
      fieldContainer.appendChild(this.descriptionField.render());
    }

    // Заполняем селект категорий, добавляем name='category'
    this.categorySelect = root.querySelector('[data-ref="category-select"]');
    if (this.categorySelect) {
      this.categorySelect.name = 'category';   // важно для FormData
      this.categorySelect.innerHTML = '';
      const categories: Record<string, string> = {
        bug: 'Баг',
        feature: 'Предложение',
        complaint: 'Жалоба',
      };
      for (const [val, label] of Object.entries(categories)) {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = label;
        this.categorySelect.appendChild(opt);
      }
    }
  }

  private rerender() {
    if (!this.element) return;
    const parent = this.element.parentElement;
    if (!parent) return;
    const newEl = this.render();
    parent.replaceChild(newEl, this.element);
  }
}