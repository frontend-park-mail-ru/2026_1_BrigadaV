import './style.scss';

import { togglePasswordVisibility } from '@/shared/lib';
import { Field } from '@/shared/ui';
import { Textarea } from '@/shared/ui';
import { injectComponents, stringToElement } from '@/shared/utils';

import { SettingsModalProps } from '../model/types';
import template from './SettingsModal.hbs?compiled';

export class SettingsModal {
    private element?: HTMLElement;
    private fields: Record<string, Field | Textarea> = {};

    constructor(private props: SettingsModalProps) {
        this.fields['nickname'] = new Field({
            id: 'nickname-input',
            label: 'Никнейм',
            type: 'text',
            attributes: {
                name: 'nickname',
                value: props.user.nickname,
                maxlength: 20,
                placeholder: 'Никнейм',
            }
        });

        this.fields['email'] = new Field({
            id: 'email-input',
            label: 'Почта',
            type: 'text',
            attributes: {
                name: 'email',
                value: props.user.login,
                maxlength: 50,
                placeholder: 'Почта',
            }
        });

        this.fields['password'] = new Field({
            id: 'password-input',
            label: 'Новый пароль',
            type: 'password',
            attributes: {
                name: 'password',
                maxlength: 50,
                placeholder: '*'.repeat(10),
            },
            rightIcon: '/icons/eye.svg',
            onRightIconClick: togglePasswordVisibility,
        });

        this.fields['password-repeat'] = new Field({
            id: 'password-repeat-input',
            label: 'Повторите новый пароль',
            type: 'password',
            attributes: {
                name: 'password-repeat',
                maxlength: 50,
                placeholder: '*'.repeat(10),
            },
            rightIcon: '/icons/eye.svg',
            onRightIconClick: togglePasswordVisibility,
        });

        this.fields['city'] = new Field({
            id: 'city-input',
            label: 'Город',
            type: 'text',
            attributes: {
                name: 'city',
                autocomplete: 'address-level2',
                maxlength: 150,
                placeholder: 'Поиск',
            },
            leftIcon: '/icons/search.svg',
        });

        this.fields['about'] = new Textarea({
            id: 'about-textarea',
            label: 'О себе',
            attributes: {
                name: 'about',
                maxlength: 1000,
                placeholder: 'Напишите подробнее о себе',
            },
        });
    }

    private initListeners(): void {
        this.element?.addEventListener('command', this.handleOpen);
    }

    private handleOpen = (ev: Event) => {
        const event = ev as CommandEvent;
        const source = event.source;

        if (!this.element || !(source instanceof HTMLElement)) return;

        if (event.command === 'show-modal' && source.dataset.focusField) {
            const focusInput = this.element.querySelector<HTMLElement>(`[name="${source.dataset.focusField}"]`);
            setTimeout(() => focusInput?.focus(), 0);
        }
    };

    public render(): HTMLElement {
        this.element = stringToElement(template({
            ...this.props,
            fields: Object.keys(this.fields),
        }));

        injectComponents(this.element, this.fields);

        this.initListeners();
        return this.element;
    }
}
