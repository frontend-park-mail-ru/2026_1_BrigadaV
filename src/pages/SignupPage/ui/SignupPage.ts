import styles from './style.module.scss';

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
            className: styles['main__form'],
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
                    autocomplete: 'nickname',
                    placeholder: 'anna parr',
                    maxlength: 50,
                    minlength: 3,
                },
            },
            {
                id: 'login-input',
                label: 'Введите почту',
                type: 'text',
                attributes: {
                    autocomplete: 'email',
                    name: 'login',
                    placeholder: 'myemail@gmail.com',
                    maxlength: 50,
                },
            },
            {
                id: 'password-input',
                label: 'Введите пароль',
                type: 'password',
                note: 'Пароль должен содержать строчные и прописные буквы латинского алфавита, а также цифры',
                attributes: {
                    name: 'password',
                    placeholder: '********',
                    maxlength: 50,
                },
                rightIcon: '/icons/eye.svg',
                onRightIconClick: togglePasswordVisibility,
            },
            {
                id: 'password-repeat-input',
                label: 'Повторите пароль',
                type: 'password',
                attributes: {
                    name: 'password-repeat',
                    placeholder: '********',
                    maxlength: 50,
                },
                rightIcon: '/icons/eye.svg',
                onRightIconClick: togglePasswordVisibility,

            }],
            onSubmit: handleSubmit
        });
    }

    public render(): HTMLElement {
        this.element = document.createElement('div');
        const html = template({ styles });

        this.element.classList.add(styles['signup-page']);
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

    public destroy(): void { }
}
