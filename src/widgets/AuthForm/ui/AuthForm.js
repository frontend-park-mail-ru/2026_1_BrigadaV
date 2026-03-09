import template from './AuthForm.hbs?compiled';
import './style.scss';

import { Field } from '@/shared/ui/Field';


export const AuthForm = async (props) => {
    return template({
        loginField: Field({
            className: 'auth-form__field',
            id: 'login-input',
            label: 'Введите почту',
            type: 'email',
            attributes: {
                name: 'login',
                placeholder: 'Почта',
                autocomplete: 'email',
            },
            hasIcon: false,
        }),
        passwordField: Field({
            className: 'auth-form__field',
            id: 'password-input',
            label: 'Введите пароль',
            type: 'password',
            attributes: {
                name: 'password',
                placeholder: 'Пароль',
                autocomplete: 'current-password',
            },
            hasIcon: true,
            iconPath: '/icons/eye.svg'
        }),
        ...props
    });
}
