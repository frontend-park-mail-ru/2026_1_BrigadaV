import { UserDTO } from '@/shared/api';

import { User } from '../model/types';

export const mapUser = (userData: UserDTO): User => {
    return {
        id: userData.id,
        nickname: userData.nickname,
        avatar: userData.avatar_url,
        country: userData.country,
        city: userData.city,
        about: userData.about,
        hasReviews: userData.hasReviews,
        createdAt: new Date(userData.createdAt),
    };
};
