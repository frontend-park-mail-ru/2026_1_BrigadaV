import { ValidationRule } from '@/shared/model';
import { Field, Textarea } from '@/shared/ui';
import { ImageInput } from '@/shared/ui/ImageInput';

import { BaseComponent } from './BaseComponent';

type FormValue = string | File;

export abstract class BaseForm<TFields extends Record<string, FormValue>, TElement extends HTMLElement = HTMLElement> extends BaseComponent<TElement> {
    declare protected children: Record<keyof TFields, Field | Textarea | ImageInput>;
    protected isSubmitting = false;

    protected abstract handleSubmit(data: TFields): void;

    protected get validationRules(): ValidationRule<TFields>[] {
        return [];
    }

    protected _handleSubmit = async (event: Event) => {
        event.preventDefault();
        if (this.isSubmitting) return;

        this.clearErrors();

        const formData = this.getFormData(event.target as HTMLFormElement);
        if (!this.validate(formData)) {
            return;
        }

        this.setLoading(true);
        await this.handleSubmit(formData);
        this.setLoading(false);
    };

    protected override initListeners(): void {
        super.initListeners();
        this.element?.addEventListener('submit', this._handleSubmit);
        this.element?.addEventListener('cancel', this.handleCancel);
    }

    private handleCancel = (event: Event) => {
        event.preventDefault();

        if (this.isSubmitting) return;

        if ('close' in this && typeof this.close === 'function') {
            this.close();
        } else if (this.element instanceof HTMLDialogElement) {
            this.element.close();
        }
    };

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

    public setLoading(isLoading: boolean): void {
        this.isSubmitting = isLoading;

        const buttons = this.element?.querySelectorAll('button');
        const submitBtn = this.element?.querySelector('button[type="submit"]') as HTMLButtonElement;

        buttons?.forEach(btn => {
            btn.disabled = isLoading;
        });

        if (submitBtn) {
            submitBtn.dataset.state = isLoading ? 'loading' : 'idle';
        }
    }

    protected getFormData(formElement: HTMLFormElement): TFields {
        const formData = new FormData(formElement);
        return Object.fromEntries(formData.entries()) as TFields;
    }

    protected validate(data: TFields): boolean {
        const rules = this.validationRules;
        if (rules.length === 0) return true;

        const failures = rules.filter(rule => rule.isInvalid(data));

        if (failures.length > 0) {
            failures.forEach(({ field, message }) =>
                this.setFieldError(field as string, message)
            );
            return false;
        }

        return true;
    }
}
