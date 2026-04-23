import { Review } from '../model/types';
import { ReviewDTO } from './types';

export const mapReview = (dto: ReviewDTO): Review => ({
    id: dto.id,
    author: dto.author,
    title: dto.title,
    rating: dto.rating,
    content: dto.content,
    createdAt: new Date(dto.createdAt),
});
