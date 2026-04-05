import styles from './style.module.scss';
import { AppState, IPage } from '@/shared/model';
import { Header } from '@/widgets/Header';
import { LikeButton } from '@/shared/ui';
import { injectComponents } from '@/shared/utils';
import { AttractionModel } from '../model/useAttraction';
import { ReviewItem } from '@/features/Review';
import { WorkingHours } from '@/widgets/WorkingHours';
import template from './AttractionPage.hbs?compiled';

export class AttractionPage implements IPage {
  private element: HTMLElement;
  private header: Header;
  private saveButton?: LikeButton;
  private reviewItems: ReviewItem[] = [];
  private workingHours: WorkingHours;

  constructor(private appState: AppState) {
    this.header = new Header({
      userSessionProps: { user: appState.currentUser },
      withSearch: true,
    });
    this.workingHours = new WorkingHours();

    this.element = document.createElement('div');
    this.element.classList.add(styles['attraction-page']);
    this.element.innerHTML = '<div style="padding: 2rem; text-align: center;">Загрузка...</div>';

    this.loadData();
  }

  private async loadData(): Promise<void> {
    const path = window.location.pathname;
    const match = path.match(/\/attraction\/(\d+)/);
    const id = match ? match[1] : '1';

    try {
      const attraction = await AttractionModel.getAttraction(id);
      const reviews = await AttractionModel.getReviews(id);

      this.saveButton = new LikeButton({
        className: 'attraction-save-btn',
        isLiked: attraction.is_liked,
      });

      this.reviewItems = reviews.map(review => new ReviewItem(review));

      this.updateDOM(attraction, reviews.length);
    } catch (error) {
      console.error('Failed to load attraction:', error);
      this.element.innerHTML = '<div style="padding: 2rem; text-align: center; color: red;">Ошибка загрузки</div>';
    }
  }

  private updateDOM(attraction: any, reviewsCount: number): void {
    const mainImage = attraction.photos?.[0]?.file_path || '';
    const sideImage1 = attraction.photos?.[1]?.file_path || '';
    const sideImage2 = attraction.photos?.[2]?.file_path || '';

    const html = template({
      styles,
      name: attraction.name,
      rating: '4.6',
      reviewsCount: reviewsCount,
      mainImage,
      sideImage1,
      sideImage2,
    });
    this.element.innerHTML = html;

    const reviewsSlot = this.element.querySelector('[data-slot="reviews-list"]');
    if (reviewsSlot) {
      this.reviewItems.forEach(item => {
        reviewsSlot.appendChild(item.render());
      });
    }

    injectComponents(this.element, {
      header: this.header,
      'save-button': this.saveButton,
      'working-hours': this.workingHours,
    });
  }

  public render(): HTMLElement {
    return this.element;
  }

  public destroy(): void {
  }
}