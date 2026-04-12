import { UserDTO } from '@/shared/api';

import { User } from '../model/types';

export const mapUser = (userData: UserDTO): User => {
    return {
        id: userData.id,
        nickname: userData.nickname,
        avatar: userData.avatar,
        country: userData.location.country,
        city: userData.location.name,
        about: userData.about,
        commentCount: userData.comment_count,
        createdAt: new Date(userData.created_at),
    };
};
