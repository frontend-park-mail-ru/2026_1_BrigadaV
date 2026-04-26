import { Field, Textarea } from '@/shared/ui';
import { ImageInput } from '@/shared/ui/ImageInput';

import { BaseComponent } from './BaseComponent';

type FormValue = string | File;

export abstract class BaseForm<TFields extends Record<string, FormValue>, TElement extends HTMLElement = HTMLElement> extends BaseComponent<TElement> {
    declare protected children: Record<keyof TFields, Field | Textarea | ImageInput>;

    protected abstract handleSubmit(data: TFields): void;

    protected _handleSubmit = (event: Event) => {
        event.preventDefault();
        this.clearErrors();

        const formData = this.getFormData(event.target as HTMLFormElement);

        this.handleSubmit(formData);
    };

    protected override initListeners(): void {
        super.initListeners();
        this.element?.addEventListener('submit', this._handleSubmit);
    }

    protected setFieldValues(data: Partial<Record<keyof TFields, string | number | undefined>>) {
        Object.entries(data).forEach(([fieldName, value]) => this.setFieldValue(fieldName, value));
    }

    public clear(): void {
        Object.values(this.children).forEach(field => field.setValue(''));
    }

    public clearErrors(): void {
        Object.values(this.children).forEach((field) => field.clearError());
    }

    public setFieldValue(field: string, value?: string | number): void {
        if (field in this.children && value) {
            this.children[field].setValue(value);
        }
    }

    public setFieldError(field: string, message: string): void {
        if (field in this.children) {
            this.children[field].setError(message);
        }
    }

    protected getFormData(formElement: HTMLFormElement): TFields {
        const formData = new FormData(formElement);
        return Object.fromEntries(formData.entries()) as TFields;
    }
}
