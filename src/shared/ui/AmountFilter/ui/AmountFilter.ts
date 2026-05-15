import './style.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';

import { Field } from '../../Field';
import { AmountFilterProps } from '../model/types';
import template from './AmountFilter.hbs?compiled';

export class AmountFilter extends BaseComponent {
    declare children: {
        numberField: Field;
    };

    constructor(private props: AmountFilterProps) {
        super();

        this.children = {
            numberField: new Field({
                type: 'number',
                attributes: {
                    min: 0,
                    value: 0,
                },
                onInput: props.onInput,
            }),
        };
    }

    protected override _render(): HTMLElement {
        return stringToElement(template(this.props));
    }
}
