import './style.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { Callback } from '@/shared/lib/eventBus/eventBus';
import { stringToElement } from '@/shared/utils';

import { UserBioProps } from '../model/types';
import template from './UserBio.hbs?compiled';

export class UserBio extends BaseComponent {
    protected override get eventHandlers(): Record<string, Callback> {
        return {
            'user:update': this.update,
        };
    }

    private fields: Record<string, HTMLElement> = {};

    private get user() {
        return this.props.user;
    }

    constructor(private props: UserBioProps) { super(); }

    private makeTemplateLocation() {
        const location = [];

        if (this.user.city) location.push(this.user.city);
        if (this.user.country) location.push(this.user.country);

        return location.join(', ');
    }

    private initFields(element: HTMLElement) {
        const refs = element.querySelectorAll<HTMLElement>('[data-ref]');
        refs.forEach((item) => {
            const key = item.dataset.ref!;
            this.fields[key] = item;
        });
    }

    private update = (data: Partial<UserBioProps['user']>) => {
        console.log(data);

        if (data.nickname) this.fields['nickname'].textContent = data.nickname;
        if (data.city) this.fields['location'].textContent = data.city;
        if (data.about) this.fields['about'].textContent = data.about;

        console.log(this.fields);

        if (data.avatar && this.fields['avatar'] instanceof HTMLImageElement) {
            this.fields['avatar'].src = data.avatar;
            this.fields['avatar'].classList.remove('avatar--default');
        }
    };

    protected override _render(): HTMLElement {
        const element = stringToElement(template({
            ...this.props,
            location: this.makeTemplateLocation(),
        }));
        this.initFields(element);
        return element;
    }
}
