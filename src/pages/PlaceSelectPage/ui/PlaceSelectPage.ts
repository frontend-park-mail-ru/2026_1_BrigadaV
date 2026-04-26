import { fetchAddedPlaces } from '@/entities/Place';
import { Callback } from '@/shared/lib/eventBus/eventBus';
import { BasePage } from '@/shared/lib/page/BasePage';
import { AppState } from '@/shared/model';
import { Field } from '@/shared/ui';
import { injectHandlerContext } from '@/shared/utils/lib/injectHandlerContext';
import { Header } from '@/widgets/Header';
import { PlaceSelectList } from '@/widgets/PlaceSelectList';

import { handlePlaceAdd } from '../handlers/handlePlaceAdd';
import { handlePlaceRemove } from '../handlers/handlePlaceRemove';
import { PlaceSelectPageParams } from '../model/types';
import template from './PlaceSelectPage.hbs?compiled';
import styles from './style.module.scss';

export class PlaceSelectPage extends BasePage {
    protected override template = template;
    protected override styles = styles;
    protected override pageClassName = 'place-select-page';

    declare children: {
        header: Header;
        filter: Field;
        placeList: PlaceSelectList;
    };

    protected override get eventHandlers(): Record<string, Callback> {
        return {
            'PlaceCard:add': injectHandlerContext(handlePlaceAdd, { tripId: this.tripId, addedPlaces: this.addedPlaces }),
            'PlaceCard:remove': injectHandlerContext(handlePlaceRemove, { tripId: this.tripId, addedPlaces: this.addedPlaces }),
        };
    }

    private addedPlaces!: Set<number>;
    private tripId!: number;

    public static async create(appState: AppState, parameters: PlaceSelectPageParams) {
        const page = new PlaceSelectPage(appState);

        page.addedPlaces = new Set(await fetchAddedPlaces(parameters.tripId));
       
        page.tripId = parameters.tripId;

        page.setupComponents();
        return page;
    }

    private setupComponents() {
        this.children = {
            header: new Header({
                user: this.appState.currentUser,
            }),

            filter: new Field({
                type: 'text',
                rightIcon: '/icons/search.svg',
                onRightIconClick: focus,
                attributes: {
                    placeholder: 'Введите название места',
                    disabled: '',
                }
            }),

            placeList: new PlaceSelectList({
                addedPlaces: this.addedPlaces,
            }),
        };
    }

    protected override getTemplateData(): Record<string, any> {
        return {
            styles,
            tripId: this.tripId
        };
    }
}
