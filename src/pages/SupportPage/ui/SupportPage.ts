import './style.module.scss';
import { BasePage } from '@/shared/lib/page/BasePage';
import { stringToElement } from '@/shared/utils';
import * as api from '@/shared/api/supportApi';
import { Ticket, TicketCategory } from '../model/types';
import { Field } from '@/shared/ui/Field';
import template from './SupportPage.hbs?compiled';
import styles from './style.module.scss';
import { AppState } from '@/shared/model';

interface State {
  tickets: Ticket[];
  successMessage: string | null;
}

export class SupportPage extends BasePage {
  protected override template = template;
  protected override styles = styles;
  protected override pageClassName = 'support-page';

  private state: State = {
    tickets: [],
    successMessage: null,
  };

  private nameField: Field | null = null;
  private emailField: Field | null = null;
  private descriptionField: Field | null = null;

  public static async create(appState: AppState): Promise<SupportPage> {
    const page = new SupportPage(appState);
    await page.loadTickets();
    return page;
  }

  private constructor(appState: AppState) {
    super(appState);
  }

  private async loadTickets() {
    try {
      this.state.tickets = await api.fetchTickets();
    } catch {
      // список останется пустым
    }
  }

  private handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const category = formData.get('category') as TicketCategory;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const description = formData.get('description') as string;

    if (!category || !description.trim() || !name.trim() || !email.trim()) return;

    try {
      // Отправляем обращение (email и имя пока не используются в API, но добавим потом)
      await api.createTicket({ category, description });
      this.state.successMessage = 'Обращение отправлено!';
      // Очищаем поля
      this.nameField?.setValue('');
      this.emailField?.setValue('');
      this.descriptionField?.setValue('');
      this.refreshUI();
    } catch {
      this.state.successMessage = 'Не удалось отправить обращение. Попробуйте позже.';
      this.refreshUI();
    }
  };

  protected override _render(): HTMLElement {
    const categoryLabels: Record<TicketCategory, string> = {
      bug: 'Баг',
      feature: 'Предложение',
      complaint: 'Жалоба',
    };

    const ticketsWithLabels = this.state.tickets.map(t => ({
      ...t,
      categoryLabel: categoryLabels[t.category] || t.category,
    }));

    return stringToElement(template({
      styles,
      s: styles,
      tickets: ticketsWithLabels,
      successMessage: this.state.successMessage,
    }));
  }

  protected override initListeners() {
    super.initListeners();
    const root = this.element!;

    root.querySelector('[data-ref="create-form"]')?.addEventListener('submit', this.handleSubmit);

    // Поле имени
    const nameContainer = root.querySelector('[data-ref="name-field"]');
    if (nameContainer) {
      this.nameField = new Field({
        type: 'text',
        label: 'Ваше имя',
        attributes: {
          name: 'name',
          placeholder: 'Иван Петров',
          required: 'true',
        },
      });
      nameContainer.appendChild(this.nameField.render());
    }

    // Поле email
    const emailContainer = root.querySelector('[data-ref="email-field"]');
    if (emailContainer) {
      this.emailField = new Field({
        type: 'email',
        label: 'Email для связи',
        attributes: {
          name: 'email',
          placeholder: 'your@email.com',
          required: 'true',
        },
      });
      emailContainer.appendChild(this.emailField.render());
    }

    // Поле описания
    const descContainer = root.querySelector('[data-ref="description-field"]');
    if (descContainer) {
      this.descriptionField = new Field({
        type: 'text',
        label: 'Описание проблемы',
        attributes: {
          name: 'description',
          placeholder: 'Опишите проблему',
          required: 'true',
        },
      });
      descContainer.appendChild(this.descriptionField.render());
    }
  }

  private refreshUI() {
    if (!this.element) return;
    const newEl = this.render();   // render() из BaseComponent
    this.element.replaceWith(newEl);
    // После replaceWith this.element указывает на старый удалённый элемент, но render() обновляет this.element
    // Вручную обновим ссылку
    this.element = newEl;
  }
}