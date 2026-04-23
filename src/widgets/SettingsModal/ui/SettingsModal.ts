import './style.scss';

import { eventBus } from '@/shared/lib';
import { BaseForm } from '@/shared/lib/component/BaseForm';
import { Field, Textarea } from '@/shared/ui';
import { ConfirmPopup } from '@/shared/ui/ConfirmPopup';
import { ImageInput } from '@/shared/ui/ImageInput';
import { Toast } from '@/shared/ui/Toast';
import { stringToElement } from '@/shared/utils';

import { SettingsFields, SettingsModalProps } from '../model/types';
import template from './SettingsModal.hbs?compiled';

export class SettingsModal extends BaseForm<SettingsFields, HTMLDialogElement> {
    private avatarPreviewUrl?: string;

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
                    readonly: '',
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

    protected override initListeners(): void {
        super.initListeners();
        this.element?.addEventListener('command', this.handleOpen);
        this.element?.addEventListener('change', this.handleAvatarChange);
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
            eventBus.emit('SettingsModal:submit', { instance: this, data });
        }
    };

    private handleAvatarChange = (event: Event): void => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) return;

        if (target.name !== 'avatar' || !target.files?.[0]) return;

        const file = target.files[0];

        if (file.size > 10 * 1024 * 1024) {
            Toast({ message: 'Файл слишком большой! Лимит 10 Мб.', type: 'error' });
            target.value = '';
            return;
        }

        if (!file.type.startsWith('image/')) {
            Toast({ message: 'Известный формат изображения', type: 'error' });
            target.value = '';
            return;
        }

        if (this.avatarPreviewUrl) {
            URL.revokeObjectURL(this.avatarPreviewUrl);
        }

        this.avatarPreviewUrl = URL.createObjectURL(file);

        const previewImage = this.element?.querySelector('[data-ref="avatar"]') as HTMLImageElement;

        if (previewImage) {
            previewImage.src = this.avatarPreviewUrl;
            previewImage.classList.remove('avatar--default');
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

    protected override _destroy(): void {
        if (this.avatarPreviewUrl) URL.revokeObjectURL(this.avatarPreviewUrl);
    }
}
