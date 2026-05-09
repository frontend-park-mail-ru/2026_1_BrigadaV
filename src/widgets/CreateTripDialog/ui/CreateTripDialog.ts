import { eventBus, focusField } from '@/shared/lib';
import { BaseForm } from '@/shared/lib/component/BaseForm';
import { ValidationRule } from '@/shared/model';
import { Field } from '@/shared/ui';
import { stringToElement } from '@/shared/utils';

import { CreateTripDialogFields, CreateTripDialogProps } from '../model/types';
import template from './CreateTripDialog.hbs?compiled';
import styles from './style.module.scss';

export class CreateTripDialog extends BaseForm<CreateTripDialogFields, HTMLDialogElement> {
    constructor(private props: CreateTripDialogProps) {
        super();

        this.children = {
            title: new Field({
                id: 'title-input',
                label: 'Название поездки',
                type: 'text',
                attributes: {
                    name: 'title',
                    maxlength: 255,
                    minlength: 1,
                    placeholder: 'хочу уехать жить в Лондон',
                    required: '',
                }
            }),

            location: new Field({
                className: 'field--rounded',
                id: 'location-input',
                label: 'Направление',
                type: 'text',
                attributes: {
                    name: 'location',
                    maxlength: 50,
                    minlength: 1,
                    placeholder: 'Куда',
                    required: '',
                },
                leftIcon: '/icons/search.svg',
                onLeftIconClick: focusField,
            }),
        };
    }

    protected override initListeners(): void {
        super.initListeners();
        this.element?.addEventListener('command', this.handleCommand);
    }

    private handleCommand = (ev: Event): void => {
        if (!this.element) return;

        const event = ev as CommandEvent;

        event.preventDefault();

        switch (event.command) {
        case 'show-modal':
            this.element.showModal();
            this.element.classList.add(styles['is-visible']);
            break;

        case 'close':
            if (this.isSubmitting) return;
            this.close();
            break;
        }
    };

    public close(): void {
        this.element?.classList.remove(styles['is-visible']);

        const handleTransitionEnd = (e: TransitionEvent) => {
            this.element?.close();
        };
        this.element?.addEventListener('transitionend', handleTransitionEnd, { once: true });
    }

    protected override async handleSubmit(data: CreateTripDialogFields): Promise<void> {
        await eventBus.emit('CreateTripDialog:submit', { instance: this, data });
    }

    protected override get validationRules(): ValidationRule<CreateTripDialogFields>[] {
        return [
            {
                isInvalid: ({ title }) => title.length < 1 || title.length > 255,
                field: 'title',
                message: 'Название поездки должно иметь от 1 до 255 символов',
            },
            {
                isInvalid: ({ location }) => location.length < 1 || location.length > 50,
                field: 'title',
                message: 'Название места должно иметь от 1 до 50 символов',
            }
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
