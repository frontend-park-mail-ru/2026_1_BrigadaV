import template from './LoginPage.hbs?compiled';
import './style.scss';

import { Header } from '@/widgets/Header';
import { AuthForm } from '@/widgets/AuthForm';

export class LoginPage {
    constructor(appState) {
        this.element = document.createElement('div');
        const html = template();

        this.element.classList.add('page-wrapper');
        this.element.innerHTML = html;

        this.header = new Header({
            user: appState.currentUser,
            authPrompt: {
                prompt: 'Ещё нет аккаунта?',
                href: '/sign-up',
                buttonText: 'Регистрация'
            }
        })

        this.authForm = new AuthForm({
            className: 'log-in__form',
            submitText: 'Войти',
            redirectText: 'Создать аккаунт',
            redirectHref: '/sign-up'
        });

        this.element.querySelector('[data-slot="header"]')
            .replaceWith(this.header.render());

        this.element.querySelector('[data-slot="auth-form"]')
            .replaceWith(this.authForm.render());
    }

    render() {
        return this.element;
    }
}
