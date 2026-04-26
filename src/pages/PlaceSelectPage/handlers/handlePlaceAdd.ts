import { addTripPlace } from '@/entities/Place';
import { Toast } from '@/shared/ui/Toast';
import { PlaceTogglePayload } from '@/widgets/PlaceSelectList/model/types';

export const handlePlaceAdd = async ({ data, tripId, addedPlaces }: { data: PlaceTogglePayload, tripId: number, addedPlaces: Set<number> }) => {
    const success = await addTripPlace(tripId, data.placeId, addedPlaces.size);
    if (success) {
        addedPlaces.add(data.placeId);
        Toast({ message: 'Место добавлено', type: 'success' });
    }
};
