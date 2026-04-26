import { Place } from '@/entities/Place/model/types';
import { IComponent } from '@/shared/model';

export type PlaceCardProps = {
    place: Omit<Place, 'id' | 'isLiked'>;
    action?: IComponent;
};
