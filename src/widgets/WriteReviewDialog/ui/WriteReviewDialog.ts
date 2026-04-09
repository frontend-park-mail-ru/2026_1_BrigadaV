import { Field, Textarea } from '@/shared/ui';
import { injectComponents, stringToElement } from '@/shared/utils';

import { WriteReviewDialogProps } from '../model/types';
import template from './WriteReviewDialog.hbs?compiled';
import styles from './style.module.scss';

export class WriteReviewDialog {
    private element?: HTMLElement;
    private fields: Record<string, Field | Textarea> = {};

    constructor(private props: WriteReviewDialogProps) {
        this.fields['title'] = new Field({
            id: 'title-input',
            label: 'Заголовок',
            type: 'text',
            attributes: {
                name: 'title',
                maxlength: 20,
                placeholder: 'Поделитесь своим мнением',
            }
        });

        this.fields['rating'] = new Field({
            id: 'rating-input',
            label: 'Оценка',
            type: 'number',
            attributes: {
                name: 'rating',
                maxlength: 10,
                max: 5,
                min: 1,
                placeholder: 'от 1 до 5, где 5 — отлично',
            },
        });

        this.fields['content'] = new Textarea({
            id: 'content-textarea',
            label: 'Текст отзыва',
            attributes: {
                name: 'content',
                maxlength: 150,
                placeholder: 'Поделитесь своими эмоциями',
            }
        })
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
