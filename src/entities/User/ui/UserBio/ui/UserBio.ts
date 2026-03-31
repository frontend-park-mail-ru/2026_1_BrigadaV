import './style.scss';

import { stringToElement } from '@/shared/utils';

import { UserBioProps } from '../model/types';
import template from './UserBio.hbs?compiled';

export class UserBio {
    private element?: HTMLElement;

    constructor(private props: UserBioProps) { }

    public render(): HTMLElement {
        this.element = stringToElement(template(this.props));
        return this.element;
    }
}
