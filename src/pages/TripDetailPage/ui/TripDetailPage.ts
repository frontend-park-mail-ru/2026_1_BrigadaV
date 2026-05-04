import { TripBanner } from '@/entities/Trip';
import { fetchTrip } from '@/entities/Trip/api';
import { Trip } from '@/entities/Trip/model/types';
import { Callback } from '@/shared/lib/eventBus/eventBus';
import { BasePage } from '@/shared/lib/page/BasePage';
import { AppState } from '@/shared/model';
import { Header } from '@/widgets/Header';
import { TripPlaceList } from '@/widgets/TripPlaceList/ui/TripPlaceList';

import { AlbumDialog } from '@/entities/Trip/ui/AlbumDialog';

import { handleTripDelete } from '../handler/handleTripDelete';
import { TripDetailPageParams } from '../model/types';
import styles from './style.module.scss';
import template from './TripDetailPage.hbs?compiled';

export class TripDetailPage extends BasePage {
    protected override template = template;
    protected override styles = styles;
    protected override pageClassName = 'trip-detail-page';

    declare children: {
        header: Header,
        tripBanner: TripBanner,
        placeList: TripPlaceList,
        albumDialog: AlbumDialog;
    };

    protected override get eventHandlers(): Record<string, Callback> {
        return {
            'TripBanner:delete': handleTripDelete,
        };
    }

    protected override getTemplateData(): Record<string, unknown> {
        return {
            styles,
            tripId: this.trip.id,
        };
    }

    private trip!: Trip;

    public static async create(appState: AppState, parameters: TripDetailPageParams): Promise<TripDetailPage> {
        const page = new TripDetailPage(appState);

        const trip = await fetchTrip(parameters.tripId);
        page.trip = trip;

        page.setupComponents();
        return page;
    }

    private setupComponents() {
        this.children = {
            header: new Header({
                user: this.appState.currentUser,
            }),

            tripBanner: new TripBanner({
                className: styles['trip-banner'],
                trip: this.trip,
            }),

            placeList: new TripPlaceList({
                className: styles['place-list'],
                places: this.trip.places,
            }),

            albumDialog: new AlbumDialog({ modalId: 'album-dialog-modal' })
        };
    }

        protected override initListeners(): void {
        super.initListeners();
        const trigger = this.element?.querySelector('[data-ref="album-trigger"]');
        trigger?.addEventListener('click', () => {
            this.children.albumDialog.show(this.trip.id);
        });
    }
}
