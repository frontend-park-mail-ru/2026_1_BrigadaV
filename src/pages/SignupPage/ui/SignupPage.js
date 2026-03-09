import template from './SignupPage.hbs?compiled';
import './style.scss';

import { Header } from '@/widgets/Header';
import { RegistrationForm } from '@/widgets/RegistrationForm';
import { handleSignup } from '../handlers/signupHandler';

export const SignupPage = async (appState) => {
    const page = document.createElement('div');

    const html = template({
        header: Header({
            user: appState.currentUser,
            authPrompt: {
                prompt: 'Уже есть аккаунт?',
                href: '/login',
                buttonText: 'Войдите'
            }
        }),
        registrationForm: await RegistrationForm({
            className: 'log-in__form',
            submitText: 'Создать аккаунт',
            redirectText: 'Войти',
            redirectHref: '/login'
        })
    });

    page.classList.add('page-wrapper');
    page.innerHTML = html;

    const form = page.querySelector('.sign-up__form');
    if (form) {
        form.addEventListener('submit', (event) => handleSignup(event, appState));
    }

    return page;
}
