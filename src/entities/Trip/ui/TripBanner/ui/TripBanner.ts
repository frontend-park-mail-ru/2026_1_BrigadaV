import { Trip } from '@/entities/Trip/model/types';
import { formatDateRange, stringToElement } from '@/shared/utils';

import { TripBannerProps } from '../model/types';
import styles from './style.module.scss';
import template from './TripBanner.hbs?compiled';
import { ConfirmPopup } from '@/shared/ui/ConfirmPopup';

export class TripBanner {
    element?: HTMLElement;

    constructor(private props: TripBannerProps) { }

    private get trip(): Trip {
        return this.props.trip;
    }

    private initListeners(): void {
        if (!this.element) return;

        this.element.querySelector<HTMLButtonElement>('[data-delete-button]')?.addEventListener('click', this.handleDeleteButtonClick);
    }

    private async handleDeleteButtonClick(): Promise<void> {
        const confirmed = await ConfirmPopup({
            className: styles['banner__delete-confirm'],
            prompt: 'Вы действительно хотите удалить поездку?',
            note: 'При удалении поездки будут удалены все сохраненные в ней элементы и примечания. Удаленную поездку нельзя восстановить.',
            cancelText: 'Отменить',
            confirmText: 'Удалить',
        });

        if (confirmed) {
            // TODO add API call to remove trip
        }
    }

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
