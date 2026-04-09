import styles from './style.module.scss';

import template from './ReviewDetailsModal.hbs?compiled';
import { ReviewDetailsModalProps, ReviewDetailsModalInitValues } from '../model/types';
import { formatDate, stringToElement } from '@/shared/utils';

export class ReviewDetailsModal {
    private element?: HTMLDialogElement;
    private fields: Record<string, HTMLElement> = {};

    constructor(private props: ReviewDetailsModalProps) { }

    // TODO add confirmation on form submit
    public show(reviewInfo: ReviewDetailsModalInitValues): void {
        if (!this.element) return;

        if (this.fields['avatar'] instanceof HTMLImageElement) {
            // TODO get author avatar somehow
            // this.fields['avatar'].src =
        }

        const formattedDate = formatDate(reviewInfo.review.createdAt);

        this.fields['author'].textContent = reviewInfo.review.author;
        this.fields['place-name'].textContent = reviewInfo.placeName;
        this.fields['date'].textContent = formattedDate.date;
        this.fields['date'].setAttribute('datetime', formattedDate.isoDate);
        this.fields['rating'].textContent = reviewInfo.review.rating.toString();
        this.fields['title'].textContent = reviewInfo.review.title;
        this.fields['content'].textContent = reviewInfo.review.content;
        this.fields['review-count'].textContent = reviewInfo.reviewCount.toString();

        this.element.style.setProperty('--rating', reviewInfo.review.rating.toString());

        // TODO check user id instead of names
        const isOwner = this.props.user?.nickname === reviewInfo.review.author;
        this.element.classList.toggle(styles['review-details--own'], isOwner);

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
