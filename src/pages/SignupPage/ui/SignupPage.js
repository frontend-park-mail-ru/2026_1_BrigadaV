import template from './SignupPage.hbs?compiled';
import './style.scss';

import { Header } from '@/widgets/Header';
import { RegisterForm } from '@/widgets/RegisterForm';


export class SignupPage {
    constructor(appState) {
        this.header = new Header({
            user: appState.currentUser,
            authPrompt: {
                prompt: 'Уже есть аккаунт?',
                href: '/login',
                buttonText: 'Войдите'
            }
        });

        this.registerForm = new RegisterForm({
            className: 'sign-up__form',
            submitText: 'Создать аккаунт',
            redirectText: 'Войти',
            redirectHref: '/login'
        });
    }

    render() {
        this.element = document.createElement('div');
        const html = template();

        this.element.classList.add('page-wrapper');
        this.element.innerHTML = html;

        this.element.querySelector('[data-slot="header"]')
            .replaceWith(this.header.render());
        this.element.querySelector('[data-slot="register-form"]')
            .replaceWith(this.registerForm.render());

        return this.element;
    }

    destroy() {
        if (this.header) {
            this.header.destroy();
        }
    }
}
