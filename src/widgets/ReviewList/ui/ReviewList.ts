import './style.scss';

import { ReviewCard } from '@/entities/Review';
import { mapReview } from '@/entities/Review/lib/mapReview';
import { API } from '@/shared/api';
import { AbstractList } from '@/shared/ui/AbstractList';

import { ReviewListProps } from '../model/types';
import { Review } from '@/entities/Review/model/types';

export class ReviewList extends AbstractList<ReviewCard, ReviewListProps> {
    constructor(props: ReviewListProps) {
        super(props);
        this.element.classList.add('review-list');
    }

    protected async loadData(): Promise<ReviewCard[]> {
        try {
            const reviewData = await API.getPlaceReviews(this.props.placeId);
            return reviewData.map((reviewRaw) => new ReviewCard({ review: mapReview(reviewRaw) }));

        } catch (error) {
            console.error(error);
        }

        return [];
    }

    protected renderItem(item: ReviewCard): HTMLElement {
        const li = document.createElement('li');
        li.classList.add('review-list__item');
        li.appendChild(item.render());

        return li;
    }

    public addReview(position: InsertPosition, review: Review): void {
        const newCard = new ReviewCard({ review });
        const li = this.renderItem(newCard);
        this.element.insertAdjacentElement(position, li);
    }

    public removeReview(reviewId: number): void {
        const itemToRemove = this.element.querySelector(`[data-id="${reviewId}"]`)?.closest('.review-list__item');

        if (itemToRemove) {
            itemToRemove.remove();
        }
    }
}
