import { Trip } from '@/entities/Trip/model/types';
import { eventBus } from '@/shared/lib';
import { formatDate, formatDateRange, stringToElement } from '@/shared/utils';

import { TripCardProps } from '../model/types';
import styles from './style.module.scss';
import template from './TripCard.hbs?compiled';

export class TripCard {
    element?: HTMLElement;

    constructor(private props: TripCardProps) { }

    private get trip(): Trip {
        return this.props.trip;
    }

    private initListeners(): void {
        if (!this.element) return;

        this.element.querySelector<HTMLButtonElement>('[data-edit-button]')?.addEventListener('click', this.handleEditButtonClick);
    }

    private handleEditButtonClick = (): void => {
        // TODO pass trip id and stuff
        eventBus.emit('TripCard:edit', this.props);
    };

    private makeTemplateDates(): Record<string, string | boolean> {
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

    public render(): HTMLElement {
        this.element = stringToElement(template({
            ...this.props,
            ...this.makeTemplateDates(),
            styles,
        }));

        this.initListeners();
        return this.element;
    }
}
