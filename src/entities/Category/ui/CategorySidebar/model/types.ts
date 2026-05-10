import { Category } from "@/entities/Category/model/types";

export type CategorySidebarProps = {
    categories: Pick<Category, 'id' | 'name'>[];
    activeIds?: number[];
}
