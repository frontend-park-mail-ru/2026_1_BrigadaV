import { fetchPlace } from '@/entities/Place';
import { PlaceSummary } from '@/entities/Place/model/types';
import { ReviewCardPayload } from '@/entities/Review/ui/ReviewCard/model/types';
import { Callback } from '@/shared/lib/eventBus/eventBus';
import { BasePage } from '@/shared/lib/page/BasePage';
import { AppState } from '@/shared/model';
import { LikeButton } from '@/shared/ui';
import { formatDate, pluralize } from '@/shared/utils';
import { injectHandlerContext } from '@/shared/utils/lib/injectHandlerContext';
import { Gallery } from '@/widgets/Gallery';
import { Header } from '@/widgets/Header';
import { ReviewDetailsModal } from '@/widgets/ReviewDetailsModal';
import { ReviewList } from '@/widgets/ReviewList';
import { WorkingHours } from '@/widgets/WorkingHours';
import { WriteReviewDialog } from '@/widgets/WriteReviewDialog';

import { handleReviewCreate } from '../handlers/handleReviewCreate';
import { handleReviewDelete } from '../handlers/handleReviewDelete';
import { AttractionPageParameters } from '../model/types';
import template from './AttractionPage.hbs?compiled';
import styles from './style.module.scss';

const WRITE_REVIEW_DIALOG_ID = 'write-review';
const REVIEW_DETAILS_MODAL_ID = 'review-details';

export class AttractionPage extends BasePage {
    protected override template = template;
    protected override styles = styles;
    protected override pageClassName = 'attraction-page';

    declare children: {
        header: Header;
        likeButton?: LikeButton;
        gallery: Gallery;
        reviewList: ReviewList;
        workingHours: WorkingHours;
        writeReviewDialog: WriteReviewDialog;
        reviewDetailsModal: ReviewDetailsModal;
    };
    protected override get eventHandlers(): Record<string, Callback> {
        return {
            'ReviewCard:show-details': this.handleShowDetails,
            'WriteReviewDialog:submit': injectHandlerContext(handleReviewCreate, { reviewList: this.children.reviewList, user: this.appState.currentUser, placeId: this.place.id }),
            'ReviewDetailsModal:delete': injectHandlerContext(handleReviewDelete, { reviewList: this.children.reviewList }),
        };
    }

    private place!: PlaceSummary;

    public static async create(appState: AppState, parameters: AttractionPageParameters): Promise<AttractionPage> {
        const page = new AttractionPage(appState);

        const place = await fetchPlace(parameters.placeId);
        page.place = place;

        page.setupComponents();
        return page;
    }

    private setupComponents() {
        const authorized = Boolean(this.appState.currentUser);

        this.children = {
            header: new Header({
                user: this.appState.currentUser,
                withSearch: true,
            }),

            ...(authorized && {
                likeButton: new LikeButton({
                    className: styles['attraction-meta__like'],
                    label: 'Сохранить',
                    isLiked: this.place.isLiked,
                })
            }),

            gallery: new Gallery({
                className: styles['gallery'],
                photos: this.place.image ? [this.place.image] : [],
            }),

            reviewList: new ReviewList({
                className: styles['reviews__list'],
                placeId: this.place.id,
            }),

            workingHours: new WorkingHours({
                className: styles['working-hours']
            }),

            writeReviewDialog: new WriteReviewDialog({
                id: WRITE_REVIEW_DIALOG_ID,
                place: this.place,
            }),

            reviewDetailsModal: new ReviewDetailsModal({
                modalId: REVIEW_DETAILS_MODAL_ID,
            })
        };
    }

    private handleShowDetails = (data: ReviewCardPayload): void => {
        const totalReviews = this.place.reviewCount;
        const formattedDate = formatDate(data.createdAt);
        const isOwner = this.appState.currentUser?.id === data.author.id;

        this.children.reviewDetailsModal.show({
            data: {
                id: data.id,
                authorName: data.author.nickname,
                avatarUrl: data.author.avatar,
                placeName: this.place.name,
                dateText: formattedDate.date,
                dateIso: formattedDate.isoDate,
                rating: data.rating,
                title: data.title,
                content: data.content || '',
                reviewCountText: `${totalReviews} ${pluralize(totalReviews, {
                    one: 'отзыв',
                    few: 'отзыва',
                    many: 'отзывов'
                })}`,
                isOwner: isOwner
            }
        });
    };

    protected override getTemplateData(): Record<string, any> {
        return {
            place: this.place,
            reviewCount: `(${this.place.reviewCount} ${pluralize(this.place.reviewCount, { one: 'отзыв', few: 'отзыва', many: 'отзывов' })})`,
            writeReviewDialogId: WRITE_REVIEW_DIALOG_ID,
            isAuth: Boolean(this.appState.currentUser),
            styles
        };
    }
}
