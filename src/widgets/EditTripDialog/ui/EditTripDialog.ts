import { eventBus, focusField } from '@/shared/lib';
import { BaseForm } from '@/shared/lib/component/BaseForm';
import { ValidationRule } from '@/shared/model';
import { Field, Textarea } from '@/shared/ui';
import { ConfirmPopup } from '@/shared/ui/ConfirmPopup';
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
                    maxlength: 255,
                    minlength: 1,
                    required: '',
                }
            }),

            location: new Field({
                id: 'location-input',
                label: 'Направление',
                type: 'text',
                attributes: {
                    name: 'location',
                    maxlength: 50,
                    minlength: 1,
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

    protected override async handleSubmit(data: EditTripDialogFields): Promise<void> {
        const payload: UpdateTripPayload = {
            id: this.tripId!,
            title: data.title,
            location: data.location,
            description: data.description,

            startDate: data['start-date'] ? new Date(data['start-date']) : undefined,
            endDate: data['end-date'] ? new Date(data['end-date']) : undefined,
        };
        await eventBus.emit('EditTripDialog:submit', { instance: this, data: payload });
    }

    private handleDelete = async (event: Event): Promise<void> => {
        event.preventDefault();

        const confirmed = await ConfirmPopup({
            prompt: 'Вы действительно хотите удалить поездку?',
            note: 'При удалении поездки будут удалены все сохраненные в ней элементы и примечания. Удаленную поездку нельзя восстановить.',
            cancelText: 'Отменить',
            confirmText: 'Удалить',
        });

        if (confirmed) {
            this.setLoading(true);
            await eventBus.emit('EditTripDialog:delete', { instance: this, data: { id: this.tripId } });
            this.setLoading(false);
        }
    };

    public override setFieldError(field: string, message: string): void {
        if (field === 'date-range') {
            const errorContainer = this.fields['date-error'];
            const errorText = this.fields['date-error-text'];

            if (errorText) errorText.textContent = message;

            errorContainer?.classList.toggle(styles['is-visible'], !!message);
            return;
        }

        super.setFieldError(field, message);
    }

    public override clearErrors(): void {
        super.clearErrors();
        this.setFieldError('date-range', '');
    }

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

    protected override get validationRules(): ValidationRule<EditTripDialogFields>[] {
        return [
            {
                isInvalid: ({ title }) => title.length < 1 || title.length > 255,
                field: 'title',
                message: 'Название поездки должно иметь от 1 до 255 символов',
            },
            {
                isInvalid: ({ location }) => location.length < 1 || location.length > 50,
                field: 'location',
                message: 'Название места должно иметь от 1 до 50 символов',
            },
            {
                isInvalid: ({ 'start-date': startDate, 'end-date': endDate }) =>
                    Boolean(startDate && endDate && startDate > endDate),
                field: 'date-range' as keyof EditTripDialogFields,
                message: 'Дата начала поездки не может быть после даты окончания',
            },
            {
                isInvalid: ({ description }) => description.length > 1000,
                field: 'description',
                message: 'Описание не может иметь более 1000 символов',
            },
        ];
    }

    protected override _render(): HTMLDialogElement {
        return stringToElement<HTMLDialogElement>(template({
            ...this.props,
            fields: Object.keys(this.children),
            styles,
        }));
    }
}
