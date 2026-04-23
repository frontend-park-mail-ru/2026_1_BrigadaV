import './style.scss';

import { ReviewCard } from '@/entities/Review';
import { fetchPlaceReviews } from '@/entities/Review/api';
import { Review } from '@/entities/Review/model/types';
import { BaseList } from '@/shared/lib/component/BaseList';
import { IComponent } from '@/shared/model';

import { ReviewListProps } from '../model/types';

export class ReviewList extends BaseList<Review, ReviewListProps> {
    protected override listClassName = 'review-list';
    protected override itemClassName = 'review-list__item';

    protected override async loadData(): Promise<Review[]> {
        try {
            return await fetchPlaceReviews(this.props.placeId);

        } catch { }

        return [];
    }

    protected override getItemId(item: Review): number {
        return item.id;
    }

    protected override createItemComponent(item: Review): IComponent {
        return new ReviewCard({ review: item });
    }
}
