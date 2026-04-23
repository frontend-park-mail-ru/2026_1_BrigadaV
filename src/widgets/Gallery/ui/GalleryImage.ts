import { BaseComponent } from '@/shared/lib/component/BaseComponent';

export class GalleryImage extends BaseComponent<HTMLImageElement> {
    constructor(private src: string) { super(); }

    protected _render(): HTMLImageElement {
        const img = new Image();
        img.src = this.src;
        img.classList.add('gallery__image');
        return img;
    }
}
