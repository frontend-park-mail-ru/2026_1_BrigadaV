import { createTrip } from '@/entities/Trip/api/requests';
import { CreateTripDialog } from '@/widgets/CreateTripDialog';
import { CreateTripDialogPayload } from '@/widgets/CreateTripDialog/model/types';
import { UserTripList } from '@/widgets/UserTripList';

export const handleTripCreate = async ({ instance, data, tripList }: { instance: CreateTripDialog, data: CreateTripDialogPayload, tripList: UserTripList }): Promise<void> => {
    const success = await createTrip({ ...data, is_public: false });

    if (success) {
        tripList.addItem({
            id: success.id,
            title: data.title,
            location: data.location,
        }, 'afterbegin');
        instance.close();
    }
};
