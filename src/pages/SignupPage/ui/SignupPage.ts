import {
    togglePasswordVisibility,
    validateEmail,
    validateNickname,
    validatePassword
} from '@/shared/lib';
import { Callback } from '@/shared/lib/eventBus/eventBus';
import { BasePage } from '@/shared/lib/page/BasePage';
import { AppState, ValidationRule } from '@/shared/model';
import { AuthForm } from '@/widgets/AuthForm';
import { Header } from '@/widgets/Header';

import { handleSignup } from '../handlers/handleSignup';
import { SignUpFields } from '../model/types';
import template from './SignupPage.hbs?compiled';
import styles from './style.module.scss';

export class SignupPage extends BasePage {
    protected override template = template;
    protected override styles = styles;
    protected override pageClassName = 'signup-page';

    declare protected children: {
        header: Header;
        signupForm: AuthForm<SignUpFields>;
    };

    protected override createHandlers(): Record<string, Callback> {
        return {
            'auth:signup': handleSignup,
        };
    }

    private validationRules: ValidationRule<SignUpFields>[] = [
        {
            isInvalid: ({ nickname }) => !validateNickname(nickname),
            field: 'nickname',
            message: 'Ник должен иметь от 3 до 50 символов',
        },
        {
            isInvalid: ({ login }) => !validateEmail(login),
            field: 'login',
            message: 'Некорректный формат email',
        },
        {
            isInvalid: ({ password }) => !validatePassword(password),
            field: 'password',
            message: 'Некорректный формат пароля',
        },
        {
            isInvalid: ({ password, 'password-repeat': passwordRepeat }) => password !== passwordRepeat,
            field: 'password-repeat',
            message: 'Пароли не совпадают',
        },
    ];

    public static async create(appState: AppState): Promise<SignupPage> {
        const page = new SignupPage(appState);
        page.setupComponents();
        return page;
    }

    private setupComponents() {
        this.children = {
            header: new Header({
                user: this.appState.currentUser,
                authPrompt: {
                    prompt: 'Уже есть аккаунт?',
                    href: '/login',
                    buttonText: 'Войдите'
                }
            }),

            signupForm: new AuthForm({
                className: styles['main__form'],
                submitEventName: 'auth:signup',
                title: 'Регистрация',
                submitText: 'Создать аккаунт',
                redirectText: 'Войти',
                redirectHref: '/login',
                validationRules: this.validationRules,
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
                    note: 'Используйте строчные и прописные буквы латинского алфавита, а также цифры',
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
            })
        };
    }
}
