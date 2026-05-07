import { Category, CategorySummary } from "../model/types";
import { CategoryDTO, CategorySummaryDTO } from "./types";

export const mapCategory = (dto: CategoryDTO): Category => ({
    id: dto.ID,
    name: dto.Name,
    description: dto.Description,
    applicableTypes: dto.ApplicableTypes,
})

export const mapCategorySummary = (dto: CategorySummaryDTO): CategorySummary => ({
    ...dto,
})
