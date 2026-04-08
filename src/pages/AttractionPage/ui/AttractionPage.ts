import { Place } from '@/entities/Place';
import { AppState, IPage } from '@/shared/model';
import { LikeButton } from '@/shared/ui';
import { injectComponents, pluralize } from '@/shared/utils';
import { Gallery } from '@/widgets/Gallery';
import { Header } from '@/widgets/Header';
import { ReviewList } from '@/widgets/ReviewList';
import { WorkingHours } from '@/widgets/WorkingHours';

import template from './AttractionPage.hbs?compiled';
import styles from './style.module.scss';
import { WriteReviewDialog } from '@/widgets/WriteReviewDialog';

const WRITE_REVIEW_DIALOG_ID = 'write-review';

// TODO Minify mock images
export class AttractionPage implements IPage {
    private element?: HTMLElement;
    private header?: Header;
    private likeButton?: LikeButton;
    private gallery?: Gallery;
    private reviewList?: ReviewList;
    private workingHours?: WorkingHours;
    private writeReviewDialog?: WriteReviewDialog;

    constructor(private appState: AppState) {
        this.header = new Header({
            userSessionProps: { user: appState.currentUser },
            withSearch: true,
        });

        if (appState.currentUser) {
            this.likeButton = new LikeButton({
                className: styles['attraction-meta__like'],
                label: 'Сохранить',
                isLiked: this.place.isLiked,
            })
        }

        this.gallery = new Gallery({
            className: styles['gallery']
        });
        // TODO add photo count from this.place
        this.gallery.addAttribute('data-count', '3');

        this.reviewList = new ReviewList({
            className: styles['reviews__list'],
        });

        this.workingHours = new WorkingHours({
            className: styles['working-hours']
        });

        this.writeReviewDialog = new WriteReviewDialog({
            id: WRITE_REVIEW_DIALOG_ID,
            place: this.place,
        })
    }

    get place(): Place {
        return {
            id: 1,
            name: 'Британский музей',
            location: '',
            country: '',
            price: 0,
            isLiked: true,
            rating: 4.6,
        }
    }

    public render(): HTMLElement {
        this.element = document.createElement('div');
        const html = template({
            place: this.place,

            // TODO move to somewhere
            reviewCount: `(74520 ${pluralize(74520, { one: 'отзыв', few: 'отзыва', many: 'отзывов' })})`,
            writeReviewDialogId: WRITE_REVIEW_DIALOG_ID,
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
        });

        return this.element;
    }

    public destroy(): void {
    }
}
