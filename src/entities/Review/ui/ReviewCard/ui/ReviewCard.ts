import { eventBus } from '@/shared/lib';
import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { formatDate, stringToElement } from '@/shared/utils';

import { ReviewCardProps } from '../model/types';
import template from './ReviewCard.hbs?compiled';
import styles from './style.module.scss';

export class ReviewCard extends BaseComponent {

    constructor(private props: ReviewCardProps) { super(); }

    protected override initListeners(): void {
        super.initListeners();

        const detailsButton = this.element?.querySelector<HTMLButtonElement>('[data-details-button');
        detailsButton?.addEventListener('click', this.handleEditButtonClick);
    }

    private handleEditButtonClick = (): void => {
        eventBus.emit('ReviewCard:show-details', { ...this.props.review });
    };

    protected override _render(): HTMLElement {
        return stringToElement(template({
            ...this.props,
            ...formatDate(this.props.review.createdAt),
            styles
        }));
    }
}
