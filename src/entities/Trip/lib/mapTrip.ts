import { TripDTO } from "@/shared/api";
import { Trip } from "../model/types";

export const mapTrip = (tripData: TripDTO): Trip => {
    return {
        id: tripData.id,
        title: tripData.title,
        location: tripData.location.country,
        startDate: tripData.start_date ? new Date(tripData.start_date) : undefined,
        endDate: tripData.end_date ? new Date(tripData.end_date) : undefined,
        description: tripData.description,
        preview: tripData.preview,
    }
}
