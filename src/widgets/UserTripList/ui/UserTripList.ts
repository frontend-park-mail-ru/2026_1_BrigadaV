import './style.scss';

import { TripCard } from '@/entities/Trip';

import { UserTripListProps } from '../model/types';
import { AbstractList } from '@/shared/ui/AbstractList';

export class UserTripList extends AbstractList<TripCard, UserTripListProps> {
    constructor(props: UserTripListProps) {
        super(props);
        this.element.classList.add('trip-list');
    }

    protected async loadData(): Promise<TripCard[]> {
        return [
            new TripCard({
                trip: {
                    id: 1,
                    title: 'Поиск лепреконов',
                    startDate: new Date(2026, 2, 5),
                    endDate: new Date(2026, 2, 17),
                    location: 'Англия',
                    preview: '/mock/place/trip1.png',
                }
            }),
            new TripCard({
                trip: {
                    id: 12,
                    title: 'Отдых на курорте',
                    startDate: new Date(2026, 11, 25),
                    endDate: new Date(2027, 0, 5),
                    location: 'Дубай',
                    preview: '/mock/place/trip2.png',
                }
            })

        ];
    }

    protected renderItem(item: TripCard): HTMLElement {
        const li = document.createElement('li');
        li.classList.add('trip-list__item');
        li.appendChild(item.render());

        return li;
    }
}
