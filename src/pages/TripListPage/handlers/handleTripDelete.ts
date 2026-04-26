import { deleteTrip } from '@/entities/Trip/api/requests';
import { EditTripDialog } from '@/widgets/EditTripDialog';
import { DeleteTripPayload } from '@/widgets/EditTripDialog/model/types';
import { UserTripList } from '@/widgets/UserTripList';

export const handleTripDelete = async ({ instance, data, tripList }: { instance: EditTripDialog, data: DeleteTripPayload, tripList: UserTripList}): Promise<void> => {
    const error = await deleteTrip(data);

    if (!error) {
        tripList.removeItem(data.id);
        instance.close();
    }
};
