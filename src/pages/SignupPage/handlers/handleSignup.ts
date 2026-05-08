import { registerUser } from '@/entities/User';
import { ApiError } from '@/shared/api';
import { appState } from '@/shared/config';
import { validateEmail, validateNickname, validatePassword } from '@/shared/lib';
import { navigate } from '@/shared/router';
import { Toast } from '@/shared/ui/Toast';
import { AuthForm } from '@/widgets/AuthForm';

import { SignUpPayload } from '../model/types';

export const handleSignup = async ({ instance, data }: { instance: AuthForm, data: SignUpPayload }) => {
    const { nickname, login, password, 'password-repeat': passwordRepeat } = data;

    const rules = [
        {
            check: validateNickname(nickname),
            field: 'nickname',
            message: 'Ник должен быть длиной от 3 до 50 символов',
        },
        {
            check: validateEmail(login),
            field: 'login',
            message: 'Некорректный формат email',
        },
        {
            check: validatePassword(password),
            field: 'password',
            message: 'Некорректный формат пароля',
        },
        {
            check: password === passwordRepeat,
            field: 'password-repeat',
            message: 'Пароли не совпадают',
        },
    ]

    const failures = rules.filter(rule => !rule.check);

    if (failures.length > 0) {
        failures.forEach(({ field, message }) => instance.setFieldError(field, message));
        return;
    }

    const registerRes = await registerUser(data);

    if (registerRes.ok) {
        appState.currentUser = registerRes.data;
        navigate('/');
    } else {
        console.log(registerRes);
    }
};
