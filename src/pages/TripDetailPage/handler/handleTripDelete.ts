import { deleteTrip } from '@/entities/Trip/api';
import { TripBannerPayload } from '@/entities/Trip/ui/TripBanner/model/types';
import { navigate } from '@/shared/router';

export const handleTripDelete = async (data: TripBannerPayload): Promise<void> => {
    const error = await deleteTrip(data);

    if (!error) {
        navigate('/trip-list');
    }
};
