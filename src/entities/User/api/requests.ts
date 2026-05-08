import { ApiResponse, request } from '@/shared/api';

import { User, UserAuth } from '../model/types';
import { mapUser, mapUserAuth } from './mappers';
import {
    LoginDTO,
    LoginRequest,
    RegisterDTO,
    RegisterRequest,
    UpdateRequest,
    UserDTO
} from './types';

export const registerUser = async (data: RegisterRequest): Promise<ApiResponse<UserAuth>> => {
    const res = await request<RegisterDTO>('/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (!res.ok) return res;
    return { ...res, data: mapUserAuth(res.data) };
};

export const loginUser = async (data: LoginRequest): Promise<ApiResponse<UserAuth>> => {
    const res = await request<LoginDTO>('/login', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (!res.ok) return res;
    return { ...res, data: mapUserAuth(res.data) };
};

export const logoutUser = async (): Promise<ApiResponse<void>> => {
    return await request('/logout', {
        method: 'POST',
    });
};

export const authMe = async (): Promise<ApiResponse<UserAuth>> => {
    const res = await request<LoginDTO>('/user/me', { method: 'GET' });

    if (!res.ok) return res;
    return { ...res, data: mapUserAuth(res.data) };
};

export const fetchMe = async (): Promise<ApiResponse<User>> => {
    const res = await request<UserDTO>('/profile', { method: 'GET' });

    if (!res.ok) return res;
    return { ...res, data: mapUser(res.data) };
};

export const uploadAvatar = async (avatar: File): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('avatar', avatar);

    const res = await request<UserDTO>('/profile/avatar', {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) return res;
    if (!res.data.avatar_url) {
        return { ok: false, error: 'Сервер не вернул URL аватара', status: res.status };
    }

    return { ...res, data: res.data.avatar_url };
};

export const updateUser = async (data: UpdateRequest): Promise<ApiResponse<User>> => {
    const res = await request<UserDTO>('/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
    });

    if (!res.ok) return res;

    return { ...res, data: mapUser(res.data) };
};
