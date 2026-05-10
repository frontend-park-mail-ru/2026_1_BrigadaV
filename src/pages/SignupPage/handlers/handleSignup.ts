import { registerUser } from '@/entities/User';
import { appState } from '@/shared/config';
import { navigate } from '@/shared/router';
import { Toast } from '@/shared/ui/Toast';
import { AuthForm } from '@/widgets/AuthForm';

import { SignUpFields, SignUpPayload } from '../model/types';

export const handleSignup = async ({ instance, data }: { instance: AuthForm<SignUpFields>, data: SignUpPayload }) => {
    const registerRes = await registerUser(data);

    if (registerRes.ok) {
        appState.currentUser = registerRes.data;
        navigate('/');
    } else {
        Toast({ message: 'Наблюдаются проблемы с регистрацией. Попробуйте зайти позже' });
        // todo wait for backend to return json
    }
};
