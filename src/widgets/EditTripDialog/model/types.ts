import { UserAuth } from '@/entities/User';

export type EditTripDialogProps = {
    id: string;
    user: UserAuth;
}

export type EditTripInitValues = {
    title: string;
    location: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
}
