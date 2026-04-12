import './style.scss';

import { togglePasswordVisibility } from '@/shared/lib';
import { Field, Textarea } from '@/shared/ui';
import { injectComponents, stringToElement } from '@/shared/utils';
import { validateEmail, validatePassword } from '@/shared/lib';

import { SettingsModalFormData, SettingsModalProps } from '../model/types';
import template from './SettingsModal.hbs?compiled';
import { ConfirmPopup } from '@/shared/ui/ConfirmPopup';

export class SettingsModal {
    private element?: HTMLElement;
    private fields: Record<string, Field | Textarea> = {};
    private avatarPreviewUrl?: string;

    constructor(private props: SettingsModalProps) {
        this.fields['nickname'] = new Field({
            id: 'nickname-input',
            label: 'Никнейм',
            type: 'text',
            attributes: {
                name: 'nickname',
                value: props.userAuth.nickname,
                maxlength: 50,
                minlength: 3,
                placeholder: 'Никнейм',
            }
        });

        this.fields['email'] = new Field({
            id: 'email-input',
            label: 'Почта',
            type: 'text',
            attributes: {
                name: 'email',
                value: props.userAuth.login,
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
                value: this.props.user.about || '',
            },
        });
    }

    private initListeners(): void {
        this.element?.addEventListener('command', this.handleOpen);
        this.element?.addEventListener('submit', this.handleSubmit);
        this.element?.addEventListener('change', this.handleAvatarChange);
    }

    // TODO add confirmation on form submit
    private handleOpen = (ev: Event) => {
        const event = ev as CommandEvent;
        const source = event.source;

        if (!this.element || !(source instanceof HTMLElement)) return;

        if (event.command === 'show-modal' && source.dataset.focusField) {
            const focusInput = this.element.querySelector<HTMLElement>(`[name="${source.dataset.focusField}"]`);
            setTimeout(() => focusInput?.focus(), 0);
        }
    };

    private handleAvatarChange = (event: Event): void => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) return;

        if (target.name !== 'avatar' || !target.files?.[0]) return;

        const file = target.files[0];

        if (file.size > 10 * 1024 * 1024) {
            // TODO make a toast
            alert("Файл слишком большой! Лимит 10 Мб.");
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
    }

    private handleSubmit = async (event: Event): Promise<void> => {
        const target = event.target;
        if (!(target instanceof HTMLFormElement)) {
            return;
        }

        event.preventDefault();
        this.clearErrors();

        const confirmed = await ConfirmPopup({
            prompt: "Вы уверены, что хотите сохранить изменения?",
            cancelText: "Нет",
            confirmText: "Да, сохранить"
        });

        if (confirmed) {
            const formData = new FormData(target);
            await this.props.onSubmit(this, formData);
        }
    }

    public clearErrors(): void {
        Object.values(this.fields).forEach((field) => field.clearError());
    }

    public setFieldError(field: string, message: string): void {
        if (field in this.fields) {
            this.fields[field].setError(message);
        }
    }

    public render(): HTMLElement {
        this.element = stringToElement(template({
            ...this.props,
            fields: Object.keys(this.fields),
        }));

        injectComponents(this.element, this.fields);

        this.initListeners();
        return this.element;
    }

    public destroy(): void {
        if (this.avatarPreviewUrl) URL.revokeObjectURL(this.avatarPreviewUrl);
    }
}
