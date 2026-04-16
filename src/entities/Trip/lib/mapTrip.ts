import { TripDTO } from "@/shared/api";
import { Trip } from "../model/types";

export const mapTrip = (tripData: TripDTO): Trip => {
    return {
        id: tripData.id,
        title: tripData.title,
        location: tripData.location,
        startDate: tripData.startDate ? new Date(tripData.startDate) : undefined,
        endDate: tripData.endDate ? new Date(tripData.endDate) : undefined,
        description: tripData.description,
        preview: tripData.preview,
        places: tripData.attractions ?? [],
    }
}
