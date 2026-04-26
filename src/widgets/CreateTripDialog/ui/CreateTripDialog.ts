import { eventBus, focusField } from '@/shared/lib';
import { BaseForm } from '@/shared/lib/component/BaseForm';
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
                    placeholder: 'например, хотите уехать жить в Лондон',
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
        this.element?.addEventListener('cancel', this.handleCommand);
    }

    private handleCommand = (event: Event): void => {
        if (!this.element) return;

        let command: string | undefined;

        switch (true) {
            case event.type === 'cancel':
                command = 'close';
                break;
            case 'command' in event:
                command = (event as CommandEvent).command;
                break;
            default: return;
        }

        event.preventDefault();

        switch (command) {
            case 'show-modal':
                this.element.showModal();
                this.element.classList.add(styles['is-visible']);
                break;

            case 'close':
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

    protected override handleSubmit(data: CreateTripDialogFields): void {
        eventBus.emit('CreateTripDialog:submit', { instance: this, data });
    }

    protected override _render(): HTMLDialogElement {
        return stringToElement<HTMLDialogElement>(template({
            ...this.props,
            fields: Object.keys(this.children),
            styles,
        }));
    }
}
