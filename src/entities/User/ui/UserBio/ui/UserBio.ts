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

    private update = (data: Partial<UserBioProps['user']>) => {
        const updateField = (refName: string, value?: string) => {
            const el = this.fields[refName];
            if (!el) return;

            if (value) {
                el.textContent = value;
                el.classList.remove('hidden');
            } else if (value === '') {
                el.classList.add('hidden');
            }
        };

        if (data.nickname !== undefined) updateField('nickname', data.nickname);

        if (data.city !== undefined) {
            updateField('location', data.city);
        }

        if (data.about !== undefined) updateField('about', data.about);

        if (data.avatar && this.fields['avatar'] instanceof HTMLImageElement) {
            this.fields['avatar'].src = data.avatar;
            this.fields['avatar'].classList.remove('avatar--default');
        }
    };

    protected override _render(): HTMLElement {
        return stringToElement(template({
            ...this.props,
            location: this.makeTemplateLocation(),
        }));
    }
}
