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
import { Toast } from '@/shared/ui/Toast';
import { Field } from '@/shared/ui';

export class PlaceSelectPage implements IPage {
    private element?: HTMLElement;
    private filter?: Field;
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

        this.filter = new Field({
            type: 'text',
            rightIcon: '/icons/search.svg',
            onRightIconClick: focus,
            attributes: {
                placeholder: 'Введите название места',
                disabled: '',
            }
        });
    }

    private initListeners() {
        eventBus.on('PlaceCard:add', this.handleAdd);
        eventBus.on('PlaceCard:remove', this.handleRemove);
    }

    private handleAdd = async ({ placeId }: { placeId: number }) => {
        const success = await API.addPlaceToTrip(this.tripId, placeId, this.addedPlaces.size);
        if (success) {
            this.addedPlaces.add(placeId);
            Toast({ message: 'Место добавлено', type: 'success' })
        }
    }

    private handleRemove = async ({ placeId }: { placeId: number }) => {
        const error = await API.removePlaceFromTrip(this.tripId, placeId);
        if (!error) {
            this.addedPlaces.delete(placeId);
            Toast({ message: 'Место удалено', type: 'error' })
        }
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
            'filter': this.filter,
        });

        this.initListeners();

        return this.element;
    }

    public destroy(): void {
        eventBus.off('PlaceCard:add', this.handleAdd);
        eventBus.off('PlaceCard:remove', this.handleRemove);
        this.header?.destroy();
    }
}
