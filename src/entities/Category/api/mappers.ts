import { Category } from '../model/types';
import { CategoryDTO } from './types';

export const mapCategory = (dto: CategoryDTO): Category => ({
    id: dto.id,
    name: dto.name,
    description: dto.description,
});
