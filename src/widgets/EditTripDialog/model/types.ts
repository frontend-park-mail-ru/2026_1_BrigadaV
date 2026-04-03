import { User } from "@/shared/model";

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
