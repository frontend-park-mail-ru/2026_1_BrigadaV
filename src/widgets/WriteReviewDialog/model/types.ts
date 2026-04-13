import { Place } from '@/entities/Place';
import { WriteReviewDialog } from '../ui/WriteReviewDialog';

export type WriteReviewDialogProps = {
    id: string;
    place: Place;
    onSubmit: (instance: WriteReviewDialog, data: FormData) => Promise<void>;
}
