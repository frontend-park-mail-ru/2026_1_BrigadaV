import { Field, Textarea } from '@/shared/ui';
import { injectComponents, stringToElement } from '@/shared/utils';

import { WriteReviewDialogProps } from '../model/types';
import styles from './style.module.scss';
import template from './WriteReviewDialog.hbs?compiled';

export class WriteReviewDialog {
    private element?: HTMLDialogElement;
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
                required: '',
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
                required: '',
            },
        });

        this.fields['content'] = new Textarea({
            id: 'content-textarea',
            label: 'Текст отзыва',
            attributes: {
                name: 'content',
                maxlength: 1000,
                placeholder: 'Поделитесь своими эмоциями',
                required: '',
            }
        })
    }

    private initListeners(): void {
        this.element?.addEventListener('submit', this.handleSubmit);
    }

    private handleSubmit = async (event: Event): Promise<void> => {
        const target = event.target;
        if (!(target instanceof HTMLFormElement)) {
            return;
        }

        event.preventDefault();

        const formData = new FormData(target);
        await this.props.onSubmit(this, formData);
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
