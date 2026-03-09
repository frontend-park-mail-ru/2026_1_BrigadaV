import template from './RegistrationForm.hbs?compiled';
import './style.scss';

import { Field } from '@/shared/ui/Field';


export const RegistrationForm = async (props) => {
    return template({
        nicknameField: Field({
            className: 'registration-form__field',
            id: 'nickname-input',
            label: 'Введите ник',
            type: 'login',
            attributes: {
                name: 'nickname',
                placeholder: 'Ник',
            },
            hasIcon: false,
        }),
        loginField: Field({
            className: 'registration-form__field',
            id: 'login-input',
            label: 'Введите почту',
            type: 'email',
            autocomplete: 'email',
            attributes: {
                name: 'login',
                placeholder: 'Почта',
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
