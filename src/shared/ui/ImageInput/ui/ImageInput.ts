import './style.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { Toast } from '@/shared/ui/Toast';
import { stringToElement } from '@/shared/utils';

import { ImageInputProps } from '../model/types';
import template from './ImageInput.hbs?compiled';

export class ImageInput extends BaseComponent {
    private previewUrl?: string;

    constructor(private props: ImageInputProps) {
        super();
        this.props.maxSizeMb = this.props.maxSizeMb || 10;
    }

    protected override initListeners(): void {
        super.initListeners();
        const input = this.element?.querySelector('input');
        input?.addEventListener('change', this.handleFileChange);
    }

    private handleFileChange = (event: Event): void => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        if (file.size > (this.props.maxSizeMb! * 1024 * 1024)) {
            Toast({ message: `Файл слишком большой! Лимит ${this.props.maxSizeMb} Мб.`, type: 'error' });
            target.value = '';
            return;
        }

        if (!file.type.startsWith('image/')) {
            Toast({ message: 'Неверный формат изображения', type: 'error' });
            target.value = '';
            return;
        }

        if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
        this.previewUrl = URL.createObjectURL(file);

        const previewImg = this.element?.querySelector('[data-ref="preview"]') as HTMLImageElement;
        if (previewImg) {
            previewImg.src = this.previewUrl;
            previewImg.classList.remove('image-input__preview--default');
        }
    };

    public setError(message: string): void {
        if (!this.element) return;

        this.element.classList.add('image-input--error');
        const messageSpan = this.element.querySelector('.image-input__message');
        if (messageSpan) {
            messageSpan.textContent = message;
        }
    }

    public clearError(): void {
        if (!this.element) return;

        this.element.classList.remove('image-input--error');
        const messageSpan = this.element.querySelector('.image-input__message');
        if (messageSpan) {
            messageSpan.textContent = '';
        }
    }

    public setValue(value?: string): void {
        if (!this.element) return;

        const previewImg = this.element.querySelector('[data-ref="preview"]') as HTMLImageElement;
        if (previewImg && value) {
            if (this.previewUrl && this.previewUrl !== value) {
                URL.revokeObjectURL(this.previewUrl);
                this.previewUrl = undefined;
            }

            previewImg.src = value;
            previewImg.classList.remove('image-input__preview--default');
        }
    }

    public override destroy(): void {
        if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
        super.destroy();
    }

    protected override _render(): HTMLElement {
        return stringToElement(template(this.props));
    }
}
