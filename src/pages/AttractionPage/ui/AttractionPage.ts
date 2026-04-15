import { mapPlace, Place } from '@/entities/Place';
import { Review } from '@/entities/Review/model/types';
import { eventBus } from '@/shared/lib';
import { AppState, IPage } from '@/shared/model';
import { LikeButton } from '@/shared/ui';
import { injectComponents, pluralize } from '@/shared/utils';
import { Gallery } from '@/widgets/Gallery';
import { Header } from '@/widgets/Header';
import { ReviewDetailsModal } from '@/widgets/ReviewDetailsModal';
import { ReviewList } from '@/widgets/ReviewList';
import { WorkingHours } from '@/widgets/WorkingHours';
import { WriteReviewDialog } from '@/widgets/WriteReviewDialog';

import template from './AttractionPage.hbs?compiled';
import styles from './style.module.scss';
import { API } from '@/shared/api';
import { AttractionPageParameters } from '../model/types';
import { handleSubmit } from '../handlers/handleReviewCreate';
import { handleReviewDelete } from '../handlers/handleReviewDelete';

const WRITE_REVIEW_DIALOG_ID = 'write-review';
const REVIEW_DETAILS_MODAL_ID = 'review-details';

export class AttractionPage implements IPage {
    private place!: Place;
    private element?: HTMLElement;
    private header?: Header;
    private likeButton?: LikeButton;
    private gallery?: Gallery;
    private reviewList?: ReviewList;
    private workingHours?: WorkingHours;
    private writeReviewDialog?: WriteReviewDialog;
    private reviewDetailsModal?: ReviewDetailsModal;

    private constructor(private appState: AppState) { }

    public static async create(appState: AppState, parameters: AttractionPageParameters): Promise<AttractionPage> {
        const page = new AttractionPage(appState);

        const placeData = await API.getPlaceById(parameters.placeId);
        page.place = placeData;

        page.setupComponents();
        return page;
    }

    private setupComponents() {
        this.header = new Header({
            userSessionProps: { user: this.appState.currentUser },
            withSearch: true,
        });

        if (this.appState.currentUser) {
            this.likeButton = new LikeButton({
                className: styles['attraction-meta__like'],
                label: 'Сохранить',
                isLiked: this.place.is_liked,
            });
        }

        this.gallery = new Gallery({
            className: styles['gallery'],
            photos: [this.place.photo_url],
        });
        // TODO add photo count from this.place
        this.gallery.addAttribute('data-count', '2');

        this.reviewList = new ReviewList({
            className: styles['reviews__list'],
            placeId: this.place.id,
        });

        this.workingHours = new WorkingHours({
            className: styles['working-hours']
        });

        this.writeReviewDialog = new WriteReviewDialog({
            id: WRITE_REVIEW_DIALOG_ID,
            place: this.place,
            onSubmit: (instance, data) => handleSubmit(instance, data, this.place.id, (newReview) => this.reviewList?.addReview('afterbegin', newReview))
        });

        this.reviewDetailsModal = new ReviewDetailsModal({
            id: REVIEW_DETAILS_MODAL_ID,
            user: this.appState.currentUser,
            onDelete: (instance, reviewId) => handleReviewDelete(instance, reviewId, (reviewId) => this.reviewList?.removeReview(reviewId)),
        });
    }

    private initListeners(): void {
        eventBus.on('ReviewCard:showDetails', this.handleShowDetails);
    }

    private handleShowDetails = (review: Review): void => {
        if (!this.reviewDetailsModal) return;

        this.reviewDetailsModal.show({
            review,
            placeName: this.place.name,
            reviewCount: this.place.reviewCount,
        });
    }

    public render(): HTMLElement {
        this.element = document.createElement('div');
        const html = template({
            place: this.place,

            // TODO move to somewhere
            reviewCount: `(${this.place.reviewCount} ${pluralize(this.place.reviewCount, { one: 'отзыв', few: 'отзыва', many: 'отзывов' })})`,
            writeReviewDialogId: WRITE_REVIEW_DIALOG_ID,
            isAuth: !!this.appState.currentUser,
            styles
        });

        this.element.classList.add(styles['attraction-page']);
        this.element.style.setProperty('--rating', this.place.rating.toString());
        this.element.innerHTML = html;

        injectComponents(this.element, {
            'header': this.header,
            'like-button': this.likeButton,
            'gallery': this.gallery,
            'review-list': this.reviewList,
            'working-hours': this.workingHours,
            'write-review-dialog': this.writeReviewDialog,
            'review-details-modal': this.reviewDetailsModal,
        });

        this.initListeners();

        return this.element;
    }

    public destroy(): void {
        eventBus.off('ReviewCard:showDetails', this.handleShowDetails);
    }
}
