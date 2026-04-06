import { User } from '@/entities/User';

export type EditTripDialogProps = {
    id: string;
    user: User;
}

export type EditTripInitValues = {
    title: string;
    location: string;
    startDate: Date;
    endDate: Date;
    description?: string;
}
