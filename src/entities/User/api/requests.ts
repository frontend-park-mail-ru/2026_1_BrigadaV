import { request } from '@/shared/api';

import { User, UserAuth } from '../model/types';
import { mapUser, mapUserAuth } from './mappers';
import {
    LoginDTO, LoginRequest, RegisterDTO, RegisterRequest, UpdateRequest, UserDTO
} from './types';

export const registerUser = async (data: RegisterRequest): Promise<UserAuth> => {
    const dto = await request<RegisterDTO>('/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    return mapUserAuth(dto!);
};

export const loginUser = async (data: LoginRequest): Promise<UserAuth> => {
    const dto = await request<LoginDTO>('/login', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    return mapUserAuth(dto!);
};

export const logoutUser = async (): Promise<null> => {
    return await request('/logout', {
        method: 'POST',
    });
};

export const authMe = async (): Promise<UserAuth | null> => {
    const dto = await request<LoginDTO>('/user/me', {
        method: 'GET'
    });

    if (!dto) return null;

    return mapUserAuth(dto);
};

export const fetchMe = async (): Promise<User> => {
    const dto = await request<UserDTO>('/profile', {
        method: 'GET'
    });

    if (!dto) throw new Error('Couldn\'t fetch current user');

    return mapUser(dto);
};

export const uploadAvatar = async (avatar: File): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', avatar);

    const dto = await request<UserDTO>('/profile/avatar', {
        method: 'POST',
        body: formData,
    });

    if (!dto?.avatar_url) throw new Error('Could\'t upload avatar');

    return dto.avatar_url;
};

export const updateUser = async (data: UpdateRequest): Promise<User> => {
    const dto = await request<UserDTO>('/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
    });

    if (!dto) throw new Error('Couldn\'t update current user');

    return mapUser(dto);
};
