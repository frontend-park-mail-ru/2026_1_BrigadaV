import { loginUser } from '@/entities/User';
import { appState } from '@/shared/config';
import { navigate } from '@/shared/router';
import { AuthForm } from '@/widgets/AuthForm';

import { LoginPayload } from '../model/types';

export const handleLogin = async ({ instance, data }: { instance: AuthForm, data: LoginPayload }) => {
    const loginRes = await loginUser(data);

    if (loginRes.ok) {
        appState.currentUser = loginRes.data;
        navigate('/');
    } else {
    }
};
