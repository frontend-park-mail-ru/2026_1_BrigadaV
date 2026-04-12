import { formatDate, stringToElement } from '@/shared/utils';

import { ReviewDetailsModalInitValues, ReviewDetailsModalProps } from '../model/types';
import template from './ReviewDetailsModal.hbs?compiled';
import styles from './style.module.scss';

export class ReviewDetailsModal {
    private element?: HTMLDialogElement;
    private fields: Record<string, HTMLElement> = {};

    constructor(private props: ReviewDetailsModalProps) { }

    // TODO add confirmation on form submit
    public show(reviewInfo: ReviewDetailsModalInitValues): void {
        if (!this.element) return;

        if (this.fields['avatar'] instanceof HTMLImageElement && reviewInfo.review.author.avatar) {
            this.fields['avatar'].src = reviewInfo.review.author.avatar;
        }

        const formattedDate = formatDate(reviewInfo.review.createdAt);

        this.fields['author'].textContent = reviewInfo.review.author.nickname;
        this.fields['place-name'].textContent = reviewInfo.placeName;
        this.fields['date'].textContent = formattedDate.date;
        this.fields['date'].setAttribute('datetime', formattedDate.isoDate);
        this.fields['rating'].textContent = reviewInfo.review.rating.toString();
        this.fields['title'].textContent = reviewInfo.review.title;
        this.fields['content'].textContent = reviewInfo.review.content || '';
        this.fields['review-count'].textContent = reviewInfo.reviewCount.toString();

        this.element.style.setProperty('--rating', reviewInfo.review.rating.toString());

        if (this.props.user) {
            const isOwner = this.props.user.id === reviewInfo.review.author.id;
            this.element.classList.toggle(styles['review-details--own'], isOwner);
        }

        this.element.showModal();
    }

    private initFields(): void {
        if (!this.element) return;

        const refs = this.element.querySelectorAll<HTMLElement>('[data-ref]');
        refs.forEach((item) => {
            const key = item.getAttribute('data-ref');
            if (key) {
                this.fields[key] = item;
            }
        });
    }

    public render(): HTMLElement {
        this.element = stringToElement<HTMLDialogElement>(template({
            ...this.props,
            styles,
        }));

        this.initFields();

        return this.element;
    }

}
