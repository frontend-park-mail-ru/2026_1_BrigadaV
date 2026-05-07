import { Category } from "@/entities/Category/model/types";

export type CategoryAccordionProps = {
    categories: Pick<Category, 'id' | 'name'>[];
}
