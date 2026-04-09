import { formatDateRange, stringToElement } from '@/shared/utils';

import { TripCardProps } from '../model/types';
import styles from './style.module.scss';
import template from './TripCard.hbs?compiled';
import { eventBus } from '@/shared/lib';
import { Trip } from '@/entities/Trip/model/types';

export class TripCard {
    element?: HTMLElement;

    constructor(private props: TripCardProps) {}

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

    public render(): HTMLElement {
        this.element = stringToElement(template({
            ...this.props,
            ...formatDateRange(this.trip.startDate, this.trip.endDate),
            isoStart: this.trip.startDate.toISOString(),
            isoEnd: this.trip.endDate.toISOString(),
            styles,
        }));

        this.initListeners();
        return this.element;
    }
}
