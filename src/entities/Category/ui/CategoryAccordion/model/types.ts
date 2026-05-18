import { Category } from '@/entities/Category/model/types';

export type SingleCategoryItem = Pick<Category, 'id' | 'name'>

export type CategoryAccordionProps = {
    title: string;
    items: SingleCategoryItem[],
    activeIds?: number[];
}
