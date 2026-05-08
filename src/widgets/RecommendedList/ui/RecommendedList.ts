import './style.scss';

import { PlaceCard } from '@/entities/Place';
import { fetchPlaces } from '@/entities/Place/api';
import { Place } from '@/entities/Place/model/types';
import { BaseList } from '@/shared/lib/component/BaseList';
import { IComponent } from '@/shared/model';
import { LikeButton } from '@/shared/ui';
import { getRandomElements } from '@/shared/utils';

import { RecommendedListProps } from '../model/types';

export class RecommendedList extends BaseList<Place, RecommendedListProps> {
    protected listClassName = 'recommended-list';
    protected itemClassName = 'recommended__item';

    protected async loadData() {
        const placesRes = await fetchPlaces();
        if (placesRes.ok) {
            return getRandomElements(placesRes.data, 8);
        }

        return [];
    }

    protected getItemId(place: Place): number {
        return place.id;
    }

    protected createItemComponent(place: Place): IComponent {
        return new PlaceCard({
            place,
            ...(this.props.authorized && {
                action: new LikeButton({ isLiked: place.isLiked })
            })
        });
    }
}
