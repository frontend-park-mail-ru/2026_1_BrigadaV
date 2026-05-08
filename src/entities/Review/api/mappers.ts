import { mapUserSummary } from '@/entities/User';

import { Review } from '../model/types';
import { ReviewDTO } from './types';

export const mapReview = (dto: ReviewDTO): Review => ({
    ...dto,
    author: mapUserSummary(dto.author),
    createdAt: new Date(dto.createdAt),
});
