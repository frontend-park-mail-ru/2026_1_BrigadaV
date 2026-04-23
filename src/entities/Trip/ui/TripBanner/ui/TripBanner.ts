import { eventBus } from '@/shared/lib';
import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { ConfirmPopup } from '@/shared/ui/ConfirmPopup';
import { formatDateRange, stringToElement } from '@/shared/utils';

import { TripBannerProps } from '../model/types';
import styles from './style.module.scss';
import template from './TripBanner.hbs?compiled';

export class TripBanner extends BaseComponent {
    constructor(private props: TripBannerProps) { super(); }

    private get trip() {
        return this.props.trip;
    }

    protected override initListeners(): void {
        super.initListeners();

        const deleteButton = this.element?.querySelector('[data-delete-button]');
        deleteButton?.addEventListener('click', this.handleDeleteButtonClick);
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
            eventBus.emit('TripBanner:delete', { id: this.trip.id });
        }
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

    protected override _render(): HTMLElement {
        return stringToElement(template({
            ...this.props,
            ...this.makeTemplateDates(),
            styles,
        }));
    }
}
