import template from './RegistrationForm.hbs?compiled';
import './style.scss';

import { Field } from '@/shared/ui/Field';


export const RegistrationForm = async (props) => {
    return template({
        loginField: Field({
            className: 'registration-form__field',
            id: 'login-input',
            label: 'Введите логин',
            type: 'email',
            autocomplete: 'email',
            attributes: {
                name: 'login',
                placeholder: 'Логин',
            },
            hasIcon: false,
        }),
        passwordField: Field({
            className: 'registration-form__field',
            id: 'password-input',
            label: 'Введите пароль',
            type: 'password',
            autocomplete: 'current-password',
            attributes: {
                name: 'password',
                placeholder: 'Пароль',
            },
            hasIcon: true,
            iconPath: '/icons/eye.svg'
        }),
        password_repeatField: Field({
            className: 'registration-form__field',
            id: 'password-input',
            label: 'Повторите пароль',
            type: 'current-password',
            autocomplete: 'email',
            attributes: {
                name: 'password',
                placeholder: 'Пароль',
            },
            hasIcon: true,
            iconPath: '/icons/eye.svg'
        }),
        ...props
    });
}
