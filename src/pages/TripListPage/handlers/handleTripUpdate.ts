import { updateTrip } from '@/entities/Trip/api/requests';
import { EditTripDialog } from '@/widgets/EditTripDialog';
import { UpdateTripPayload } from '@/widgets/EditTripDialog/model/types';
import { UserTripList } from '@/widgets/UserTripList';

export const handleTripUpdate = async ({ instance, data, tripList }: { instance: EditTripDialog, data: UpdateTripPayload, tripList: UserTripList }): Promise<void> => {
    const updateTripRes = await updateTrip(data);

    if (updateTripRes.ok) {
        tripList.updateItem({
            ...data,
            places: [],
        });
        instance.close();
    }
};
