import { TripCardProps } from '@/entities/Trip';
import { eventBus } from '@/shared/lib';
import { AppState, IPage } from '@/shared/model';
import { injectComponents } from '@/shared/utils';
import { CreateTripDialog } from '@/widgets/CreateTripDialog';
import { EditTripDialog, EditTripInitValues } from '@/widgets/EditTripDialog';
import { Header } from '@/widgets/Header';
import { UserTripList } from '@/widgets/UserTripList';

import styles from './style.module.scss';
import template from './TripListPage.hbs?compiled';
import { API } from '@/shared/api';

const CREATE_TRIP_DIALOG_ID = 'create-trip';

export class TripListPage implements IPage {
    private element?: HTMLElement;
    private header?: Header;
    private createTripDialog?: CreateTripDialog;
    private userTripList?: UserTripList;
    private editTripDialog?: EditTripDialog;

    private constructor(private appState: AppState) { }

    public static async create(appState: AppState): Promise<TripListPage> {
        const page = new TripListPage(appState);
        page.setupComponents();
        return page;
    }

    private setupComponents() {
        this.header = new Header({
            userSessionProps: {
                user: this.appState.currentUser,
            },
        });

        this.createTripDialog = new CreateTripDialog({
            id: CREATE_TRIP_DIALOG_ID,
            user: this.user,
        });

        this.userTripList = new UserTripList({
            user: this.user,
        });

        this.editTripDialog = new EditTripDialog({
            id: 'trip-edit',
            user: this.user,
        });
    }

    private get user() {
        return this.appState.currentUser!;
    }

    private initListeners(): void {
        eventBus.on('TripCard:edit', this.handleTripEdit);
        eventBus.on('CreateTripDialog:submit', this.handleTripCreate);
        eventBus.on('EditTripDialog:submit', this.handleTripUpdate);
        eventBus.on('EditTripDialog:delete', this.handleTripDelete);
    }

    private handleTripEdit = ({ trip }: TripCardProps): void => {
        if (!this.editTripDialog) return;

        const editData: EditTripInitValues = {
            tripId: trip.id,
            title: trip.title,
            location: trip.location,
            startDate: trip.startDate,
            endDate: trip.endDate,
            description: trip.description,
        };

        this.editTripDialog.show(editData);
    };

    private handleTripCreate = async ({ instance, data }: {
        instance: CreateTripDialog,
        data: FormData
    }): Promise<void> => {
        const success = await API.createTrip({ title: data.title, location: data.location, isPublic: false });

        if (success) {
            this.userTripList?.addTrip('afterbegin', {
                id: success.id,
                title: data.title,
                location: data.location,
            })
            instance.close();
        }
    }

    private handleTripUpdate = async ({ instance, data, tripId }: {
        instance: CreateTripDialog,
        data: FormData
    }): Promise<void> => {

        const success = await API.updateTrip(tripId, data.title, data.description, data.location, new Date(data['start-date']), new Date(data['end-date']));

        if (success.message === 'ok') {
            this.userTripList?.updateTrip(tripId, {
                id: tripId,
                title: data.title,
                description: data.description,
                location: data.location,
                startDate: new Date(data['start-date']),
                endDate: new Date(data['end-date']),
            })
            instance.close();
        }
    }

    private handleTripDelete = async ({ instance, tripId }: {
        instance: CreateTripDialog,
    }): Promise<void> => {
        const error = await API.deleteTrip(tripId);

        if (!error) {
            this.userTripList?.removeTrip(tripId);
            instance.close();
        }
    }

    public render(): HTMLElement {
        this.element = document.createElement('div');

        const html = template({
            createTripDialogId: CREATE_TRIP_DIALOG_ID,
            styles,
        });

        this.element.classList.add(styles['trip-list-page']);
        this.element.innerHTML = html;

        injectComponents(this.element, {
            'header': this.header,
            'create-trip-dialog': this.createTripDialog,
            'user-trip-list': this.userTripList,
            'edit-trip-dialog': this.editTripDialog,
        });

        this.initListeners();

        return this.element;
    }

    public destroy(): void {
        eventBus.off('TripCard:edit', this.handleTripEdit);
        eventBus.off('CreateTripDialog:submit', this.handleTripCreate);
        this.header?.destroy();
    }
}
