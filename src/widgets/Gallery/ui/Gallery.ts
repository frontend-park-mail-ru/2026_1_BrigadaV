import './style.scss';

import { GalleryProps } from '../model/types';
import { AbstractList } from '@/shared/ui/AbstractList';

export class Gallery extends AbstractList<HTMLImageElement, GalleryProps> {
    constructor(props: GalleryProps) {
        super(props);
        this.element.classList.add('gallery');
    }

    protected async loadData(): Promise<HTMLImageElement[]> {
        const img1 = new Image();
        img1.src = '/mock/attraction/british1.jpg';

        const img2 = new Image();
        img2.src = '/mock/attraction/british2.jpg';

        const img3 = new Image();
        img3.src = '/mock/attraction/british3.jpg';

        return [img1, img2, img3];
    }

    protected renderItem(item: HTMLImageElement): HTMLElement {
        const li = document.createElement('li');
        li.classList.add('gallery__item');
        li.appendChild(item);

        return li;
    }

    public addAttribute(name: string, value: string): void {
        this.element.setAttribute(name, value);
    }
}
