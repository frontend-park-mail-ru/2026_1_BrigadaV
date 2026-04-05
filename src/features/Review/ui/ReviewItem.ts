import './style.scss';
import { stringToElement } from '@/shared/utils';
import template from './ReviewItem.hbs?compiled';
import type { Review } from '@/pages/AttractionPage/model/useAttraction';

export class ReviewItem {
  private element?: HTMLElement;

  constructor(private review: Review) {}

  private renderStars(rating: number) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  public render(): HTMLElement {
    const stars = this.renderStars(this.review.rating);
    this.element = stringToElement(template({
      ...this.review,
      stars,
    }));
    return this.element;
  }
}