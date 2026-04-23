import { BaseList } from '@/shared/lib/component/BaseList';
import { IComponent } from '@/shared/model';

import { GalleryProps } from '../model/types';
import { GalleryImage } from './GalleryImage';

type PhotoEntity = { url: string; id: number };

export class Gallery extends BaseList<PhotoEntity, GalleryProps> {
    protected listClassName = 'gallery';
    protected itemClassName = 'gallery__item';

    constructor(props: GalleryProps) {
        super(props);
    }

    protected async loadData(): Promise<PhotoEntity[]> {
        return this.props.photos.map((url, index) => ({
            url,
            id: index
        }));
    }

    protected getItemId(item: PhotoEntity): number {
        return item.id;
    }

    protected createItemComponent(item: PhotoEntity): IComponent {
        return new GalleryImage(item.url);
    }
}
