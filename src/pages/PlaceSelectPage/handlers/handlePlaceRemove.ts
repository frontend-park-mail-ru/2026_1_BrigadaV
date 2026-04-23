import { deleteTripPlace } from '@/entities/Place';
import { Toast } from '@/shared/ui/Toast';
import { PlaceTogglePayload } from '@/widgets/PlaceSelectList/model/types';

export const handlePlaceRemove = async ({ data, tripId, addedPlaces }: { data: PlaceTogglePayload, tripId: number, addedPlaces: Set<number> }) => {
    const error = await deleteTripPlace(tripId, data.placeId);

    if (!error) {

        addedPlaces.delete(data.placeId);
        Toast({ message: 'Место удалено', type: 'error' });
    }
};
