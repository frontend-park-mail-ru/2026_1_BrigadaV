import { SingleCategoryItem } from '@/entities/Category/ui/CategoryAccordion/model/types';

export type FiltersProps = {
    categories: SingleCategoryItem[],
}

export type FiltersState = {
    categoryIds: number[];
    ratingIds: number[];
    reviewCount: number;
}
