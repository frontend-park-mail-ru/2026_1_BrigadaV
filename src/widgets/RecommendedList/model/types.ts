import { Place } from "@/entities/Place";

export type RecommendedListProps = {
    className?: string;
    authorized: boolean;
    places: Place[];
}
