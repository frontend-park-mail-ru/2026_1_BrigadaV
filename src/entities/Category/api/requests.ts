import { request } from "@/shared/api";
import { ApiResponse } from "@/shared/api/types";
import { Category } from "../model/types";
import { CategoryDTO } from "./types";
import { mapCategory } from "./mappers";

export const fetchPlaceCategories = async (): Promise<ApiResponse<Category[]>> => {
    const res = await request<CategoryDTO[]>('/categories', {
        method: 'GET',
    });

    if (!res.ok) return res;

    return {
        ...res,
        data: res.data.map(mapCategory)
    };
};
