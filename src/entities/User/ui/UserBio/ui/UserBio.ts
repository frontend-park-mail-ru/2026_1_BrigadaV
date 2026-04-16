import './style.scss';

import { stringToElement } from '@/shared/utils';

import { UserBioProps } from '../model/types';
import template from './UserBio.hbs?compiled';
import { eventBus } from '@/shared/lib';

export class UserBio {
    private element?: HTMLElement;
    private fields: Record<string, HTMLElement> = {};

    constructor(private props: UserBioProps) { }

    private makeTemplateLocation() {
        const location = [];

        if (this.props.user.city) location.push(this.props.user.city);
        if (this.props.user.country) location.push(this.props.user.country);

        return location.join(', ');
    }

    private initFields(): void {
        if (!this.element) return;

        const refs = this.element.querySelectorAll<HTMLElement>('[data-ref]');
        refs.forEach((item) => {
            const key = item.getAttribute('data-ref');
            if (key) {
                this.fields[key] = item;
            }
        });
    }

    private initListeners() {
        eventBus.on('user:update', this.update);
    }

    private update = (data) => {
        this.fields['nickname'].textContent = data.nickname;
        this.fields['city'].textContent = data.city;
        this.fields['about'].textContent = data.about;
    }

    public render(): HTMLElement {
        this.element = stringToElement(template({
            ...this.props,
            location: this.makeTemplateLocation(),
        }));

        this.initFields();
        this.initListeners();
        return this.element;
    }

    public destroy() {
        eventBus.off('user:update', this.update);
    }
}
