import { UserSummary } from '@/entities/User';

export type Review = {
    id: number;
    author: UserSummary;
    title: string;
    content: string;
    rating: number;
    createdAt: Date;
}
