import './style.scss';

import { formatHours, stringToElement, WorkingHour } from '@/shared/utils';

import { WorkingHoursProps } from '../model/types';
import template from './WorkingHours.hbs?compiled';

const workingHours: WorkingHour[] = [
    { day: 0, start: '10:00', end: '19:00' },
    { day: 1, start: '10:00', end: '19:00' },
    { day: 2, start: '10:00', end: '19:00' },
    { day: 3, start: '10:00', end: '19:00' },
    { day: 4, start: '10:00', end: '19:00' },
    { day: 5, start: '11:00', end: '18:00' },
    { day: 6, start: '11:00', end: '18:00' },
];

export class WorkingHours {
    element?: HTMLElement;

    constructor(private props: WorkingHoursProps) { }

    public render(): HTMLElement {

        return stringToElement(template({
            ...this.props,
            workingHours: formatHours(workingHours),
        }));
    }
}
