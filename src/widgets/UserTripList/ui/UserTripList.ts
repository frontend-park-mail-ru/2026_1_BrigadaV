import './style.scss';

import { mapTrip, TripCard } from '@/entities/Trip';
import { AbstractList } from '@/shared/ui/AbstractList';

import { UserTripListProps } from '../model/types';
import { API } from '@/shared/api';
import { Trip } from '@/entities/Trip/model/types';

export class UserTripList extends AbstractList<TripCard, UserTripListProps> {
    constructor(props: UserTripListProps) {
        super(props);
        this.element.classList.add('trip-list');
    }

    protected async loadData(): Promise<TripCard[]> {
        try {
            const tripData = await API.getUserTripList();
            return tripData.map((tripRaw) => new TripCard({trip: mapTrip(tripRaw)}))
        } catch (error) {
            console.error(error);
        }

        return [];
    }

    public addTrip(position: InsertPosition, trip: Trip): void {
        const newCard = new TripCard({ trip });
        const li = this.renderItem(newCard);
        this.element.insertAdjacentElement(position, li);
    }

    public updateTrip(tripId: number, parameters): void {
        const itemToUpdate = this.element.querySelector(`[data-id="${tripId}"]`)?.closest('.trip-list__item');

        if (!itemToUpdate) return;

        const newCard = new TripCard({ trip: parameters });
        const li = this.renderItem(newCard);
        itemToUpdate.replaceWith(li);
    }

    public removeTrip(tripId: number): void {
        const itemToRemove = this.element.querySelector(`[data-id="${tripId}"]`)?.closest('.trip-list__item');

        if (itemToRemove) {
            itemToRemove.remove();
        }
    }

    protected renderItem(item: TripCard): HTMLElement {
        const li = document.createElement('li');
        li.classList.add('trip-list__item');
        li.appendChild(item.render());

        return li;
    }
}
