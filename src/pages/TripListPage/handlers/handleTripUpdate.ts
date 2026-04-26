import { updateTrip } from '@/entities/Trip/api/requests';
import { EditTripDialog } from '@/widgets/EditTripDialog';
import { UpdateTripPayload } from '@/widgets/EditTripDialog/model/types';
import { UserTripList } from '@/widgets/UserTripList';

export const handleTripUpdate = async ({ instance, data, tripList }: { instance: EditTripDialog, data: UpdateTripPayload, tripList: UserTripList }): Promise<void> => {
    const success = await updateTrip(data);

    if (success) {
        tripList.updateItem(data);
        instance.close();
    }
};
