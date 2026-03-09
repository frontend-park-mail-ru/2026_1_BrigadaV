import template from './LoginPage.hbs?compiled';
import './style.scss';

import { Header } from '@/widgets/Header';
import { AuthForm } from '@/widgets/AuthForm'

export const LoginPage = async (appState) => {
    const page = document.createElement('div');

    const html = template({
        header: Header({ user: appState.currentUser }),
        authForm: await AuthForm({
            type: 'login',
            className: 'log-in__form'
        })
    });

    page.classList.add('page-wrapper');
    page.innerHTML = html;

    return page;
}
