import './style.scss';

import { eventBus, validateAvatar, validateNickname } from '@/shared/lib';
import { BaseForm } from '@/shared/lib/component/BaseForm';
import { ValidationRule } from '@/shared/model';
import { Field, Textarea } from '@/shared/ui';
import { ConfirmPopup } from '@/shared/ui/ConfirmPopup';
import { ImageInput } from '@/shared/ui/ImageInput';
import { stringToElement } from '@/shared/utils';

import { SettingsFields, SettingsModalProps } from '../model/types';
import template from './SettingsModal.hbs?compiled';

export class SettingsModal extends BaseForm<SettingsFields, HTMLDialogElement> {
    private get user() {
        return this.props.user;
    }

    constructor(private props: SettingsModalProps) {
        super();
        this.children = {
            avatar: new ImageInput({
                id: 'avatar-upload',
                name: 'avatar',
                src: this.props.user.avatar,
                maxSizeMb: 10,
                className: 'settings__avatar'
            }),

            nickname: new Field({
                id: 'nickname-input',
                label: 'Никнейм',
                type: 'text',
                attributes: {
                    name: 'nickname',
                    value: this.user.nickname,
                    maxlength: 50,
                    minlength: 3,
                    placeholder: 'Никнейм',
                    required: '',
                }
            }),

            login: new Field({
                id: 'login-input',
                label: 'Почта',
                type: 'email',
                note: 'В данный момент изменить почту невозможно',
                attributes: {
                    name: 'login',
                    value: this.user.login || '',
                    maxlength: 50,
                    placeholder: 'Почта',
                    disabled: '',
                }
            }),

            // password: new Field({
            //     id: 'password-input',
            //     label: 'Новый пароль',
            //     type: 'password',
            //     note: 'В данный момент изменить пароль невозможно',
            //     attributes: {
            //         name: 'password',
            //         maxlength: 50,
            //         placeholder: '*'.repeat(10),
            //         readonly: '',
            //     },
            //     rightIcon: '/icons/eye.svg',
            //     onRightIconClick: togglePasswordVisibility,
            // }),

            // 'password-repeat': new Field({
            //     id: 'password-repeat-input',
            //     label: 'Повторите новый пароль',
            //     type: 'password',
            //     attributes: {
            //         name: 'password-repeat',
            //         maxlength: 50,
            //         placeholder: '*'.repeat(10),
            //         readonly: '',
            //     },
            //     rightIcon: '/icons/eye.svg',
            //     onRightIconClick: togglePasswordVisibility,
            // }),

            city: new Field({
                id: 'city-input',
                label: 'Город',
                type: 'text',
                attributes: {
                    name: 'city',
                    maxlength: 150,
                    placeholder: 'Поиск',
                    value: this.user.city || '',
                },
                leftIcon: '/icons/search.svg',
            }),

            about: new Textarea({
                id: 'about-textarea',
                value: this.user.about,
                label: 'О себе',
                attributes: {
                    name: 'about',
                    maxlength: 1000,
                    placeholder: 'Напишите подробнее о себе',
                },
            }),
        };
    }

    protected override get validationRules(): ValidationRule<SettingsFields>[] {
        return [
            {
                isInvalid: ({ avatar }) => avatar.size > 0 && !validateAvatar(avatar),
                field: 'avatar',
                message: 'Аватар должен быть изображением меньше 10Мб',
            },
            {
                isInvalid: ({ nickname }) => !validateNickname(nickname ?? ''),
                field: 'nickname',
                message: 'Ник должен быть длиной от 3 до 50 символов',
            },
            {
                isInvalid: ({ about }) => Boolean(about && about.length > 1000),
                field: 'about',
                message: 'Описание профиля не может превышать 1000 символов',
            },
            // {
            // TODO wait for backend to update their API to return user login
            //     isInvalid: !validateEmail(login ?? ''),
            //     field: 'login',
            //     message: 'Некорректный формат email',
            // },
        ];
    }

    protected override initListeners(): void {
        super.initListeners();
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

    protected override handleSubmit = async (data: SettingsFields): Promise<void> => {
        const confirmed = await ConfirmPopup({
            prompt: 'Вы уверены, что хотите сохранить изменения?',
            cancelText: 'Нет',
            confirmText: 'Да, сохранить'
        });

        if (confirmed) {
            await eventBus.emit('SettingsModal:submit', { instance: this, data });
        }
    };

    public close() {
        this.element?.close();
    }

    protected override _render(): HTMLDialogElement {
        return stringToElement<HTMLDialogElement>(template({
            ...this.props,
            fields: Object.keys(this.children),
        }));
    }
}
