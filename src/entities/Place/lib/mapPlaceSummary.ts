import { PlaceSummaryDTO } from "@/shared/api";
import { PlaceSummary } from "../model/types";

export const mapPlaceSummary = (placeData: PlaceSummaryDTO): PlaceSummary => {
    return {
        id: placeData.id,
        name: placeData.name,
        description: placeData.description,
        rating: placeData.rating,
        image: placeData.image,
    }
}
