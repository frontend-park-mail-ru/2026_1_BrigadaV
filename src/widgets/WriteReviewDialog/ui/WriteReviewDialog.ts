import { eventBus } from '@/shared/lib';
import { BaseForm } from '@/shared/lib/component/BaseForm';
import { ValidationRule } from '@/shared/model';
import { Field, Textarea } from '@/shared/ui';
import { stringToElement } from '@/shared/utils';

import { WriteReviewDialogProps, WriteReviewFields } from '../model/types';
import styles from './style.module.scss';
import template from './WriteReviewDialog.hbs?compiled';

export class WriteReviewDialog extends BaseForm<WriteReviewFields, HTMLDialogElement> {
    constructor(private props: WriteReviewDialogProps) {
        super();

        this.children = {
            title: new Field({
                id: 'title-input',
                label: 'Заголовок',
                type: 'text',
                attributes: {
                    name: 'title',
                    maxlength: 20,
                    minlength: 1,
                    placeholder: 'Поделитесь своим мнением',
                    required: '',
                }
            }),

            rating: new Field({
                id: 'rating-input',
                label: 'Оценка',
                type: 'number',
                attributes: {
                    name: 'rating',
                    maxlength: 10,
                    max: 5,
                    min: 1,
                    placeholder: 'от 1 до 5, где 5 — отлично',
                    required: '',
                },
            }),

            content: new Textarea({
                id: 'content-textarea',
                label: 'Текст отзыва',
                attributes: {
                    name: 'content',
                    maxlength: 1000,
                    placeholder: 'Поделитесь своими эмоциями',
                    required: '',
                }
            }),
        };
    }

    protected override get validationRules(): ValidationRule<WriteReviewFields>[] {
        return [
            {
                isInvalid: ({ title }) => title.length > 20 || title.length < 1,
                field: 'title',
                message: 'Заголовок должен содержать от 1 до 20 символов',
            },
            {
                isInvalid: ({ rating }) => isNaN(+rating) || +rating > 5 || +rating < 1,
                field: 'rating',
                message: 'Оценка должна быть числом от 1 до 5',
            },
            {
                isInvalid: ({ content }) => content.length > 1000,
                field: 'content',
                message: 'Отзыв не может превышать 1000 символов',
            },
        ];
    }

    protected override handleSubmit = async (data: WriteReviewFields): Promise<void> => {
        await eventBus.emit('WriteReviewDialog:submit', { instance: this, data });
    };

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
