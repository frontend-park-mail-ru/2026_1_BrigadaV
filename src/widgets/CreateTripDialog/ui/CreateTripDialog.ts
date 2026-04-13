import { eventBus, focusField } from '@/shared/lib';
import { Field } from '@/shared/ui';
import { formatDateRange, injectComponents, stringToElement } from '@/shared/utils';

import { CreateTripDialogProps } from '../model/types';
import template from './CreateTripDialog.hbs?compiled';
import styles from './style.module.scss';

export class CreateTripDialog {
    private element?: HTMLDialogElement;
    private fields: Record<string, Field> = {};

    constructor(private props: CreateTripDialogProps) {
        this.fields['title'] = new Field({
            id: 'title-input',
            label: 'Название поездки',
            type: 'text',
            attributes: {
                name: 'title',
                maxlength: 255,
                minlength: 1,
                placeholder: 'например, хотите уехать жить в Лондон',
                required: '',
            }
        });

        this.fields['location'] = new Field({
            className: 'field--rounded',
            id: 'location-input',
            label: 'Направление',
            type: 'text',
            attributes: {
                name: 'location',
                maxlength: 50,
                placeholder: 'Куда',
                required: '',
            },
            leftIcon: '/icons/search.svg',
            onLeftIconClick: focusField,
        });
    }

    private initListeners(): void {
        this.element?.addEventListener('submit', this.handleSubmit);
    }

    private handleSubmit(event: Event): void {
        const target = event.target;
        if (!(target instanceof HTMLFormElement)) {
            return;
        }

        event.preventDefault();

        const formData = Object.fromEntries(new FormData(target));
        eventBus.emit('CreateTripDialog:submit', { instance: this, data: formData });
    }

    public close(): void {
        this.element?.close();
    }

    public render(): HTMLElement {
        this.element = stringToElement<HTMLDialogElement>(template({
            ...this.props,
            fields: Object.keys(this.fields),
            styles,
        }));

        injectComponents(this.element, this.fields);
        this.initListeners();

        return this.element;
    }

}
