import { togglePasswordVisibility } from '@/shared/lib';
import { AppState, IPage } from '@/shared/model';
import { injectComponents } from '@/shared/utils';
import { AuthForm } from '@/widgets/AuthForm';
import { Header } from '@/widgets/Header';

import { handleSubmit } from '../handlers/handleLogin';
import template from './LoginPage.hbs?compiled';
import styles from './style.module.scss';

export class LoginPage implements IPage {
    private element?: HTMLElement;
    private header?: Header;
    private loginForm?: AuthForm;

    private constructor(private appState: AppState) {}

    public static async create(appState: AppState): Promise<LoginPage> {
        const page = new LoginPage(appState);
        page.setupComponents();
        return page;
    }

    private setupComponents() {
        this.header = new Header({
            userSessionProps: {
                user: this.appState.currentUser,
                authPrompt: {
                    prompt: 'Ещё нет аккаунта?',
                    href: '/sign-up',
                    buttonText: 'Регистрация'
                }
            }
        });

        this.loginForm = new AuthForm({
            className: styles['main__form'],
            title: 'Вход в аккаунт',
            submitText: 'Войти',
            redirectText: 'Создать аккаунт',
            redirectHref: '/sign-up',
            fields: [{
                id: 'login-input',
                label: 'Введите почту',
                type: 'email',
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
                rightIcon: '/icons/eye.svg',
                onRightIconClick: togglePasswordVisibility,
            }],
            onSubmit: handleSubmit
        });
    }

    public render(): HTMLElement {
        this.element = document.createElement('div');
        const html = template({ styles });

        this.element.classList.add(styles['login-page']);
        this.element.innerHTML = html;

        injectComponents(this.element, {
            'header': this.header,
            'auth-form': this.loginForm,
        });

        return this.element;
    }

    public destroy(): void { }
}
