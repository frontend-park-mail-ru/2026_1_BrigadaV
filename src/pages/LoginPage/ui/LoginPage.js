import template from './LoginPage.hbs?compiled';
import './style.scss';

import { Header } from '@/widgets/Header';
import { AuthForm } from '@/widgets/AuthForm';
import { handleLogin } from '../handlers/loginHandler';

export const LoginPage = async (appState) => {
    const page = document.createElement('div');

    const html = template({
        header: Header({
            user: appState.currentUser,
            authPrompt: {
                prompt: 'Ещё нет аккаунта?',
                href: '/sign-up',
                buttonText: 'Регистрация'
            }
        }),
        authForm: await AuthForm({
            className: 'log-in__form',
            submitText: 'Войти',
            redirectText: 'Создать аккаунт',
            redirectHref: '/sign-up'

        })
    });

    page.classList.add('page-wrapper');
    page.innerHTML = html;

    const form = page.querySelector('.log-in__form');
    if (form) {
        form.addEventListener('submit', (event) => handleLogin(event, appState));
    }

    return page;
}
