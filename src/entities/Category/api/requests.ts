import { request } from "@/shared/api";
import { Category } from "../model/types";
import { CategoryDTO } from "./types";
import { mapCategory } from "./mappers";

export const fetchPlaceCategories = async (): Promise<Category[]> => {
    const dto = await request<CategoryDTO[]>('/categories', {
        method: 'GET',
    });

    if (!dto) return [];

    return dto.map(mapCategory);
};
