import { eventBus } from '@/shared/lib';
import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { formatDateRange, stringToElement } from '@/shared/utils';

import { TripCardProps } from '../model/types';
import styles from './style.module.scss';
import template from './TripCard.hbs?compiled';
import { navigate } from '@/shared/router';

export class TripCard extends BaseComponent {
    private get trip() {
        return this.props.trip;
    }

    constructor(private props: TripCardProps) { super(); }

    protected override initListeners(): void {
        super.initListeners();
        if (!this.element) return;

        this.element?.addEventListener('click', this.handleClick);
    }

    private handleClick = (event: Event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        const selection = window.getSelection()?.toString();
        const isInsideEdit = Boolean(target.closest('[data-edit-button]'));

        if (isInsideEdit) {
            event.stopPropagation();
            eventBus.emit('TripCard:open-edit', this.trip);
            return;
        }

        if (selection) return;

        const link = this.fields.link;
        if (link instanceof HTMLAnchorElement) navigate(link.href);
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
