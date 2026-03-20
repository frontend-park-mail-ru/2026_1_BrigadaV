import './style.scss';

import { togglePasswordVisibility } from '@/shared/lib';
import { AppState, IPage } from '@/shared/model';
import { AuthForm } from '@/widgets/AuthForm';
import { Header } from '@/widgets/Header';

import { handleSubmit } from '../handlers/handleSignup';
import template from './SignupPage.hbs?compiled';

export class SignupPage implements IPage {
    private element?: HTMLElement;
    private header?: Header;
    private registerForm?: AuthForm;

    constructor(appState: AppState) {
        this.header = new Header({
            userSessionProps: {
                user: appState.currentUser,
                authPrompt: {
                    prompt: 'Уже есть аккаунт?',
                    href: '/login',
                    buttonText: 'Войдите'
                }
            }
        });
        this.registerForm = new AuthForm({
            className: 'sign-up__form',
            title: 'Регистрация',
            submitText: 'Создать аккаунт',
            redirectText: 'Войти',
            redirectHref: '/login',
            fields: [{
                id: 'nickname-input',
                label: 'Введите никнейм',
                type: 'login',
                attributes: {
                    name: 'nickname',
                    placeholder: 'Никнейм',
                    maxlength: 20,
                },
            },
            {
                id: 'login-input',
                label: 'Введите почту',
                type: 'text',
                attributes: {
                    autocomplete: 'email',
                    name: 'login',
                    placeholder: 'Почта',
                    maxlength: 50,
                },
            },
            {

                id: 'password-input',
                label: 'Введите пароль',
                type: 'password',
                attributes: {
                    name: 'password',
                    placeholder: 'Пароль',
                    maxlength: 50,
                },
                iconPath: '/icons/eye.svg',
                onIconClick: togglePasswordVisibility,
            },
            {
                id: 'password-repeat-input',
                label: 'Повторите пароль',
                type: 'password',
                attributes: {
                    name: 'password-repeat',
                    placeholder: 'Пароль',
                    maxlength: 50,
                },
                iconPath: '/icons/eye.svg',
                onIconClick: togglePasswordVisibility,

            }],
            onSubmit: handleSubmit
        });
    }

    public render(): HTMLElement {
        this.element = document.createElement('div');
        const html = template();

        this.element.classList.add('page-wrapper');
        this.element.innerHTML = html;

        if (this.header) {
            this.element.querySelector('[data-slot="header"]')
                ?.replaceWith(this.header.render());
        }

        if (this.registerForm) {
            this.element.querySelector('[data-slot="register-form"]')
                ?.replaceWith(this.registerForm.render());
        }

        return this.element;
    }

    public destroy(): void {
        if (this.header) {
            this.header.destroy();
        }
    }
}
