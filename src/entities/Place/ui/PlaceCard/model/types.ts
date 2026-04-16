import { Place } from '@/entities/Place/model/types';
import { IComponent } from '@/shared/model';

export type PlaceCardProps = {
    place: Place;
    actionComponent?: IComponent;
}
