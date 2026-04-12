import { UserAuth } from '@/entities/User';
import { User } from '@/entities/User/model/types';
import { SettingsModal } from '../ui/SettingsModal';

export type SettingsModalProps = {
    id: string;
    user: User;
    userAuth: UserAuth;
    onSubmit: (instance: SettingsModal, data: FormData) => Promise<void>;
}
