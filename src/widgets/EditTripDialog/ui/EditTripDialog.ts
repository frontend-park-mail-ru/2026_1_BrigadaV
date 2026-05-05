import { eventBus, focusField } from '@/shared/lib';
import { BaseForm } from '@/shared/lib/component/BaseForm';
import { Field, Textarea } from '@/shared/ui';
import { stringToElement } from '@/shared/utils';

import {
    EditTripDialogFields,
    EditTripDialogProps,
    EditTripInitValues,
    UpdateTripPayload
} from '../model/types';
import template from './EditTripDialog.hbs?compiled';
import styles from './style.module.scss';

export class EditTripDialog extends BaseForm<EditTripDialogFields, HTMLDialogElement> {
    private tripId?: number;

    constructor(private props: EditTripDialogProps) {
        super();

        this.children = {
            title: new Field({
                id: 'title-input',
                label: 'Название',
                type: 'text',
                attributes: {
                    name: 'title',
                    maxlength: 20,
                }
            }),

            location: new Field({
                id: 'location-input',
                label: 'Направление',
                type: 'text',
                attributes: {
                    name: 'location',
                    maxlength: 50,
                    required: '',
                },
                leftIcon: '/icons/search.svg',
                onLeftIconClick: focusField,
            }),

            'start-date': new Field({
                id: 'start-date-input',
                label: 'Дата начала',
                type: 'date',
                attributes: {
                    name: 'start-date',
                }
            }),

            'end-date': new Field({
                id: 'end-date-input',
                label: 'Дата окончания',
                type: 'date',
                attributes: {
                    name: 'end-date',
                }
            }),

            description: new Textarea({
                id: 'description-textarea',
                label: 'Описание',
                attributes: {
                    name: 'description',
                    maxlength: 1000,
                    placeholder: 'Запишите свои заметки',
                }
            }),
        };
    }

    private updateButtonText = (): void => {
        if (window.innerWidth <= 1024) {
            this.fields.delete.textContent = 'Удалить';
        } else {
            this.fields.delete.textContent = 'Удалить поездку';
        }
    };

    protected override initListeners(): void {
        super.initListeners();

        this.updateButtonText();
        window.addEventListener('resize', this.updateButtonText);

        const deleteButton = this.element?.querySelector('[data-ref="delete"]');
        deleteButton?.addEventListener('click', this.handleDelete);
    }

    protected override handleSubmit(data: EditTripDialogFields): void {
        const payload: UpdateTripPayload = {
            id: this.tripId!,
            title: data.title,
            location: data.location,
            description: data.description,

            startDate: data['start-date'] ? new Date(data['start-date']) : undefined,
            endDate: data['end-date'] ? new Date(data['end-date']) : undefined,
        };
        eventBus.emit('EditTripDialog:submit', { instance: this, data: payload });
    }

    private handleDelete = async (event: Event): Promise<void> => {
        event.preventDefault();
        eventBus.emit('EditTripDialog:delete', { instance: this, data: { id: this.tripId } });
    };

    public show(data: EditTripInitValues): void {
        if (!this.element) return;

        this.tripId = data.id;
        const formValues: Partial<Record<keyof EditTripDialogFields, string>> = {
            title: data.title,
            location: data.location,
            description: data.description,
            'start-date': data.startDate?.toISOString().split('T')[0],
            'end-date': data.endDate?.toISOString().split('T')[0],
        };

        this.setFieldValues(formValues);

        this.element.showModal();
    }

    public close(): void {
        this.element?.close();
    }

    protected override _render(): HTMLDialogElement {
        return stringToElement<HTMLDialogElement>(template({
            ...this.props,
            fields: Object.keys(this.children),
            styles,
        }));
    }
}
