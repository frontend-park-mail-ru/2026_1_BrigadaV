import { Place } from '@/entities/Place/model/types';

export type PlaceSearchItemProps = {
    place: Pick<Place, 'id' | 'name' | 'country' | 'image'>;
    positions?: Set<number>;
};
