import { focusField } from '@/shared/lib';
import { Field } from '@/shared/ui';
import { injectComponents, stringToElement } from '@/shared/utils';

import { CreateTripDialogProps } from '../model/types';
import template from './CreateTripDialog.hbs?compiled';
import styles from './style.module.scss';

export class CreateTripDialog {
    private element?: HTMLElement;
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
            },
            leftIcon: '/icons/search.svg',
            onLeftIconClick: focusField,
        });
    }

    public render(): HTMLElement {
        this.element = stringToElement(template({
            ...this.props,
            fields: Object.keys(this.fields),
            styles,
        }));

        injectComponents(this.element, this.fields);

        return this.element;
    }

}
