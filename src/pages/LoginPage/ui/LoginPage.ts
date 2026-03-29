import './style.scss';

import { togglePasswordVisibility } from '@/shared/lib';
import { AppState, IPage } from '@/shared/model';
import { AuthForm } from '@/widgets/AuthForm';
import { Header } from '@/widgets/Header';

import { handleSubmit } from '../handlers/handleLogin';
import template from './LoginPage.hbs?compiled';

export class LoginPage implements IPage {
    private element?: HTMLElement;
    private header?: Header;
    private loginForm?: AuthForm;

    constructor(appState: AppState) {
        this.header = new Header({
            userSessionProps: {
                user: appState.currentUser,
                authPrompt: {
                    prompt: 'Ещё нет аккаунта?',
                    href: '/sign-up',
                    buttonText: 'Регистрация'
                }
            }
        });

        this.loginForm = new AuthForm({
            className: 'log-in__form',
            title: 'Вход в аккаунт',
            submitText: 'Войти',
            redirectText: 'Создать аккаунт',
            redirectHref: '/sign-up',
            fields: [{
                id: 'login-input',
                label: 'Введите почту',
                type: 'text',
                attributes: {
                    name: 'login',
                    placeholder: 'myemail@gmail.com',
                    autocomplete: 'email',
                    maxlength: 50,
                },
            }, {
                id: 'password-input',
                label: 'Введите пароль',
                type: 'password',
                attributes: {
                    name: 'password',
                    placeholder: '********',
                    autocomplete: 'current-password',
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

        if (this.loginForm) {
            this.element.querySelector('[data-slot="auth-form"]')
                ?.replaceWith(this.loginForm.render());
        }

        return this.element;
    }

    public destroy(): void {
        if (this.header) {
            this.header.destroy();
        }
    }
}
