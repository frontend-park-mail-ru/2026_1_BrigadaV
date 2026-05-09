import './style.scss';

import { LoginFields } from '@/pages/LoginPage/model/types';
import { SignUpFields } from '@/pages/SignupPage/model/types';
import { eventBus } from '@/shared/lib';
import { BaseForm } from '@/shared/lib/component/BaseForm';
import { ValidationRule } from '@/shared/model';
import { Field } from '@/shared/ui';
import { stringToElement } from '@/shared/utils';

import { AuthFormProps } from '../model/types';
import template from './AuthForm.hbs?compiled';

export class AuthForm<T extends LoginFields | SignUpFields> extends BaseForm<T> {
    constructor(private props: AuthFormProps<T>) {
        super();

        props.fields.forEach((fieldProps) => {
            const fieldName = fieldProps.attributes?.name;
            if (fieldName) {
                this.children[fieldName as keyof T] = new Field({
                    ...fieldProps,
                    className: 'auth-form__field',
                });
            }
        });
    }

    protected override get validationRules(): ValidationRule<T>[] {
        return this.props.validationRules ?? [];
    }

    protected override handleSubmit = async (data: LoginFields | SignUpFields): Promise<void> => {
        await eventBus.emit(this.props.submitEventName, { instance: this, data });
    };

    protected _render(): HTMLElement {
        this.element = stringToElement(template(this.props));
        return this.element;
    }
}
