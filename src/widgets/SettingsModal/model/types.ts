import { UserAuth } from '@/entities/User';
import { User } from '@/entities/User/model/types';

type BaseSettings = {
    user: Pick<User & UserAuth, 'login' | 'nickname' | 'about' | 'city' | 'avatar'>;
};

export type SettingsFields = BaseSettings['user'];

export type SettingsModalProps = BaseSettings & {
    id: string;
}

export type SettingsModalPayload = SettingsFields;
