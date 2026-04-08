import styles from './style.module.scss';
import template from './ReviewCard.hbs?compiled';
import { ReviewCardProps } from '../model/types';
import { formatDate, stringToElement } from '@/shared/utils';
import { eventBus } from '@/shared/lib';

export class ReviewCard {
    element?: HTMLElement;

    constructor(private props: ReviewCardProps) { }

    private initListeners(): void {
        if (!this.element) return;

        this.element.querySelector<HTMLButtonElement>('[data-details-button')?.addEventListener('click', this.handleEditButtonClick);
    }

    private handleEditButtonClick = (): void => {
        // TODO pass review id and stuff
        eventBus.emit('ReviewCard:showDetails', this.props);
    };

    public render(): HTMLElement {
        this.element = stringToElement(template({
            ...this.props,
            ...formatDate(this.props.review.createdAt),
            styles
        }));

        this.initListeners();

        this.element.style.setProperty('--rating', this.props.review.rating.toString());
        return this.element;
    }
}
