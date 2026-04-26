import { Place } from "@/entities/Place";
import { PlaceSearchItemProps } from "@/entities/Place/ui/PlaceSearchItem/model/types";

export type SearchBarProps = {
    className?: string;
    withButton?: boolean;
    placeholder: string;
    places: PlaceSearchItemProps['place'][],
}

export type SearchResult = {
    place: PlaceSearchItemProps['place'];
    positions?: Set<number>;
}
