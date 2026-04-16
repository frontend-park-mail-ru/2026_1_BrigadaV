import { mapTrip, TripBanner } from '@/entities/Trip';
import { AppState, IPage } from '@/shared/model';
import { injectComponents } from '@/shared/utils';
import { Header } from '@/widgets/Header';
import { PlaceList } from '@/widgets/PlaceList';

import styles from './style.module.scss';
import template from './TripDetailPage.hbs?compiled';
import { API } from '@/shared/api';
import { TripDetailPageParams } from '../model/types';
import { Trip } from '@/entities/Trip/model/types';
import { eventBus } from '@/shared/lib';
import { navigate } from '@/shared/router';

export class TripDetailPage implements IPage {
    private trip!: Trip;
    private element?: HTMLElement;
    private header?: Header;
    private tripBanner?: TripBanner;
    private placeList?: PlaceList;

    private constructor(private appState: AppState) { }

    public static async create(appState: AppState, parameters: TripDetailPageParams): Promise<TripDetailPage> {
        const page = new TripDetailPage(appState);

        const tripData = await API.getTripById(parameters.tripId);
        console.log(tripData);

        page.trip = mapTrip(tripData);

        page.setupComponents();
        return page;
    }

    private setupComponents() {
        this.header = new Header({
            userSessionProps: {
                user: this.appState.currentUser,
            },
        });

        this.tripBanner = new TripBanner({
            className: styles['trip-banner'],
            trip: this.trip
        });

        this.placeList = new PlaceList({
            className: styles['place-list'],
            places: this.trip.places,
        });
    }

    private initListeners() {
        eventBus.on('TripBanner:delete', this.handleTripDelete);
    }

    private handleTripDelete = async (tripId: number) => {
        const error = await API.deleteTrip(tripId);

        if (!error) {
            navigate('/trip-list');
        }
    }

    public render(): HTMLElement {
        this.element = document.createElement('div');
        const html = template({ styles, tripId: this.trip.id });

        this.element.classList.add(styles['trip-detail-page']);
        this.element.innerHTML = html;

        injectComponents(this.element, {
            'header': this.header,
            'trip-banner': this.tripBanner,
            'place-list': this.placeList,
        });

        this.initListeners();

        return this.element;
    }

    public destroy(): void { }
}
