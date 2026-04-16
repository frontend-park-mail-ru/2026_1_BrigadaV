import { Trip } from '@/entities/Trip/model/types';
import { ConfirmPopup } from '@/shared/ui/ConfirmPopup';
import { formatDateRange, stringToElement } from '@/shared/utils';

import { TripBannerProps } from '../model/types';
import styles from './style.module.scss';
import template from './TripBanner.hbs?compiled';
import { eventBus } from '@/shared/lib';

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

    private handleDeleteButtonClick = async (): Promise<void> => {
        const confirmed = await ConfirmPopup({
            className: styles['banner__delete-confirm'],
            prompt: 'Вы действительно хотите удалить поездку?',
            note: 'При удалении поездки будут удалены все сохраненные в ней элементы и примечания. Удаленную поездку нельзя восстановить.',
            cancelText: 'Отменить',
            confirmText: 'Удалить',
        });

        if (confirmed) {
            eventBus.emit('TripBanner:delete', this.trip.id);
        }
    }

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
