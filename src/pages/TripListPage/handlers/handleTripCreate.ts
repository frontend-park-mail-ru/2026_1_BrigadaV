import { createTrip } from '@/entities/Trip/api/requests';
import { Trip } from '@/entities/Trip/model/types';
import { CreateTripDialog } from '@/widgets/CreateTripDialog';
import { CreateTripDialogPayload } from '@/widgets/CreateTripDialog/model/types';
import { UserTripList } from '@/widgets/UserTripList';

export const handleTripCreate = async ({ instance, data, tripList }: { instance: CreateTripDialog, data: CreateTripDialogPayload, tripList: UserTripList }): Promise<void> => {
    const tripCreateRes = await createTrip({ ...data, is_public: false });

    if (tripCreateRes.ok) {
        const newTrip: Trip = {
            id: tripCreateRes.data.id,
            title: data.title,
            location: data.location,
            places: [],
        };

        tripList.addItem(newTrip, 'afterbegin')
        instance.close();
    }
};
