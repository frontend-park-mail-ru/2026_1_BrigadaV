import './style.scss';

import { mapTrip, TripCard } from '@/entities/Trip';
import { AbstractList } from '@/shared/ui/AbstractList';

import { UserTripListProps } from '../model/types';
import { API } from '@/shared/api';

export class UserTripList extends AbstractList<TripCard, UserTripListProps> {
    constructor(props: UserTripListProps) {
        super(props);
        this.element.classList.add('trip-list');
    }

    protected async loadData(): Promise<TripCard[]> {
        try {
            const tripData = await API.getUserTripList(this.props.user.id);
            return tripData.map((tripRaw) => new TripCard({trip: mapTrip(tripRaw)}))
        } catch (error) {
            console.error(error);
        }

        return [];
    }

    protected renderItem(item: TripCard): HTMLElement {
        const li = document.createElement('li');
        li.classList.add('trip-list__item');
        li.appendChild(item.render());

        return li;
    }
}
