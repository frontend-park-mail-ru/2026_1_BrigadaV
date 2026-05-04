import { request } from '@/shared/api';
import { Category } from '../model/types';
import { mapCategory } from './mappers';
import { CategoryDTO } from './types';

export const getCategories = async (): Promise<Category[]> => {
    const dto = await request<CategoryDTO[]>('/categories', {
        method: 'GET',
    });

    if (!dto) return [];

    return dto.map(mapCategory);
};
