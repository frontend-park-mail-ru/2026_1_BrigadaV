import './style.scss';

import { getPlaces, Place, PlaceCard } from '@/entities/Place';
import { eventBus } from '@/shared/lib';
import { BaseList } from '@/shared/lib/component/BaseList';
import { IComponent } from '@/shared/model';
import { ToggleButton } from '@/shared/ui/ToggleButton';

import { PlaceTogglePayload, SelectPlaceListProps } from '../model/types';

export class PlaceSelectList extends BaseList<Place, SelectPlaceListProps> {
    protected override listClassName = 'select-place-list';
    protected override itemClassName = 'select-place-list__item';


    protected override async loadData(): Promise<Place[]> {
        try {
            const places = await getPlaces();
            const sortedPlaces = places.sort((a, b) => {
                const aAdded = this.props.addedPlaces.has(a.id) ? 1 : 0;
                const bAdded = this.props.addedPlaces.has(b.id) ? 1 : 0;
                return bAdded - aAdded;
            });
            return sortedPlaces;

        } catch { }

        return [];
    }

    protected override getItemId(item: Place): number {
        return item.id;
    }

    protected override createItemComponent(item: Place): IComponent {
        return new PlaceCard({
            place: item,
            action: new ToggleButton<PlaceTogglePayload>({
                isActive: this.props.addedPlaces.has(item.id),
                payload: { placeId: item.id },
                onToggle: (isActive, payload) => {
                    const event = isActive ? 'PlaceCard:add' : 'PlaceCard:remove';
                    eventBus.emit(event, { data: payload });
                }
            })
        });
    }
}
