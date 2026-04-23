import { TripCardPayload } from '@/entities/Trip/ui/TripCard/model/types';
import { Callback } from '@/shared/lib/eventBus/eventBus';
import { BasePage } from '@/shared/lib/page/BasePage';
import { AppState } from '@/shared/model';
import { injectHandlerContext } from '@/shared/utils/lib/injectHandlerContext';
import { CreateTripDialog } from '@/widgets/CreateTripDialog';
import { EditTripDialog, EditTripInitValues } from '@/widgets/EditTripDialog';
import { Header } from '@/widgets/Header';
import { UserTripList } from '@/widgets/UserTripList';

import { handleTripCreate } from '../handlers/handleTripCreate';
import { handleTripDelete } from '../handlers/handleTripDelete';
import { handleTripUpdate } from '../handlers/handleTripUpdate';
import styles from './style.module.scss';
import template from './TripListPage.hbs?compiled';

const CREATE_TRIP_DIALOG_ID = 'create-trip';

export class TripListPage extends BasePage {
    protected override template = template;
    protected override styles = styles;
    protected override pageClassName = 'trip-list-page';

    declare children: {
        header: Header;
        createTripDialog: CreateTripDialog;
        editTripDialog: EditTripDialog;
        userTripList: UserTripList;
    };

    protected override get eventHandlers(): Record<string, Callback> {
        return {
            'TripCard:open-edit': this.handleEditOpen,
            'CreateTripDialog:submit': injectHandlerContext(handleTripCreate, { tripList: this.children.userTripList }),
            'EditTripDialog:submit': injectHandlerContext(handleTripUpdate, { tripList: this.children.userTripList }),
            'EditTripDialog:delete': injectHandlerContext(handleTripDelete, { tripList: this.children.userTripList }),
        };
    }

    protected override getTemplateData(): Record<string, any> {
        return {
            createTripDialogId: CREATE_TRIP_DIALOG_ID,
            styles,
        };
    }

    public static async create(appState: AppState): Promise<TripListPage> {
        const page = new TripListPage(appState);
        page.setupComponents();
        return page;
    }

    private setupComponents() {
        this.children = {
            header: new Header({
                user: this.appState.currentUser,
            }),

            createTripDialog: new CreateTripDialog({
                id: CREATE_TRIP_DIALOG_ID,
            }),

            editTripDialog: new EditTripDialog({
                modalId: 'trip-edit',
            }),

            userTripList: new UserTripList(),
        };
    }

    private handleEditOpen = (data: TripCardPayload): void => {
        const editData: EditTripInitValues = {
            id: data.id,
            title: data.title,
            location: data.location,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description,
        };

        this.children.editTripDialog.show(editData);
    };

    // private handleTripCreate = async ({ instance, data }: {
    //     instance: CreateTripDialog,
    //     data: FormData
    // }): Promise<void> => {
    // }

    // private handleTripUpdate = async ({ instance, data, tripId }: {
    //     instance: CreateTripDialog,
    //     data: FormData
    // }): Promise<void> => {

    //     const success = await API.updateTrip(tripId, data.title, data.description, data.location, new Date(data['start-date']), new Date(data['end-date']));

    //     if (success.message === 'ok') {
    //         this.userTripList?.updateTrip(tripId, {
    //             id: tripId,
    //             title: data.title,
    //             description: data.description,
    //             location: data.location,
    //             startDate: new Date(data['start-date']),
    //             endDate: new Date(data['end-date']),
    //         })
    //         instance.close();
    //     }
    // }

}
