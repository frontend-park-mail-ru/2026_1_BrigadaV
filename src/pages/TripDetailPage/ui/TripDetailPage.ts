import styles from './style.module.scss';

import template from './TripDetailPage.hbs?compiled';
import { AppState, IPage } from '@/shared/model';
import { Header } from '@/widgets/Header';
import { injectComponents } from '@/shared/utils';
import { TripBanner } from '@/entities/Trip';
import { PlaceList } from '@/widgets/PlaceList';

export class TripDetailPage implements IPage {
    private element?: HTMLElement;
    private header?: Header;
    private tripBanner?: TripBanner;
    private placeList?: PlaceList;

    constructor(private appState: AppState) {
        this.header = new Header({
            userSessionProps: {
                user: appState.currentUser,
            },
        });

        this.tripBanner = new TripBanner({
            className: styles['trip-banner'],
            trip: {
                id: 1,
                title: 'Поиск лепреконов',
                startDate: new Date(2026, 2, 5),
                endDate: new Date(2026, 2, 17),
                location: 'Англия',
                preview: '/mock/place/tripbig.png',
            }
        });

        this.placeList = new PlaceList({
            className: styles['place-list'],
            tripId: 1,
        });
    }

    private get user() {
        return this.appState.currentUser!;
    }

    public render(): HTMLElement {
        this.element = document.createElement('div');
        const html = template({ styles });

        this.element.classList.add(styles['trip-detail-page']);
        this.element.innerHTML = html;

        injectComponents(this.element, {
            'header': this.header,
            'trip-banner': this.tripBanner,
            'place-list': this.placeList,
        });

        return this.element;
    }

    public destroy(): void { }
}
