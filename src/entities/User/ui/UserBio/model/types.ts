import { User } from '@/entities/User/model/types';

export type UserBioProps = {
    user: Pick<User, 'nickname' | 'about' | 'avatar' | 'city' | 'country'>;
};
