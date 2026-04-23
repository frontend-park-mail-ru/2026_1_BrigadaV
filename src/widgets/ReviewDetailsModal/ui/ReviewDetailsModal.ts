import { eventBus } from '@/shared/lib';
import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { ConfirmPopup } from '@/shared/ui/ConfirmPopup';
import { stringToElement } from '@/shared/utils';

import { ReviewDetailsModalInitValues, ReviewDetailsModalProps } from '../model/types';
import template from './ReviewDetailsModal.hbs?compiled';
import styles from './style.module.scss';

export class ReviewDetailsModal extends BaseComponent<HTMLDialogElement> {
    private reviewId?: number;
    private fields: Record<string, HTMLElement> = {};

    constructor(private props: ReviewDetailsModalProps) { super(); }

    public show({ data }: ReviewDetailsModalInitValues): void {
        if (!this.element) return;

        if (this.fields['avatar'] instanceof HTMLImageElement) {
            this.fields['avatar'].src = data.avatarUrl || '/icons/default-avatar.svg';
        }

        this.fields['author'].textContent = data.authorName;
        this.fields['place-name'].textContent = data.placeName;
        this.fields['date'].textContent = data.dateText;
        this.fields['date'].setAttribute('datetime', data.dateIso);
        this.fields['rating'].textContent = data.rating.toString();
        this.fields['title'].textContent = data.title;
        this.fields['content'].textContent = data.content;
        this.fields['review-count'].textContent = data.reviewCountText;

        this.reviewId = data.id;

        this.element.style.setProperty('--rating', data.rating.toString());
        this.element.classList.toggle(styles['review-details--own'], data.isOwner);

        this.element.showModal();
    }

    private initFields(element: HTMLDialogElement): void {
        const refs = element.querySelectorAll<HTMLElement>('[data-ref]');
        refs.forEach((item) => {
            const key = item.getAttribute('data-ref');
            if (key) {
                this.fields[key] = item;
            }
        });
    }

    protected override initListeners(): void {
        super.initListeners();
        const deleteButton = this.element?.querySelector('[data-ref="delete-button"]');
        deleteButton?.addEventListener('click', this.handleDelete);
    }

    private handleDelete = async (event: Event): Promise<void> => {
        event.preventDefault();
        const confirmed = await ConfirmPopup({
            prompt: 'Вы действительно хотите удалить отзыв?',
            note: 'При удалении отзыва будут удалены все сохраненные в нем элементы и примечания. Удаленный отзыв нельзя восстановить.',
            cancelText: 'Отменить',
            confirmText: 'Удалить',
        });

        if (confirmed) {
            eventBus.emit('ReviewDetailsModal:delete', { instance: this, data: { id: this.reviewId } });
        }
    };

    public close(): void {
        this.element?.close();
    }

    protected override _render(): HTMLDialogElement {
        const element = stringToElement<HTMLDialogElement>(template({
            ...this.props,
            styles,
        }));

        this.initFields(element);
        return element;
    }
}
