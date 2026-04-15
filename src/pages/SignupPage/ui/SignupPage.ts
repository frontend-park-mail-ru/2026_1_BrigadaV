import { togglePasswordVisibility } from '@/shared/lib';
import { AppState, IPage } from '@/shared/model';
import { injectComponents } from '@/shared/utils';
import { AuthForm } from '@/widgets/AuthForm';
import { Header } from '@/widgets/Header';

import { handleSubmit } from '../handlers/handleSignup';
import template from './SignupPage.hbs?compiled';
import styles from './style.module.scss';

export class SignupPage implements IPage {
    private element?: HTMLElement;
    private header?: Header;
    private registerForm?: AuthForm;

    private constructor(private appState: AppState) {}

    public static async create(appState: AppState): Promise<SignupPage> {
        const page = new SignupPage(appState);
        page.setupComponents();
        return page;
    }

    private setupComponents() {
        this.header = new Header({
            userSessionProps: {
                user: this.appState.currentUser,
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
                type: 'text',
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
                type: 'email',
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

        injectComponents(this.element, {
            'header': this.header,
            'register-form': this.registerForm,
        });

        return this.element;
    }

    public destroy(): void { }
}
