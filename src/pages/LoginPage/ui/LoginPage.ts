import { togglePasswordVisibility } from '@/shared/lib';
import { BasePage } from '@/shared/lib/page/BasePage';
import { AppState } from '@/shared/model';
import { AuthForm } from '@/widgets/AuthForm';
import { Header } from '@/widgets/Header';

import { handleLogin } from '../handlers/handleLogin';
import template from './LoginPage.hbs?compiled';
import styles from './style.module.scss';

export class LoginPage extends BasePage {
    protected template = template;
    protected styles = styles;
    protected pageClassName = 'login-page';

    declare children: {
        header: Header;
        loginForm: AuthForm;
    };

    protected override get eventHandlers() {
        return {
            'auth:login': handleLogin,
        };
    }

    public static async create(appState: AppState): Promise<LoginPage> {
        const page = new LoginPage(appState);
        page.setupComponents();
        return page;
    }

    private setupComponents() {
        this.children = {
            header: new Header({
                user: this.appState.currentUser,
                authPrompt: {
                    prompt: 'Ещё нет аккаунта?',
                    href: '/sign-up',
                    buttonText: 'Регистрация'
                }
            }),

            loginForm: new AuthForm({
                className: styles['main__form'],
                submitEventName: 'auth:login',
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
            }),
        };
    }
}
