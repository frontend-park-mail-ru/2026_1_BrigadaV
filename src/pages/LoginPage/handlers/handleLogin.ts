import { loginUser } from '@/entities/User';
import { appState } from '@/shared/config';
import { navigate } from '@/shared/router';
import { Toast } from '@/shared/ui/Toast';
import { AuthForm } from '@/widgets/AuthForm';

import { LoginFields, LoginPayload } from '../model/types';

export const handleLogin = async ({ instance, data }: { instance: AuthForm<LoginFields>, data: LoginPayload }) => {
    const loginRes = await loginUser(data);

    if (loginRes.ok) {
        appState.currentUser = loginRes.data;
        navigate('/');
    } else {
        switch (loginRes.status) {
        case 401:
            instance.setFieldError('password', 'Введен неверный логин или пароль');
            break;
        case 500:
            Toast({ message: 'Наблюдаются проблемы со входом. Попробуйте зайти позже' });
            break;
        }
    }
};
