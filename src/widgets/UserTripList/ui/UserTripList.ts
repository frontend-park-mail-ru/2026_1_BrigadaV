import './style.scss';

import { TripCard } from '@/entities/Trip';
import { getUserTripList } from '@/entities/Trip/api/requests';
import { Trip } from '@/entities/Trip/model/types';
import { BaseList } from '@/shared/lib/component/BaseList';
import { IComponent } from '@/shared/model';

import { UserTripListProps } from '../model/types';

export class UserTripList extends BaseList<Trip, UserTripListProps> {
    protected override listClassName = 'trip-list';
    protected override itemClassName = 'trip-list__item';

    constructor(props: UserTripListProps = {}) {
        super(props);
    }

    protected async loadData(): Promise<Trip[]> {
        try {
            return await getUserTripList();

        } catch { }

        return [];
    }

    protected override getItemId(item: Trip): number {
        return item.id;
    }

    protected override createItemComponent(item: Trip): IComponent {
        return new TripCard({ trip: item });
    }
}
