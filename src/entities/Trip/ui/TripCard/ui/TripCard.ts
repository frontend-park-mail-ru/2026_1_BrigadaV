import { eventBus } from '@/shared/lib';
import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { formatDateRange, stringToElement } from '@/shared/utils';

import { TripCardProps } from '../model/types';
import styles from './style.module.scss';
import template from './TripCard.hbs?compiled';

export class TripCard extends BaseComponent {
    private get trip() {
        return this.props.trip;
    }

    constructor(private props: TripCardProps) { super(); }

    protected override initListeners(): void {
        super.initListeners();
        if (!this.element) return;

        const editButton = this.element.querySelector<HTMLButtonElement>('[data-edit-button]');
        editButton?.addEventListener('click', this.handleEditButtonClick);
    }

    private handleEditButtonClick = () => {
        eventBus.emit('TripCard:open-edit', this.trip);
    };

    private makeTemplateDates() {
        const { startDate, endDate } = this.trip;

        let dateRange = {};

        if (startDate && endDate) {
            dateRange = formatDateRange(startDate, endDate);
        }

        return {
            ...dateRange,
            isoStart: startDate?.toISOString() ?? '',
            isoEnd: endDate?.toISOString() ?? '',
            hasDates: !!(startDate && endDate),
        };
    }

    protected override _render(): HTMLElement {
        return stringToElement(template({
            ...this.props,
            ...this.makeTemplateDates(),
            styles,
        }));
    }
}
