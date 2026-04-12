import { focusField } from '@/shared/lib';
import { Field, Textarea } from '@/shared/ui';
import { injectComponents, stringToElement } from '@/shared/utils';

import { EditTripDialogProps, EditTripInitValues } from '../model/types';
import template from './EditTripDialog.hbs?compiled';
import styles from './style.module.scss';

export class EditTripDialog {
    private element?: HTMLDialogElement;
    private fields: Record<string, Field | Textarea> = {};

    constructor(private props: EditTripDialogProps) {
        this.fields['title'] = new Field({
            id: 'title-input',
            label: 'Название',
            type: 'text',
            attributes: {
                name: 'title',
                maxlength: 20,
            }
        });

        this.fields['location'] = new Field({
            id: 'location-input',
            label: 'Направление',
            type: 'text',
            attributes: {
                name: 'location',
                maxlength: 50,
            },
            leftIcon: '/icons/search.svg',
            onLeftIconClick: focusField,
        });

        this.fields['start-date'] = new Field({
            id: 'start-date-input',
            label: 'Дата начала',
            type: 'date',
            attributes: {
                name: 'start-date',
            }
        });

        this.fields['end-date'] = new Field({
            id: 'end-date-input',
            label: 'Дата окончания',
            type: 'date',
            attributes: {
                name: 'end-date',
            }
        });

        this.fields['description'] = new Textarea({
            id: 'description-textarea',
            label: 'Описание',
            attributes: {
                name: 'description',
                maxlength: 1000,
                placeholder: 'Запишите свои заметки',
            }
        });
    }

    private initListeners(): void {
        this.element?.addEventListener('submit', this.handleSubmit);

        const deleteBtn = this.element?.querySelector('[data-ref="delete"');
        deleteBtn?.addEventListener('click', this.handleDelete);
    }

    private handleSubmit = async (event: Event): Promise<void> => {
    }

    private handleDelete = async (event: Event): Promise<void> => {
    }

    public show(tripInfo: EditTripInitValues): void {
        if (!this.element) return;

        this.fields['title'].setValue(tripInfo.title);
        this.fields['location'].setValue(tripInfo.location);
        if (tripInfo.startDate && tripInfo.endDate) {
            this.fields['start-date'].setValue(tripInfo.startDate.toISOString().split('T')[0]);
            this.fields['end-date'].setValue(tripInfo.endDate.toISOString().split('T')[0]);
        }
        this.fields['description'].setValue(tripInfo.description);

        this.element.showModal();
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
