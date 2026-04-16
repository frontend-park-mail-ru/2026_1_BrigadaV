import styles from './style.module.scss';
import template from './PlaceSelectPage.hbs?compiled';
import { AppState, IPage } from '@/shared/model';
import { Header } from '@/widgets/Header';
import { AnotherPlaceList } from '@/widgets/AnotherPlaceList';
import { injectComponents } from '@/shared/utils';
import { PlaceSelectPageParams } from '../model/types';
import { eventBus } from '@/shared/lib';
import { AddButton } from '@/shared/ui/AddButton';
import { API } from '@/shared/api';

export class PlaceSelectPage implements IPage {
    private element?: HTMLElement;
    private header?: Header;
    private placeList?: AnotherPlaceList;
    private addedPlaces!: Set<number>;

    private constructor(private appState: AppState, private tripId: number) { }

    public static async create(appState: AppState, parameters: PlaceSelectPageParams) {
        const page = new PlaceSelectPage(appState, parameters.tripId);

        page.addedPlaces = new Set(await API.getAddedPlaces(parameters.tripId));

        page.setupComponents();
        return page;
    }

    private setupComponents() {
        this.header = new Header({
            userSessionProps: {
                user: this.appState.currentUser,
            }
        });

        this.placeList = new AnotherPlaceList({
            addedPlaces: this.addedPlaces,
        });
    }

    private initListeners() {
        eventBus.on('AddButton:click', this.handleAdd);
    }

    private handleAdd = ({ placeId }: { placeId: number }) => {

    }

    public render(): HTMLElement {
        this.element = document.createElement('div');

        const html = template({
            styles,
            tripId: this.tripId,
        });

        this.element.classList.add(styles['place-select-page']);
        this.element.innerHTML = html;

        injectComponents(this.element, {
            'header': this.header,
            'place-list': this.placeList,
        });

        this.initListeners();

        return this.element;
    }

    public destroy(): void { }
}
