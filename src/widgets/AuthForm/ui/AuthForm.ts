import './style.scss';

import { LoginFields, LoginPayload } from '@/pages/LoginPage/model/types';
import { SignUpFields, SignUpPayload } from '@/pages/SignupPage/model/types';
import { eventBus } from '@/shared/lib';
import { BaseForm } from '@/shared/lib/component/BaseForm';
import { Field } from '@/shared/ui';
import { stringToElement } from '@/shared/utils';

import { AuthFormProps } from '../model/types';
import template from './AuthForm.hbs?compiled';

export class AuthForm extends BaseForm<LoginPayload | SignUpPayload> {
    declare children: Record<string, Field>;

    constructor(private props: AuthFormProps) {
        super();

        props.fields.forEach((fieldProps) => {
            const fieldName = fieldProps.attributes?.name;
            if (fieldName) {
                this.children[fieldName] = new Field({
                    ...fieldProps,
                    className: 'auth-form__field',
                });
            }
        });
    }

    protected override handleSubmit = (data: LoginFields | SignUpFields): void => {
        eventBus.emit(this.props.submitEventName, { instance: this, data });
    };

    protected _render(): HTMLElement {
        this.element = stringToElement(template(this.props));

        return this.element;
    }
}
