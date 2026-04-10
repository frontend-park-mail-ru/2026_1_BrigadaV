import styles from './style.module.scss';

import { Field } from '@/shared/ui';

import template from './CreateTripDialog.hbs?compiled';
import { CreateTripDialogProps } from '../model/types';
import { injectComponents, stringToElement } from '@/shared/utils';
import { focusField } from '@/shared/lib';

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

    private initListeners(): void {
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
                this.element.classList.remove(styles['is-visible']);

                const handleTransitionEnd = (e: TransitionEvent) => {
                    this.element!.close();
                };
                this.element.addEventListener('transitionend', handleTransitionEnd, { once: true });
                break;
        }
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
