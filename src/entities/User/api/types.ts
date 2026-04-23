import { User, UserAuth } from '../model/types';

export type LoginRequest = Pick<UserAuth, 'login'> & {
    password: string;
};

export type RegisterRequest = Pick<UserAuth, 'login' | 'nickname'> & {
    password: string;
};

export type UpdateRequest = Partial<Pick<User & UserAuth, 'login' | 'nickname' | 'avatar' | 'about' | 'city'>>

export type LoginDTO = {
    user_id: number;
    login: string;
    nickname: string;
    avatar_url: string;
};

export type RegisterDTO = {
    id: number;
    login: string;
    nickname: string;
    avatar_url: string;
    created_at: string;
    message?: string;
};

export type UserSummaryDTO = {
    id: number;
    nickname: string;
    avatar_url?: string,
}

export type UserDTO = UserSummaryDTO & {
    about?: string;
    country?: string;
    city?: string;
    hasReviews: boolean;
    createdAt: string;
}
