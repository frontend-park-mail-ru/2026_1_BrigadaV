import './style.scss';

import { PlaceSummary } from '@/entities/Place/model/types';
import { PlacePlacard } from '@/entities/Place/ui/PlacePlacard';
import { BaseList } from '@/shared/lib/component/BaseList';
import { IComponent } from '@/shared/model';

import { TripPlaceListProps } from '../model/types';

export class TripPlaceList extends BaseList<PlaceSummary, TripPlaceListProps> {
    protected override listClassName = 'trip-place-list';
    protected override itemClassName = 'trip-place-list__item';

    protected async loadData() {
        return this.props.places;
    }

    protected override getItemId(item: PlaceSummary): number {
        return item.id;
    }

    protected override createItemComponent(item: PlaceSummary): IComponent {
        return new PlacePlacard({ place: item });
    }
}
