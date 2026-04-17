import './style.scss';

import { formatDate, stringToElement } from '@/shared/utils';

import { AboutMeProps } from '../model/types';
import template from './AboutMe.hbs?compiled';
import { IComponent } from '@/shared/model';

export class AboutMe implements IComponent {
    private element?: HTMLElement;

    constructor(private props: AboutMeProps) { }

    public render(): HTMLElement {
        this.element = stringToElement(template({
            ...this.props,
            ...formatDate(this.props.user.createdAt),
            hasSuggested: !this.props.user.about,
        }));
        return this.element;
    }
}
