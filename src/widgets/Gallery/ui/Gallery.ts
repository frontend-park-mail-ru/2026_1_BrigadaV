import './style.scss';

import { AbstractList } from '@/shared/ui/AbstractList';

import { GalleryProps } from '../model/types';

export class Gallery extends AbstractList<HTMLImageElement, GalleryProps> {
    constructor(props: GalleryProps) {
        super(props);
        this.element.classList.add('gallery');
    }

    protected async loadData(): Promise<HTMLImageElement[]> {
        const result = [];
        for (const photo of this.props.photos) {
            const image = new Image();
            image.src = photo;

            result.push(image);
        }
        return result;
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
