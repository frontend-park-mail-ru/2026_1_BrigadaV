import { Place } from '@/entities/Place/model/types';
import { IComponent } from '@/shared/model';

export type PlaceSearchItemProps = {
    place: Pick<Place, 'id' | 'name' | 'country' | 'image'>;
};
