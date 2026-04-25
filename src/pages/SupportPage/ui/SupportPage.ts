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
}

export class SupportPage extends BasePage {
  protected override template = template;
  protected override styles = styles;
  protected override pageClassName = 'support-page';

  private state: State = {
    tickets: [],
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
      this.updateTicketList();
    } catch (err) {
      console.error('[SupportPage] loadTickets error:', err);
    }
  }

  private sendForm = async () => {
    const form = this.element?.querySelector('[data-ref="create-form"]') as HTMLFormElement;
    if (!form) return;
    const formData = new FormData(form);
    const category = formData.get('category') as TicketCategory;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const description = formData.get('description') as string;

    console.log('[SupportPage] sendForm values:', { category, name, email, description });

    if (!category || !description.trim() || !name.trim() || !email.trim()) {
      this.showMessage('Пожалуйста, заполните все поля', false);
      return;
    }

    const body = `Имя: ${name}\nEmail: ${email}\n\n${description}`;
    const subject = `Обращение: ${({ bug: 'Баг', feature: 'Предложение', complaint: 'Жалоба' }[category])}`;

    try {
      console.log('[SupportPage] calling api.createTicket');
      const newTicket = await api.createTicket({ category, subject, body });
      console.log('[SupportPage] ticket created:', newTicket);
      this.state.tickets.unshift(newTicket);
      this.showMessage('Обращение отправлено!', true);
      this.clearForm();
      this.updateTicketList();
    } catch (err) {
      console.error('[SupportPage] createTicket error:', err);
      this.showMessage('Не удалось отправить обращение. Попробуйте позже.', false);
    }
  };

  private showMessage(text: string, isSuccess: boolean) {
    const msgClass = isSuccess ? styles['support-page__success'] : styles['support-page__error'];
    // удалим предыдущее сообщение, если есть
    this.element?.querySelector(`.${msgClass}`)?.remove();
    const msgEl = document.createElement('div');
    msgEl.className = msgClass;
    msgEl.textContent = text;
    const createSection = this.element?.querySelector('.support-page__create-section');
    if (createSection) {
      createSection.after(msgEl);
    } else {
      this.element?.appendChild(msgEl);
    }
  }

  private clearForm() {
    this.nameField?.setValue('');
    this.emailField?.setValue('');
    this.descriptionField?.setValue('');
  }

  private updateTicketList() {
    if (this.state.tickets.length === 0) return;

    let listContainer = this.element?.querySelector('[data-ref="ticket-list"]');
    if (!listContainer) {
      const mySection = document.createElement('div');
      mySection.className = styles['support-page__my-tickets'];
      mySection.innerHTML = `<h2>Мои обращения</h2><div class="${styles['support-page__list']}" data-ref="ticket-list"></div>`;
      const createSection = this.element?.querySelector('.support-page__create-section');
      if (createSection) {
        createSection.after(mySection);
      } else {
        this.element?.appendChild(mySection);
      }
      listContainer = mySection.querySelector('[data-ref="ticket-list"]');
    }

    if (listContainer) {
      const categoryLabels: Record<TicketCategory, string> = {
        bug: 'Баг',
        feature: 'Предложение',
        complaint: 'Жалоба',
      };
      listContainer.innerHTML = this.state.tickets
        .map(
          t => `
          <div class="${styles['support-page__ticket']}">
            <span class="${styles['support-page__ticket-category']}">[${categoryLabels[t.category] || t.category}]</span>
            <span class="${styles['support-page__ticket-description']}">${t.body}</span>
          </div>`
        )
        .join('');
    }
  }

  protected override _render(): HTMLElement {
    return stringToElement(template({
      styles,
      s: styles,
      tickets: [],
      successMessage: null,
    }));
  }

  protected override initListeners() {
    super.initListeners();
    const root = this.element!;

    const submitBtn = root.querySelector('[data-ref="submit-btn"]');
    if (submitBtn) {
      console.log('[SupportPage] binding click on submit button');
      submitBtn.addEventListener('click', () => this.sendForm());
    } else {
      console.error('[SupportPage] submit-btn not found!');
    }

    // Поля ввода
    const nameContainer = root.querySelector('[data-ref="name-field"]');
    if (nameContainer) {
      this.nameField = new Field({
        type: 'text',
        label: 'Ваше имя',
        attributes: { name: 'name', placeholder: 'Иван Петров' },
      });
      nameContainer.appendChild(this.nameField.render());
    }

    const emailContainer = root.querySelector('[data-ref="email-field"]');
    if (emailContainer) {
      this.emailField = new Field({
        type: 'email',
        label: 'Email для связи',
        attributes: { name: 'email', placeholder: 'your@email.com' },
      });
      emailContainer.appendChild(this.emailField.render());
    }

    const descContainer = root.querySelector('[data-ref="description-field"]');
    if (descContainer) {
      this.descriptionField = new Field({
        type: 'text',
        label: 'Описание проблемы',
        attributes: { name: 'description', placeholder: 'Опишите проблему' },
      });
      descContainer.appendChild(this.descriptionField.render());
    }

    // Показываем уже загруженные тикеты (если есть)
    this.updateTicketList();
  }
}