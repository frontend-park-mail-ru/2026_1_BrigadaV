import './style.scss';

import { Field } from '@/shared/ui';
import { stringToElement } from '@/shared/utils';

import { AuthFormProps } from '../model/types';
import template from './AuthForm.hbs?compiled';

export class AuthForm {
    private element?: HTMLElement;
    private fields: Record<string, Field> = {};

    constructor(private props: AuthFormProps) {
        this.props.fields.forEach((fieldProps) => {
            const fieldName = fieldProps.attributes?.name;
            if (fieldName) {
                this.fields[fieldName] = new Field({
                    ...fieldProps,
                    className: 'auth-form__field',
                });
            }
        });
    }

    private handleSubmit = async (event: Event): Promise<void> => {
        const target = event.target;
        if (!(target instanceof HTMLFormElement)) {
            return;
        }

        event.preventDefault();
        this.clearErrors();

        const formData = new FormData(target);
        await this.props.onSubmit(this, formData);
    }

    public setFieldError(field: string, message: string): void {
        if (field in this.fields) {
            this.fields[field].setError(message);
        }
    }

    public clearErrors(): void {
        Object.values(this.fields).forEach((field) => field.clearError());
    }

    public render(): HTMLElement {
        this.element = stringToElement(template(this.props));

        Object.entries(this.fields).forEach(([name, field]) => {
            this.element?.querySelector(`[data-slot="${name}"]`)
                ?.replaceWith(field.render())
        })

        this.element?.addEventListener('submit', this.handleSubmit);

        return this.element;
    }
}
