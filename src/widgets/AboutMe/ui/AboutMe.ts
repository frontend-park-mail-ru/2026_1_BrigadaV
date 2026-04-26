import './style.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { formatDate, stringToElement } from '@/shared/utils';

import { AboutMeProps } from '../model/types';
import template from './AboutMe.hbs?compiled';

export class AboutMe extends BaseComponent {
    constructor(private props: AboutMeProps) { super(); }

    protected override _render(): HTMLElement {
        return stringToElement(template({
            ...this.props,
            ...formatDate(this.props.joinDate),
            noSuggested: this.props.hasAbout,
            // noSuggested: this.props.hasAbout & this.props.hasReviews
        }));
    }
}
