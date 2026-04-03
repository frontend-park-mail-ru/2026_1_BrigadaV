import './style.scss';


import template from './TripListPage.hbs?compiled';
import { AppState, IPage } from '@/shared/model';
import { Header } from '@/widgets/Header';
import { injectComponents } from '@/shared/utils';
import { CreateTripDialog } from '@/widgets/CreateTripDialog';
import { UserTripList } from '@/widgets/UserTripList';
import { eventBus } from '@/shared/lib';
import { EditTripDialog, EditTripInitValues } from '@/widgets/EditTripDialog';
import { TripCardProps } from '@/entities/Trip';

const CREATE_TRIP_DIALOG_ID = 'create-trip';

export class TripListPage implements IPage {
    private element?: HTMLElement;
    private header?: Header;
    private createTripDialog?: CreateTripDialog;
    private userTripList?: UserTripList;
    private editTripDialog?: EditTripDialog;

    constructor(private appState: AppState) {
        this.header = new Header({
            userSessionProps: {
                user: appState.currentUser,
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
    }

    private handleTripEdit = (tripData: TripCardProps): void => {
        if (!this.editTripDialog) return;

        const editData: EditTripInitValues = {
            title: tripData.title,
            location: tripData.location,
            startDate: tripData.startDate,
            endDate: tripData.endDate,
            description: tripData.description,
        };

        this.editTripDialog.show(editData);
    }

    public render(): HTMLElement {
        this.element = document.createElement('div');
        const html = template({
            createTripDialogId: CREATE_TRIP_DIALOG_ID,
        });

        this.element.classList.add('trip-list-page');
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
    }
}
